import type { ConceptLabel, RecoveryContent } from "../types";

// Deterministic, approved recovery content.
//
// diagnose.ts turns learner confusion into a ConceptLabel.
// This file turns a ConceptLabel into fixed, human-approved content.
// AI (if ever introduced upstream) never touches what appears below.
//
// For this MVP, only the primary lag point — matrix_multiplication_order —
// has full recovery content authored. Other labels exist in the type
// system so diagnose.ts can classify them correctly, but App.tsx falls
// back to the primary concept's content when a full entry isn't defined,
// keeping the demo reliable without pretending to cover concepts we
// haven't actually authored content for yet.
export const recoveryContentMap: Partial<Record<ConceptLabel, RecoveryContent>> = {
  matrix_multiplication_order: {
    concept: "matrix_multiplication_order",
    missingConnection:
      "Matrix multiplication represents composition of transformations, and composition generally depends on order.",
    explanation:
      "Matrix multiplication isn't just combining numbers — it represents applying transformations one after another. " +
      "If you rotate a shape and then shear it, you get a different result than if you shear it first and then rotate it. " +
      "Since the transformations happen in a different order, the final transformation can be different.",
    question: {
      prompt:
        "Why can changing the order of two matrix multiplications change the result?",
      options: [
        {
          id: "a",
          label:
            "A. Because the matrices represent transformations, and applying those transformations in a different order can produce a different final transformation.",
        },
        {
          id: "b",
          label:
            "B. Because matrix multiplication randomly changes the numbers depending on which matrix comes first.",
        },
      ],
      correctOptionId: "a",
    },
  },
};

// Suggested confusion phrases shown on the SignalPage, by language.
export const suggestedPhrases: Record<"english" | "hinglish", string> = {
  english: "Why does changing the order of matrix multiplication change the result?",
  hinglish: "Matrix multiply karte time order kyun matter karta hai?",
};

// Fallback concept used when a confusion doesn't clearly match a label,
// or when a matched label doesn't yet have authored recovery content.
export const DEFAULT_CONCEPT: ConceptLabel = "matrix_multiplication_order";
