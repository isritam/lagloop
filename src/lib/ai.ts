import type { AIRecoveryContent, Language, TranscriptSegment } from "../types";
import { getTranscriptContext, formatTranscriptContextAsText } from "./transcript";

// HACKATHON ONLY:
// VITE_GEMINI_API_KEY is exposed in the client bundle.
// Move Gemini calls to a backend before production.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// NOTE: model name may need to be updated to whatever Gemini model your
// API key currently has access to.
const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export class AIRecoveryError extends Error {}

interface AskLearningAssistantParams {
  question: string;
  currentTimeSeconds: number;
  transcript: TranscriptSegment[];
  language: Language;
}

function buildPrompt({
  question,
  currentTimeSeconds,
  transcript,
  language,
}: AskLearningAssistantParams): string {
  const context = getTranscriptContext(transcript, currentTimeSeconds, 60, 60);
  const contextText = formatTranscriptContextAsText(context);

  const languageInstruction =
    language === "hinglish"
      ? "Respond in Hinglish (a natural mix of Hindi and English, written in Latin script)."
      : "Respond in English.";

  return `
You are a concise learning assistant embedded inside a video lesson.

Answer the learner's question using only information supported by the lesson transcript excerpt provided below.
Explain the missing conceptual connection in simple, plain language.
Do not invent facts that are not supported by the transcript.
The learner's timestamp represents the point where they became confused, so prioritize the nearby transcript context over the rest of the lesson.
If the question cannot be answered from the provided lesson context, explicitly say the lesson context does not clearly cover it instead of hallucinating an answer.

${languageInstruction}

After the explanation, write exactly one short retrieval question with exactly two answer options (one correct, one incorrect) that tests whether the learner understood your explanation — not memorization of exact wording from the transcript.

Lesson transcript excerpt (around ${currentTimeSeconds} seconds into the video):
"""
${contextText}
"""

Learner's timestamp when they got confused: ${currentTimeSeconds} seconds.

Learner's question:
"""
${question}
"""

Respond with ONLY valid JSON, no markdown code fences, no extra commentary, matching exactly this shape:
{
  "answer": "string - the concise explanation",
  "question": {
    "prompt": "string - the retrieval question",
    "options": [
      { "id": "a", "label": "string - option A" },
      { "id": "b", "label": "string - option B" }
    ],
    "correctOptionId": "the id (\\"a\\" or \\"b\\") of the correct option"
  }
}
`.trim();
}

function extractJsonFromText(text: string): unknown {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const jsonText = fencedMatch ? fencedMatch[1] : trimmed;

  try {
    return JSON.parse(jsonText);
  } catch {
    throw new AIRecoveryError("The AI response was not valid JSON.");
  }
}

function validateAIRecoveryContent(data: unknown): AIRecoveryContent {
  if (typeof data !== "object" || data === null) {
    throw new AIRecoveryError("The AI response was not an object.");
  }

  const record = data as Record<string, unknown>;
  const answer = record.answer;
  const question = record.question;

  if (typeof answer !== "string" || answer.trim().length === 0) {
    throw new AIRecoveryError("The AI response is missing a valid explanation.");
  }

  if (typeof question !== "object" || question === null) {
    throw new AIRecoveryError("The AI response is missing a valid question.");
  }

  const questionRecord = question as Record<string, unknown>;
  const prompt = questionRecord.prompt;
  const options = questionRecord.options;
  const correctOptionId = questionRecord.correctOptionId;

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    throw new AIRecoveryError("The AI response is missing a valid question prompt.");
  }

  if (!Array.isArray(options) || options.length !== 2) {
    throw new AIRecoveryError("The AI response must contain exactly two options.");
  }

  const parsedOptions = options.map((option, index) => {
    if (
      typeof option !== "object" ||
      option === null ||
      typeof (option as Record<string, unknown>).id !== "string" ||
      typeof (option as Record<string, unknown>).label !== "string" ||
      (option as Record<string, unknown>).id === "" ||
      (option as Record<string, unknown>).label === ""
    ) {
      throw new AIRecoveryError(`Option ${index} in the AI response is malformed.`);
    }
    const optionRecord = option as Record<string, unknown>;
    return {
      id: optionRecord.id as string,
      label: optionRecord.label as string,
    };
  });

  const ids = parsedOptions.map((option) => option.id);
  if (new Set(ids).size !== 2) {
    throw new AIRecoveryError("The AI response's option ids must be unique.");
  }

  if (typeof correctOptionId !== "string" || !ids.includes(correctOptionId)) {
    throw new AIRecoveryError("The AI response's correctOptionId does not match an option.");
  }

  return {
    answer: answer.trim(),
    question: {
      prompt: prompt.trim(),
      options: parsedOptions,
      correctOptionId,
    },
  };
}

