import type { StudyCardSchema } from "@source/client";

export function isStudyCardSchema(obj: unknown): obj is StudyCardSchema {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const requiredFields: Record<
    keyof StudyCardSchema,
    (value: unknown) => boolean
  > = {
    id: (value) => typeof value === "number",
    term: (value) => typeof value === "string",
    content: (value) => value === null || typeof value === "string",
    boc2: (value) => value === null || typeof value === "string",
    boc3: (value) => value === null || typeof value === "string",
    boc4: (value) => value === null || typeof value === "string",
    formula: (value) => value === null || typeof value === "string",
    img: (value) => value === null || typeof value === "string",
    sound: (value) => value === null || typeof value === "string",
    bocId: () => true, // Optional field, skip validation
    boxId: () => true, // Optional field, skip validation
    createMethod: () => true, // Optional field, skip validation
    diffLvl: (value) => typeof value === "number",
    subject: (value) => value === null || typeof value === "string",
    topic: () => true, // Optional field, skip validation
    customFront: (value) => value === null || typeof value === "string",
    customBack: (value) => value === null || typeof value === "string",
    language: (value) => value === null || typeof value === "string",
    lenOption: () => true, // Optional field, skip validation
    qminOption: () => true, // Optional field, skip validation
    qmaxOption: () => true, // Optional field, skip validation
    category: (value) => typeof value === "string",
    deckId: () => true, // Optional field, skip validation
    srsInterval: (value) => typeof value === "number",
    timeUpdated: (value) => value === null || typeof value === "string",
    timesAsked: (value) => typeof value === "number",
    timesCorrect: (value) => typeof value === "number",
    timesCorrectRow: (value) => typeof value === "number",
    timeCreated: (value) => typeof value === "string",
    edited: (value) => typeof value === "boolean",
    fav: (value) => typeof value === "boolean",
    shareId: () => true, // Optional field, skip validation
    uniqueId: (value) => typeof value === "number",
    batchNumber: (value) => typeof value === "number",
  };

  for (const [field, validator] of Object.entries(requiredFields)) {
    if (
      !(field in obj) ||
      !validator((obj as Record<string, unknown>)[field])
    ) {
      return false;
    }
  }

  return true;
}

export function isArrayOfStudyCardSchema(
  arrayToAnalyze: unknown
): arrayToAnalyze is StudyCardSchema[] {
  if (!Array.isArray(arrayToAnalyze)) {
    return false;
  }
  if (
    isStudyCardSchema(arrayToAnalyze[0]) &&
    isStudyCardSchema(arrayToAnalyze[arrayToAnalyze.length - 1])
  ) {
    return true;
  }
  return false;
}
