// ─────────────────────────────────────────────
// Screen navigation
// ─────────────────────────────────────────────

export type Screen = "lesson" | "signal" | "recovery" | "closed";

// ─────────────────────────────────────────────
// Language
// ─────────────────────────────────────────────

export type Language = "english" | "hinglish";

// ─────────────────────────────────────────────
// Concept classification (legacy deterministic path — not part of the
// main flow anymore, kept for possible fallback/experimentation)
// ─────────────────────────────────────────────

export type ConceptLabel =
  | "matrix_multiplication_order"
  | "matrix_composition"
  | "matrix_vector_multiplication"
  | "associativity"
  | "UNKNOWN";

// ─────────────────────────────────────────────
// Video / lesson source
// ─────────────────────────────────────────────

export type VideoSource =
  | {
      type: "youtube";
      videoId: string;
      url: string;
    }
  | {
      type: "upload";
      url: string;
    };

// ─────────────────────────────────────────────
// Timestamped transcript
// ─────────────────────────────────────────────

export interface TranscriptSegment {
  startSeconds: number;
  text: string;
}

// ─────────────────────────────────────────────
// Lesson data
// ─────────────────────────────────────────────

export interface LessonData {
  title: string;
  subject: string;
  source: VideoSource;
  /** Legacy field from the old fixed-lag-point prototype. No longer
   * used to control the product flow — confusion can now happen at
   * any timestamp, captured live in App state. Left in place only
   * because other data in lesson.ts may still reference it. */
  lagTimestampSeconds: number;
  transcript: TranscriptSegment[];
}

// ─────────────────────────────────────────────
// Retrieval question
// ─────────────────────────────────────────────

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
}

// ─────────────────────────────────────────────
// Legacy deterministic recovery content (used by the old
// diagnose.ts / recovery.ts pair, not the main AI flow)
// ─────────────────────────────────────────────

export interface RecoveryContent {
  concept: ConceptLabel;
  missingConnection: string;
  explanation: string;
  question: Question;
}

// ─────────────────────────────────────────────
// AI-generated recovery content (the new main flow)
//
// Produced by src/lib/ai.ts, validated before it ever reaches React
// state or RecoveryPage.
// ─────────────────────────────────────────────

export interface AIRecoveryContent {
  answer: string;
  question: Question;
}

// ─────────────────────────────────────────────
// Answer status for retrieval question
// ─────────────────────────────────────────────

export type AnswerStatus = "unanswered" | "correct" | "incorrect";
