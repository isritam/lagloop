import type { ConceptLabel } from "../types";

/**
 * diagnoseConfusion
 *
 *   Student confusion → AI classifier → Concept label → Deterministic recovery content
 *
 * This is the classifier abstraction. For the MVP it runs fully offline
 * with keyword/phrase matching so the demo never depends on a live AI
 * API. It ONLY returns a ConceptLabel — never explanations, questions,
 * or grading — so a real AI classifier could later be swapped in here
 * without giving AI any control over educational content.
 */
export function diagnoseConfusion(confusionText: string): ConceptLabel {
  const text = confusionText.trim().toLowerCase();

  if (text.length === 0) {
    return "UNKNOWN";
  }

  const mentionsOrder =
    text.includes("order") ||
    text.includes("switch the matri") ||
    text.includes("swap the matri") ||
    text.includes("commut") ||
    (/\bab\b/.test(text) && /\bba\b/.test(text));

  const mentionsAssociativity = text.includes("associat");

  const mentionsVectorMultiplication =
    text.includes("vector") &&
    (text.includes("multiply") || text.includes("multiplication"));

  const mentionsComposition =
    text.includes("what does matrix multiplication") ||
    text.includes("what is matrix multiplication") ||
    (text.includes("mean") && text.includes("multipli")) ||
    text.includes("what is happening when you multiply");

  if (mentionsOrder) return "matrix_multiplication_order";
  if (mentionsAssociativity) return "associativity";
  if (mentionsVectorMultiplication) return "matrix_vector_multiplication";
  if (mentionsComposition) return "matrix_composition";

  return "UNKNOWN";
}
