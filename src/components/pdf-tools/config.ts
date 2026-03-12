import type { SourceDocument } from "../../types/document";
import type { PdfFileItem, PdfToolId } from "./types";

const PDF_MIME_TYPE = "application/pdf";
const PDF_EXTENSION = ".pdf";

export const PDF_TOOL_IDS: PdfToolId[] = ["merge-pdf", "split-pdf", "reorder-pdf", "page-numbers-pdf", "rotate-pdf"];

export function isSupportedPdfFile(file: File): boolean {
  return file.type.toLowerCase() === PDF_MIME_TYPE || file.name.toLowerCase().endsWith(PDF_EXTENSION);
}

export function getUnsupportedPdfFiles(files: File[]): File[] {
  return files.filter((file) => !isSupportedPdfFile(file));
}

export async function toPdfFileItems(files: File[]): Promise<PdfFileItem[]> {
  return Promise.all(
    files.map(async (file, index) => {
      const id = `${file.name}-${file.size}-${file.lastModified}-${index}`;
      const bytes = new Uint8Array(await file.arrayBuffer());
      const sourceDocument: SourceDocument = {
        format: "pdf",
        content: bytes,
        meta: {
          id,
          fileName: file.name,
          mimeType: file.type || PDF_MIME_TYPE,
          size: file.size,
          lastModified: file.lastModified
        }
      };

      return {
        id,
        file,
        sourceDocument
      };
    })
  );
}

export function getPdfAcceptAttribute(): string {
  return ".pdf,application/pdf";
}

export function getPdfFileInputHint(toolId: PdfToolId): string {
  if (toolId === "merge-pdf") {
    return "Select two or more PDF files to merge in browser.";
  }
  if (toolId === "split-pdf") {
    return "Select one PDF file. Phase 10.2 splits it into separate single-page PDFs.";
  }
  if (toolId === "reorder-pdf") {
    return "Select one PDF file to reorder or remove pages in browser.";
  }
  if (toolId === "page-numbers-pdf") {
    return "Select one PDF file to add page numbers in browser.";
  }
  return "Select one PDF file to rotate. Phase 10.2 rotates all pages in browser.";
}

export function getPdfExportFileName(toolId: PdfToolId): string {
  const timestamp = Date.now();

  if (toolId === "merge-pdf") {
    return `merged-${timestamp}.pdf`;
  }
  if (toolId === "split-pdf") {
    return `split-${timestamp}`;
  }
  if (toolId === "reorder-pdf") {
    return `reordered-${timestamp}.pdf`;
  }
  if (toolId === "page-numbers-pdf") {
    return `page-numbers-${timestamp}.pdf`;
  }
  return `rotated-${timestamp}.pdf`;
}
