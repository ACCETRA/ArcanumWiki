import { marked } from "marked";

marked.setOptions({
  breaks: false,
  gfm: true,
});

export function renderMarkdown(markdown: string) {
  return marked.parse(markdown) as string;
}
