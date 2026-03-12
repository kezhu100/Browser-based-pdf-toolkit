import type { Result } from "../../types/common";
import type { PdfBinary } from "../../types/pdf-engine";
import type { ToolExecutionArtifact, ToolExecutionContext, ToolPlugin } from "../../types/tool";

export interface ReorderPdfToolRunSettings {
  generatePdf?: boolean;
  pageOrder?: number[];
}

async function run(context: ToolExecutionContext<ReorderPdfToolRunSettings>): Promise<Result<ToolExecutionArtifact>> {
  if (context.sourceDocuments.length !== 1) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Reorder PDF requires exactly one PDF file."
      }
    };
  }

  const fileResult = readSinglePdfFile(context);
  if (!fileResult.ok) {
    return fileResult;
  }

  const pageOrder = context.settings.pageOrder ?? [];
  if (pageOrder.length === 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Keep at least one page before exporting the reordered PDF."
      }
    };
  }

  const previewHtml = createReorderPreviewHtml(fileResult.data.fileName, pageOrder);
  if (context.settings.generatePdf === false) {
    return {
      ok: true,
      data: {
        previewHtml
      }
    };
  }

  const pdfResult = await context.services.pdfEngine.reorder({
    file: fileResult.data,
    pageOrder,
    fileName: context.exportOptions.fileName
  });

  if (!pdfResult.ok) {
    return pdfResult;
  }

  return {
    ok: true,
    data: {
      previewHtml,
      output: pdfResult.data
    }
  };
}

function previewAdapter(artifact: ToolExecutionArtifact): string | null {
  return artifact.previewHtml ?? null;
}

function readSinglePdfFile(context: ToolExecutionContext<ReorderPdfToolRunSettings>): Result<PdfBinary> {
  const [source] = context.sourceDocuments;

  if (!source || source.format !== "pdf") {
    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_FORMAT",
        message: "Reorder PDF only supports a single PDF source."
      }
    };
  }

  const bytes = toUint8Array(source.content);
  if (bytes.length === 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: `PDF file "${source.meta.fileName}" is empty.`
      }
    };
  }

  return {
    ok: true,
    data: {
      bytes,
      fileName: source.meta.fileName,
      mimeType: "application/pdf"
    }
  };
}

function toUint8Array(content: string | ArrayBuffer | Uint8Array): Uint8Array {
  if (content instanceof Uint8Array) {
    return content;
  }
  if (content instanceof ArrayBuffer) {
    return new Uint8Array(content);
  }
  return new TextEncoder().encode(content);
}

function createReorderPreviewHtml(fileName: string, pageOrder: number[]): string {
  const pageList = pageOrder
    .map((pageIndex, index) => `<li><strong>${index + 1}.</strong> Page ${pageIndex + 1}</li>`)
    .join("");

  return [
    "<div class=\"pdf-merge-preview\">",
    `  <p>Ready to export <strong>${escapeHtml(fileName)}</strong> with <strong>${pageOrder.length}</strong> kept page(s).</p>`,
    "  <p>The current page order will be applied in browser during export.</p>",
    "  <ol>",
    `    ${pageList}`,
    "  </ol>",
    "</div>"
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const reorderPdfTool: ToolPlugin<ReorderPdfToolRunSettings> = {
  id: "reorder-pdf",
  name: "Reorder PDF Pages",
  description: "Reorder and remove pages from a single PDF in the browser.",
  category: "manipulation",
  inputTypes: ["pdf"],
  capabilities: ["reorder", "preview"],
  settingsSchemaName: "ReorderPdfSettings",
  run,
  previewAdapter
};
