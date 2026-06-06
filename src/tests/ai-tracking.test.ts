import { describe, it, expect } from "vitest";
import { AITracking } from "../services/ai-tracking";

describe("AITracking.normalize", () => {
  it("should convert text to lowercase", () => {
    const result = (AITracking as any).normalize("HEllO WoRLd", false);
    expect(result).toBe("hello world");
  });

  it("should remove html tags", () => {
    const result = (AITracking as any).normalize(
      "<p>Hello</p><b>World</b>",
      false,
    );
    expect(result).toBe("hello world");
  });

  it("should remove punctuation in hard mode", () => {
    const result = (AITracking as any).normalize("Hello, world!!!", true);
    expect(result).toBe("hello world");
  });

  it("should preserve unicode letters", () => {
    const result = (AITracking as any).normalize("Hello, world!", true);
    expect(result).toBe("hello world");
  });

  it("should normalize multiple spaces", () => {
    const result = (AITracking as any).normalize("hello     world", false);
    expect(result).toBe("hello world");
  });
});

describe("AITracking.getShingles", () => {
  it("should create 3-word shingles", () => {
    const shingles = (AITracking as any).getShingles("one two three four five");
    expect(shingles.has("one two three")).toBe(true);
    expect(shingles.has("two three four")).toBe(true);
    expect(shingles.has("three four five")).toBe(true);
  });

  it("should return single shingle for short text", () => {
    const shingles = (AITracking as any).getShingles("hello world");
    expect(shingles.size).toBe(1);
    expect(shingles.has("hello world")).toBe(true);
  });

  it("should return empty set for empty text", () => {
    const shingles = (AITracking as any).getShingles("");
    expect(shingles.size).toBe(0);
  });
});

describe("AITracking.calculateOverlap", () => {
  it("should return 1 for full overlap", () => {
    const a = new Set(["one", "two"]);
    const b = new Set(["one", "two"]);
    const result = (AITracking as any).calculateOverlap(a, b);
    expect(result).toBe(1);
  });

  it("should return partial overlap", () => {
    const a = new Set(["one", "two"]);
    const b = new Set(["one"]);
    const result = (AITracking as any).calculateOverlap(a, b);
    expect(result).toBe(0.5);
  });

  it("should return 0 for no overlap", () => {
    const a = new Set(["one"]);
    const b = new Set(["two"]);
    const result = (AITracking as any).calculateOverlap(a, b);
    expect(result).toBe(0);
  });

  it("should return 0 for empty snapshot set", () => {
    const a = new Set<string>();
    const b = new Set(["one"]);
    const result = (AITracking as any).calculateOverlap(a, b);
    expect(result).toBe(0);
  });
});

describe("AITracking.prepareSnapshot", () => {
  it("should trim spaces", () => {
    const result = (AITracking as any).prepareSnapshot("   hello world   ");
    expect(result).toBe("hello world");
  });

  it("should return empty string for whitespace only", () => {
    const result = (AITracking as any).prepareSnapshot("     ");
    expect(result).toBe("");
  });
});

describe("AITracking.checkIfAIPresent", () => {
  it("should detect exact match", () => {
    const snapshot = "edited AI text ".repeat(20);
    const fullText = "Introduction " + snapshot + " Conclusion";
    const result = (AITracking as any).checkIfAIPresent(fullText, [snapshot]);
    expect(result).toBe(true);
  });

  it("should return false for empty snapshots", () => {
    const result = (AITracking as any).checkIfAIPresent("hello world", []);
    expect(result).toBe(false);
  });

  it("should ignore short snapshots", () => {
    const snapshot = "some text";
    const result = (AITracking as any).checkIfAIPresent(
      "some text in the text of the whole chapter",
      [snapshot],
    );
    expect(result).toBe(false);
  });

  it("should detect similarity using shingles", () => {
    const snapshot =
      "Artificial intelligence helps writers improve their text quality and readability. ".repeat(
        10,
      );
    const modified =
      "Artificial intelligence helps writers improve text quality and readability for users. ".repeat(
        10,
      );
    const result = (AITracking as any).checkIfAIPresent(modified, [snapshot]);
    expect(result).toBe(true);
  });

  it("should return false when similarity is too low", () => {
    const snapshot = "Artificial intelligence generated content ".repeat(10);
    const fullText = "Completely different unrelated human text ".repeat(10);
    const result = (AITracking as any).checkIfAIPresent(fullText, [snapshot]);
    expect(result).toBe(false);
  });
});
