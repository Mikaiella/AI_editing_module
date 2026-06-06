import { describe, it, expect } from "vitest";
import {
  validateAISelection,
  AI_MIN_CHARS,
  AI_MAX_CHARS,
  AI_MAX_PARAGRAPHS,
  AI_MIN_LETTER_DENSITY,
} from "@/utils/validate-ai-selection";

describe("validateAISelection", () => {
  it("should return noSelection for empty string", () => {
    const result = validateAISelection("");
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe("noSelection");
    expect(result.contentLength).toBe(0);
  });

  it("should return noSelection for whitespace-only text", () => {
    const result = validateAISelection("     ");
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe("noSelection");
  });

  it("should return tooShort for short text", () => {
    const shortText =
      "The weakest point of the implementation currently is the algorithm for determining the use of AI-editing.";
    const result = validateAISelection(shortText);
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe("tooShort");
  });

  it("should return tooLong for oversized text", () => {
    const longText = "This is text that exceeds the max length. ".repeat(200);
    const result = validateAISelection(longText);
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe("tooLong");
  });

  it("should return tooManyParagraphs for multiple paragraphs", () => {
    const manyParagraphsText = "Text paragraph 1.\nText paragraph 2.";
    const result = validateAISelection(manyParagraphsText);
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe("tooManyParagraphs");
    expect(result.paragraphCount).toBe(2);
  });

  it("should return lowQuality for text with low letter density", () => {
    const lowQualityText =
      "1234567890 !@#$%^&*() 1234567890 sfdgjskdgkjg text ".repeat(10);
    const result = validateAISelection(lowQualityText);
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe("lowQuality");
  });

  it("should return ready for valid text", () => {
    const validText =
      "During functional testing, the module demonstrated high practical speed and stability thanks to the use of Groq Cloud with the Llama-3.1-8B-Instant model. The implemented user interface is intuitive for authors and fits naturally into the overall concept of the Dragon Tale platform.";
    const result = validateAISelection(validText);
    expect(result.isValid).toBe(true);
    expect(result.reason).toBe("ready");
    expect(result.paragraphCount).toBeLessThanOrEqual(AI_MAX_PARAGRAPHS);
    expect(result.letterDensity).toBeGreaterThanOrEqual(AI_MIN_LETTER_DENSITY);
    expect(result.contentLength).toBeGreaterThanOrEqual(AI_MIN_CHARS);
    expect(result.contentLength).toBeLessThanOrEqual(AI_MAX_CHARS);
  });

  it("should normalize multiple spaces when calculating content length", () => {
    const text =
      "Word1     Word2     Word3     Word4     Word5     Word6 ".repeat(20);
    const result = validateAISelection(text);
    expect(result.contentLength).toBeGreaterThan(0);
    expect(result.reason).toBe("ready");
  });
});
