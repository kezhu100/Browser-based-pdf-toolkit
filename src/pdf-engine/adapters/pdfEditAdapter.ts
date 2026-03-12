import { degrees, PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type {
  MergePdfRequest,
  PageNumbersPdfRequest,
  ReorderPdfRequest,
  RotatePdfRequest,
  SplitPdfRequest
} from "../interfaces";
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

export async function addPageNumbersToPdfFile(request: PageNumbersPdfRequest): Promise<Result<PdfOperationResult>> {
  if (request.file.bytes.length === 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Add Page Numbers requires a non-empty PDF file."
      }
    };
  }

  try {
    const document = await PDFDocument.load(request.file.bytes);
    const pageCount = document.getPageCount();

    if (pageCount === 0) {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "The selected PDF has no pages to number."
        }
      };
    }

    const font = await document.embedFont(StandardFonts.Helvetica);
    const fontSize = clampInteger(request.fontSize, 12, 6, 72);
    const margin = clampInteger(request.margin, 24, 0, 200);
    const startNumber = clampInteger(request.startNumber, 1, 1, 999999);

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      const page = document.getPage(pageIndex);
      const pageNumberText = `${request.prefix}${startNumber + pageIndex}`;
      const textWidth = font.widthOfTextAtSize(pageNumberText, fontSize);
      const { width, height } = page.getSize();
      const coordinates = getPageNumberCoordinates({
        width,
        height,
        textWidth,
        fontSize,
        margin,
        position: request.position
      });

      page.drawText(pageNumberText, {
        x: coordinates.x,
        y: coordinates.y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      });
    }

    const bytes = await document.save();

    return {
      ok: true,
      data: {
        blob: new Blob([toPdfBlobPart(bytes)], { type: "application/pdf" }),
        fileName: ensurePdfFileName(request.fileName, "page-numbers"),
        mimeType: "application/pdf"
      }
    };
  } catch (cause) {
    return {
      ok: false,
      error: {
        code: "PDF_ENGINE_ERROR",
        message: "Failed to add page numbers to the PDF in the browser.",
        cause
      }
    };
  }
}

export async function reorderPdfFile(request: ReorderPdfRequest): Promise<Result<PdfOperationResult>> {
  if (request.file.bytes.length === 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Reorder PDF requires a non-empty PDF file."
      }
    };
  }

  if (request.pageOrder.length === 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Keep at least one page in the reordered PDF."
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
          message: "The selected PDF has no pages to reorder."
        }
      };
    }

    const seen = new Set<number>();
    for (const pageIndex of request.pageOrder) {
      if (pageIndex < 0 || pageIndex >= pageCount) {
        return {
          ok: false,
          error: {
            code: "INVALID_INPUT",
            message: `Page index ${pageIndex + 1} is out of range for this PDF.`
          }
        };
      }

      if (seen.has(pageIndex)) {
        return {
          ok: false,
          error: {
            code: "INVALID_INPUT",
            message: `Page ${pageIndex + 1} appears more than once in the requested order.`
          }
        };
      }

      seen.add(pageIndex);
    }

    const reordered = await PDFDocument.create();
    const copiedPages = await reordered.copyPages(source, request.pageOrder);

    for (const page of copiedPages) {
      reordered.addPage(page);
    }

    const bytes = await reordered.save();

    return {
      ok: true,
      data: {
        blob: new Blob([toPdfBlobPart(bytes)], { type: "application/pdf" }),
        fileName: ensurePdfFileName(request.fileName, "reordered"),
        mimeType: "application/pdf"
      }
    };
  } catch (cause) {
    return {
      ok: false,
      error: {
        code: "PDF_ENGINE_ERROR",
        message: "Failed to reorder the PDF in the browser.",
        cause
      }
    };
  }
}

function ensurePdfFileName(fileName: string, fallbackStem = "merged"): string {
  const trimmed = fileName.trim();
  if (trimmed.length === 0) {
    return `${fallbackStem}.pdf`;
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

function getPageNumberCoordinates(params: {
  width: number;
  height: number;
  textWidth: number;
  fontSize: number;
  margin: number;
  position: "bottom-center" | "bottom-right" | "top-center" | "top-right";
}): { x: number; y: number } {
  const centeredX = Math.max(params.margin, (params.width - params.textWidth) / 2);
  const rightAlignedX = Math.max(params.margin, params.width - params.margin - params.textWidth);
  const bottomY = Math.max(0, params.margin);
  const topY = Math.max(0, params.height - params.margin - params.fontSize);

  if (params.position === "bottom-center") {
    return { x: centeredX, y: bottomY };
  }
  if (params.position === "bottom-right") {
    return { x: rightAlignedX, y: bottomY };
  }
  if (params.position === "top-center") {
    return { x: centeredX, y: topY };
  }
  return { x: rightAlignedX, y: topY };
}

function clampInteger(value: number | undefined, fallback: number, min: number, max: number): number {
  const next = Number.isFinite(value) ? Math.trunc(value as number) : fallback;
  return Math.min(max, Math.max(min, next));
}

function toPdfBlobPart(bytes: Uint8Array): ArrayBuffer {
  if (bytes.buffer instanceof ArrayBuffer && bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength) {
    return bytes.buffer;
  }

  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}
