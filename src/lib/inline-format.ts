export type InlineFormat = "bold" | "italic" | "underline" | "strike";

export type InlineSegment = {
  text: string;
  formats: InlineFormat[];
};

export type InlineFormatEdit = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

const formatTags: Record<InlineFormat, { open: string; close: string; code: string }> = {
  bold: { open: "[[b]]", close: "[[/b]]", code: "b" },
  italic: { open: "[[i]]", close: "[[/i]]", code: "i" },
  underline: { open: "[[u]]", close: "[[/u]]", code: "u" },
  strike: { open: "[[s]]", close: "[[/s]]", code: "s" }
};

const codeToFormat: Record<string, InlineFormat> = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike"
};

const tagPattern = /\[\[(\/?)(b|i|u|s)\]\]/g;

export function applyInlineFormat(value: string, rawStart: number, rawEnd: number, format: InlineFormat): InlineFormatEdit {
  const start = clampSelection(rawStart, value.length);
  const end = clampSelection(rawEnd, value.length);
  const selectionStart = Math.min(start, end);
  const selectionEnd = Math.max(start, end);
  const tags = formatTags[format];
  const selectedText = value.slice(selectionStart, selectionEnd);

  if (
    selectedText &&
    value.slice(selectionStart - tags.open.length, selectionStart) === tags.open &&
    value.slice(selectionEnd, selectionEnd + tags.close.length) === tags.close
  ) {
    const nextValue =
      value.slice(0, selectionStart - tags.open.length) + selectedText + value.slice(selectionEnd + tags.close.length);
    const nextStart = selectionStart - tags.open.length;
    return {
      value: nextValue,
      selectionStart: nextStart,
      selectionEnd: nextStart + selectedText.length
    };
  }

  if (!selectedText) {
    const insertion = `${tags.open}${tags.close}`;
    const cursor = selectionStart + tags.open.length;
    return {
      value: value.slice(0, selectionStart) + insertion + value.slice(selectionEnd),
      selectionStart: cursor,
      selectionEnd: cursor
    };
  }

  const formattedText = wrapSelectedText(selectedText, tags.open, tags.close);

  return {
    value: value.slice(0, selectionStart) + formattedText + value.slice(selectionEnd),
    selectionStart: selectionStart + tags.open.length,
    selectionEnd: selectionStart + formattedText.length - tags.close.length
  };
}

export function parseInlineFormat(value: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const stack: InlineFormat[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  tagPattern.lastIndex = 0;
  while ((match = tagPattern.exec(value)) !== null) {
    pushSegment(segments, value.slice(lastIndex, match.index), stack);

    const format = codeToFormat[match[2]];
    if (match[1] === "/") {
      const stackIndex = stack.lastIndexOf(format);
      if (stackIndex >= 0) {
        stack.splice(stackIndex, 1);
      }
    } else {
      stack.push(format);
    }

    lastIndex = match.index + match[0].length;
  }

  pushSegment(segments, value.slice(lastIndex), stack);
  return segments;
}

function wrapSelectedText(text: string, open: string, close: string): string {
  if (!text.includes("\n")) {
    return `${open}${text}${close}`;
  }

  return text
    .split("\n")
    .map((line) => (line ? `${open}${line}${close}` : line))
    .join("\n");
}

function pushSegment(segments: InlineSegment[], text: string, formats: InlineFormat[]): void {
  if (!text) {
    return;
  }

  const nextFormats = [...formats];
  const previous = segments[segments.length - 1];
  if (previous && sameFormats(previous.formats, nextFormats)) {
    previous.text += text;
    return;
  }

  segments.push({ text, formats: nextFormats });
}

function sameFormats(left: InlineFormat[], right: InlineFormat[]): boolean {
  return left.length === right.length && left.every((format, index) => format === right[index]);
}

function clampSelection(value: number, length: number): number {
  return Math.max(0, Math.min(length, value));
}
