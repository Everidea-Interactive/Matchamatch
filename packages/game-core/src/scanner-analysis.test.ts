import { describe, expect, it } from "vitest";
import { analyzeMatchaPixels } from "./scanner-analysis";

describe("scanner-analysis", () => {
  it("marks image as matcha when enough green-rich pixels exist", () => {
    const pixels = new Uint8ClampedArray([
      40, 120, 40, 255, 42, 128, 44, 255, 38, 122, 36, 255, 45, 130, 42, 255,
    ]);

    const result = analyzeMatchaPixels({
      width: 2,
      height: 2,
      data: pixels,
    });

    expect(result.isMatcha).toBe(true);
  });
});
