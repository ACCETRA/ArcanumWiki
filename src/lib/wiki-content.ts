import { slugify } from "./categories";

export type TocEntry = {
  id: string;
  depth: number;
  text: string;
};

export function estimateReadTime(markdown: string) {
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 220));
}

export function extractToc(markdown: string): TocEntry[] {
  return markdown
    .split("\n")
    .flatMap((line) => {
      const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
      if (!match) return [];
      const depth = match[1].length;
      const text = match[2].replace(/`/g, "");
      return [{ id: slugify(text), depth, text }];
    });
}

export function textFromMarkdown(markdown: string) {
  return markdown
    .replace(/#{1,6}\s+/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
