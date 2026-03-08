import html2pdf from "html2pdf.js";
import type { GeneratePdfRequest, PdfRenderEngine } from "../interfaces";
import type { Result } from "../../types/common";
import type { PdfOperationResult } from "../../types/pdf-engine";

type Orientation = GeneratePdfRequest["options"]["orientation"];
type PageSize = GeneratePdfRequest["options"]["pageSize"];

function toJsPdfFormat(pageSize: PageSize): "a4" | "letter" {
  return pageSize === "Letter" ? "letter" : "a4";
}

function getPageDimensionsInch(pageSize: PageSize, orientation: Orientation): { width: number; height: number } {
  const base = pageSize === "Letter" ? { width: 8.5, height: 11 } : { width: 8.27, height: 11.69 };
  if (orientation === "landscape") {
    return { width: base.height, height: base.width };
  }
  return base;
}

function mmToPx(mm: number): number {
  return (mm / 25.4) * 96;
}

function waitForLayout(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export class Html2PdfRenderEngine implements PdfRenderEngine {
  async generateFromModel(request: GeneratePdfRequest): Promise<Result<PdfOperationResult>> {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return {
        ok: false,
        error: {
          code: "PDF_ENGINE_ERROR",
          message: "PDF generation requires a browser environment."
        }
      };
    }

    if (!request.model.htmlContent.trim()) {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Cannot generate PDF from empty HTML content."
        }
      };
    }

    const page = getPageDimensionsInch(request.options.pageSize, request.options.orientation);
    const pageWidthPx = Math.round(page.width * 96);
    const marginPx = Math.round(mmToPx(request.options.marginMm));
    const innerWidthPx = Math.max(120, pageWidthPx - marginPx * 2);

    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.left = "0";
    host.style.top = "0";
    host.style.pointerEvents = "none";
    host.style.zIndex = "-1";
    host.style.background = "transparent";
    host.style.boxSizing = "border-box";

    const pageBox = document.createElement("div");
    pageBox.style.width = `${pageWidthPx}px`;
    pageBox.style.background = "#ffffff";
    pageBox.style.boxSizing = "border-box";
    pageBox.style.padding = `${marginPx}px`;

    const mount = document.createElement("div");
    mount.style.width = `${innerWidthPx}px`;
    mount.style.maxWidth = `${innerWidthPx}px`;
    mount.style.background = "#ffffff";
    mount.style.color = "#111111";
    mount.style.display = "block";
    mount.style.position = "relative";
    mount.style.transform = "none";
    mount.style.overflowWrap = "anywhere";
    mount.style.wordBreak = "break-word";
    mount.innerHTML = request.model.htmlContent;

    pageBox.appendChild(mount);
    host.appendChild(pageBox);
    document.body.appendChild(host);

    try {
      await waitForLayout();

      const worker = html2pdf()
        .set({
          margin: 0,
          filename: request.options.fileName,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollX: 0,
            scrollY: 0,
            windowWidth: pageWidthPx
          },
          jsPDF: {
            unit: "in",
            format: toJsPdfFormat(request.options.pageSize),
            orientation: request.options.orientation
          }
        })
        .from(pageBox);

      const blob = (await worker.outputPdf("blob")) as Blob;
      if (blob.size === 0) {
        return {
          ok: false,
          error: {
            code: "PDF_ENGINE_ERROR",
            message: "PDF generation produced an empty file."
          }
        };
      }

      return {
        ok: true,
        data: {
          blob,
          fileName: request.options.fileName,
          mimeType: "application/pdf"
        }
      };
    } catch (cause) {
      return {
        ok: false,
        error: {
          code: "PDF_ENGINE_ERROR",
          message: "Failed to generate PDF from HTML content.",
          cause
        }
      };
    } finally {
      host.remove();
    }
  }
}
