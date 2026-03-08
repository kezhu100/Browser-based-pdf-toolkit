import type { SourceDocument, SourceFormat } from "../../types/document";
import type { ContentToolId } from "./types";

export const CONTENT_TOOL_IDS: ContentToolId[] = ["markdown-to-pdf", "txt-to-pdf", "html-to-pdf"];

export const TEMPLATE_BY_TOOL: Record<ContentToolId, string> = {
  "markdown-to-pdf": "# Hello Markdown\n\nThis is a sample paragraph.",
  "txt-to-pdf": "Hello TXT\n\nThis is a sample paragraph.",
  "html-to-pdf": "<h1>Hello HTML</h1><p>This is a sample paragraph.</p>"
};

export const FORMAT_BY_TOOL: Record<ContentToolId, SourceFormat> = {
  "markdown-to-pdf": "markdown",
  "txt-to-pdf": "txt",
  "html-to-pdf": "html"
};

export const MIME_BY_TOOL: Record<ContentToolId, string> = {
  "markdown-to-pdf": "text/markdown",
  "txt-to-pdf": "text/plain",
  "html-to-pdf": "text/html"
};

const TOOL_BY_EXTENSION: Record<string, ContentToolId> = {
  md: "markdown-to-pdf",
  markdown: "markdown-to-pdf",
  txt: "txt-to-pdf",
  html: "html-to-pdf",
  htm: "html-to-pdf"
};

const TOOL_BY_MIME: Record<string, ContentToolId> = {
  "text/markdown": "markdown-to-pdf",
  "text/plain": "txt-to-pdf",
  "text/html": "html-to-pdf"
};

export function resolveToolIdFromFile(file: File): ContentToolId | null {
  const extension = file.name.toLowerCase().split(".").pop() ?? "";
  if (extension in TOOL_BY_EXTENSION) {
    return TOOL_BY_EXTENSION[extension];
  }

  const mime = file.type.toLowerCase();
  if (mime in TOOL_BY_MIME) {
    return TOOL_BY_MIME[mime];
  }

  return null;
}

export function createSourceDocument(toolId: ContentToolId, content: string): SourceDocument {
  const format = FORMAT_BY_TOOL[toolId];

  return {
    format,
    content,
    meta: {
      id: crypto.randomUUID(),
      fileName: `input.${format === "markdown" ? "md" : format}`,
      mimeType: MIME_BY_TOOL[toolId],
      size: new TextEncoder().encode(content).length,
      lastModified: Date.now()
    }
  };
}
