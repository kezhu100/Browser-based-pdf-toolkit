import { degrees, PDFDocument } from "pdf-lib";
import type { MergePdfRequest, RotatePdfRequest, SplitPdfRequest } from "../interfaces";
import type { Result } from "../../types/common";
import type { PdfOperationResult, PdfSplitResult } from "../../types/pdf-engine";

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
    const blob = new Blob([toPdfBlobPart(mergedBytes)], { type: "application/pdf" });

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

export async function splitPdfFile(request: SplitPdfRequest): Promise<Result<PdfSplitResult>> {
  if (request.file.bytes.length === 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Split PDF requires a non-empty PDF file."
      }
    };
  }

  try {
    const source = await PDFDocument.load(request.file.bytes);
    const pageCount = source.getPageCount();

    if (pageCount === 0) {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "The selected PDF has no pages to split."
        }
      };
    }

    const files: PdfOperationResult[] = [];

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      const splitDocument = await PDFDocument.create();
      const [page] = await splitDocument.copyPages(source, [pageIndex]);
      splitDocument.addPage(page);

      const bytes = await splitDocument.save();

      files.push({
        blob: new Blob([toPdfBlobPart(bytes)], { type: "application/pdf" }),
        fileName: `${ensurePdfFileStem(request.fileNamePrefix)}-page-${pageIndex + 1}.pdf`,
        mimeType: "application/pdf"
      });
    }

    return {
      ok: true,
      data: {
        files
      }
    };
  } catch (cause) {
    return {
      ok: false,
      error: {
        code: "PDF_ENGINE_ERROR",
        message: "Failed to split the PDF in the browser.",
        cause
      }
    };
  }
}

export async function rotatePdfFile(request: RotatePdfRequest): Promise<Result<PdfOperationResult>> {
  if (request.file.bytes.length === 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Rotate PDF requires a non-empty PDF file."
      }
    };
  }

  try {
    const document = await PDFDocument.load(request.file.bytes);
    const pageCount = document.getPageCount();
    const pageIndices = request.pages.length > 0 ? request.pages : document.getPageIndices();

    if (pageCount === 0) {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "The selected PDF has no pages to rotate."
        }
      };
    }

    for (const pageIndex of pageIndices) {
      if (pageIndex < 0 || pageIndex >= pageCount) {
        return {
          ok: false,
          error: {
            code: "INVALID_INPUT",
            message: `Page index ${pageIndex + 1} is out of range for this PDF.`
          }
        };
      }

      const page = document.getPage(pageIndex);
      const nextAngle = (page.getRotation().angle + request.degrees) % 360;
      page.setRotation(degrees(nextAngle));
    }

    const bytes = await document.save();

    return {
      ok: true,
      data: {
        blob: new Blob([toPdfBlobPart(bytes)], { type: "application/pdf" }),
        fileName: ensurePdfFileName(request.fileName),
        mimeType: "application/pdf"
      }
    };
  } catch (cause) {
    return {
      ok: false,
      error: {
        code: "PDF_ENGINE_ERROR",
        message: "Failed to rotate the PDF in the browser.",
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

function ensurePdfFileStem(fileName: string): string {
  const trimmed = fileName.trim();
  if (trimmed.length === 0) {
    return "split";
  }

  return trimmed.toLowerCase().endsWith(".pdf") ? trimmed.slice(0, -4) : trimmed;
}

function toPdfBlobPart(bytes: Uint8Array): ArrayBuffer {
  if (bytes.buffer instanceof ArrayBuffer && bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength) {
    return bytes.buffer;
  }

  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}
