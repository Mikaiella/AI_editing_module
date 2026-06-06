export const AI_MIN_CHARS = 200;
export const AI_MAX_CHARS = 2000;
export const AI_MAX_PARAGRAPHS = 1;
export const AI_MIN_LETTER_DENSITY = 0.4;

export type AiSelectionReason =
  | "noSelection"
  | "tooShort"
  | "tooLong"
  | "tooManyParagraphs"
  | "lowQuality"
  | "ready";

export interface AiSelectionValidationResult {
  isValid: boolean;
  reason: AiSelectionReason;
  contentLength: number;
  paragraphCount: number;
  letterDensity: number;
}

export function validateAISelection(text: string): AiSelectionValidationResult {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      reason: "noSelection",
      contentLength: 0,
      paragraphCount: 0,
      letterDensity: 0,
    };
  }

  const normalizedText = text.replace(/\s+/g, " ").trim();

  const contentLength = normalizedText.length;

  const paragraphCount = text
    .split("\n")
    .filter((p) => p.trim().length > 0).length;

  const lettersCount = (normalizedText.match(/\p{L}/gu) || []).length;

  const letterDensity = contentLength === 0 ? 0 : lettersCount / contentLength;

  if (paragraphCount > AI_MAX_PARAGRAPHS) {
    return {
      isValid: false,
      reason: "tooManyParagraphs",
      contentLength,
      paragraphCount,
      letterDensity,
    };
  }

  if (contentLength < AI_MIN_CHARS) {
    return {
      isValid: false,
      reason: "tooShort",
      contentLength,
      paragraphCount,
      letterDensity,
    };
  }

  if (contentLength > AI_MAX_CHARS) {
    return {
      isValid: false,
      reason: "tooLong",
      contentLength,
      paragraphCount,
      letterDensity,
    };
  }

  if (lettersCount === 0 || letterDensity < AI_MIN_LETTER_DENSITY) {
    return {
      isValid: false,
      reason: "lowQuality",
      contentLength,
      paragraphCount,
      letterDensity,
    };
  }

  return {
    isValid: true,
    reason: "ready",
    contentLength,
    paragraphCount,
    letterDensity,
  };
}
