import { describe, expect, it } from "vitest";

import { applyInlineFormat, parseInlineFormat } from "../src/lib/inline-format";

describe("inline formatting", () => {
  it("wraps selected text with the requested format marker", () => {
    const result = applyInlineFormat("stable APIs", 0, 6, "bold");

    expect(result.value).toBe("[[b]]stable[[/b]] APIs");
    expect(result.selectionStart).toBe(5);
    expect(result.selectionEnd).toBe(11);
  });

  it("wraps each selected line independently for multiline text areas", () => {
    const result = applyInlineFormat("first\nsecond", 0, 12, "underline");

    expect(result.value).toBe("[[u]]first[[/u]]\n[[u]]second[[/u]]");
  });

  it("parses nested inline format markers into formatted text segments", () => {
    const segments = parseInlineFormat("A [[b]]fast [[i]]API[[/i]][[/b]]");

    expect(segments).toEqual([
      { text: "A ", formats: [] },
      { text: "fast ", formats: ["bold"] },
      { text: "API", formats: ["bold", "italic"] }
    ]);
  });
});