/**
 * askLearningAssistant
 *
 * The ONLY place in the app that talks to Gemini. Takes the learner's
 * question plus context, returns validated AIRecoveryContent or throws
 * an AIRecoveryError. Never touches navigation, loading state, or
 * answer checking — that all stays in App.tsx / RecoveryPage.tsx.
 */
export async function askLearningAssistant(
  params: AskLearningAssistantParams
): Promise<AIRecoveryContent> {
  if (!GEMINI_API_KEY) {
    throw new AIRecoveryError(
      "Missing VITE_GEMINI_API_KEY. Add it to your .env file to enable AI recovery."
    );
  }

  const prompt = buildPrompt(params);

  let response: Response;
  try {
    response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    });
  } catch {
    throw new AIRecoveryError("Could not reach the AI service. Check your connection.");
  }

  if (!response.ok) {
    throw new AIRecoveryError(`The AI service returned an error (${response.status}).`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new AIRecoveryError("The AI service returned an unreadable response.");
  }

  const text = (payload as any)?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof text !== "string" || text.trim().length === 0) {
    throw new AIRecoveryError("The AI service returned an empty response.");
  }

  const parsedJson = extractJsonFromText(text);
  return validateAIRecoveryContent(parsedJson);
}

export async function generateSuggestedQuestion({
  transcript,
  currentTimeSeconds,
  language,
}: {
  transcript: TranscriptSegment[];
  currentTimeSeconds: number;
  language: Language;
}): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new AIRecoveryError(
      "Missing VITE_GEMINI_API_KEY. Add it to your .env file to enable AI suggestions."
    );
  }

  const context = getTranscriptContext(
    transcript,
    currentTimeSeconds,
    45,
    45
  );

  const contextText =
    formatTranscriptContextAsText(context);

  const languageInstruction =
    language === "hinglish"
      ? "Write the question naturally in Hinglish, using Latin script."
      : "Write the question in clear, natural English.";

  const prompt = `
You are the suggestion engine for LagLoop.

A learner just pressed "I lost the link" while watching a lesson.

Create ONE specific suggested question that the learner could use to describe the conceptual connection they are confused about.

Use ONLY the transcript context below.

Rules:
- Focus on the ideas closest to the learner's timestamp.
- The question must be specific to what is being explained.
- Do not say "What did I miss?"
- Do not say "Can you explain this?"
- Do not repeat the lesson title.
- Ask about a relationship, cause, mechanism, transformation, comparison, or reasoning step.
- Make it sound like a real student asking a useful question.
- Keep it under 20 words.
- Return ONLY the question.
- Do not use quotation marks.
- ${languageInstruction}

Learner confusion timestamp:
${currentTimeSeconds} seconds

Transcript context:
"""
${contextText}
"""
`.trim();

  let response: Response;

  try {
    response = await fetch(
      `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 80,
          },
        }),
      }
    );
  } catch {
    throw new AIRecoveryError(
      "Could not reach the AI service. Check your connection."
    );
  }

  if (!response.ok) {
    throw new AIRecoveryError(
      `The AI service returned an error (${response.status}).`
    );
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new AIRecoveryError(
      "The AI service returned an unreadable response."
    );
  }

  const text =
    (payload as any)?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (
    typeof text !== "string" ||
    text.trim().length === 0
  ) {
    throw new AIRecoveryError(
      "The AI service returned an empty suggestion."
    );
  }

  return text
    .trim()
    .replace(/^["']|["']$/g, "");
}
