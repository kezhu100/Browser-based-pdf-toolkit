import type { SourceDocument } from "../../types/document";

export function readSourceAsText(source: SourceDocument): string {
  if (typeof source.content === "string") {
    return source.content;
  }

  if (source.content instanceof Uint8Array) {
    return new TextDecoder().decode(source.content);
  }

  return new TextDecoder().decode(new Uint8Array(source.content));
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function guessTitle(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "").trim();
  return base || "Untitled Document";
}

