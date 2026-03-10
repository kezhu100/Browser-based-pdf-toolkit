import type { SourceDocument } from "../../types/document";
import type { PdfFileItem, PdfToolId } from "./types";

const PDF_MIME_TYPE = "application/pdf";
const PDF_EXTENSION = ".pdf";

export const PDF_TOOL_IDS: PdfToolId[] = ["merge-pdf"];

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
