import { PDFDocument } from "pdf-lib";
import type { MergePdfRequest } from "../interfaces";
import type { Result } from "../../types/common";
import type { PdfOperationResult } from "../../types/pdf-engine";

export async function mergePdfFiles(request: MergePdfRequest): Promise<Result<PdfOperationResult>> {
  if (request.files.length < 2) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Merge PDF requires at least two PDF files."
      }
    };
  }

  try {
    const merged = await PDFDocument.create();

    for (const file of request.files) {
      const source = await PDFDocument.load(file.bytes);
      const pageIndices = source.getPageIndices();
      const copiedPages = await merged.copyPages(source, pageIndices);

      for (const page of copiedPages) {
        merged.addPage(page);
      }
    }

    const mergedBytes = await merged.save();
    const arrayBuffer = mergedBytes.buffer.slice(
      mergedBytes.byteOffset,
      mergedBytes.byteOffset + mergedBytes.byteLength
    ) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });

    return {
      ok: true,
      data: {
        blob,
        fileName: ensurePdfFileName(request.fileName),
        mimeType: "application/pdf"
      }
    };
  } catch (cause) {
    return {
      ok: false,
      error: {
        code: "PDF_ENGINE_ERROR",
        message: "Failed to merge PDF files in the browser.",
        cause
      }
    };
  }
}

function ensurePdfFileName(fileName: string): string {
  const trimmed = fileName.trim();
  if (trimmed.length === 0) {
    return "merged.pdf";
  }

  return trimmed.toLowerCase().endsWith(".pdf") ? trimmed : `${trimmed}.pdf`;
}
