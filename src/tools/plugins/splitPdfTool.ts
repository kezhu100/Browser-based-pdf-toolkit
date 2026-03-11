import type { Result } from "../../types/common";
import type { PdfBinary } from "../../types/pdf-engine";
import type { ToolExecutionArtifact, ToolExecutionContext, ToolPlugin } from "../../types/tool";

export interface SplitPdfToolRunSettings {
  generatePdf?: boolean;
}

async function run(context: ToolExecutionContext<SplitPdfToolRunSettings>): Promise<Result<ToolExecutionArtifact>> {
  if (context.sourceDocuments.length !== 1) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Split PDF requires exactly one PDF file."
      }
    };
  }

  const fileResult = readSinglePdfFile(context);
  if (!fileResult.ok) {
    return fileResult;
  }

  const previewHtml = createSplitPreviewHtml(fileResult.data.fileName);
  if (context.settings.generatePdf === false) {
    return {
      ok: true,
      data: {
        previewHtml
      }
    };
  }

  const pdfResult = await context.services.pdfEngine.split({
    file: fileResult.data,
    // Phase 10.2 only supports splitting into individual pages.
    ranges: "single-pages",
    fileNamePrefix: context.exportOptions.fileName
  });

  if (!pdfResult.ok) {
    return pdfResult;
  }

  return {
    ok: true,
    data: {
      previewHtml,
      output: pdfResult.data.files
    }
  };
}

function previewAdapter(_: ToolExecutionArtifact): string | null {
  return null;
}

function readSinglePdfFile(context: ToolExecutionContext<SplitPdfToolRunSettings>): Result<PdfBinary> {
  const [source] = context.sourceDocuments;

  if (!source || source.format !== "pdf") {
    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_FORMAT",
        message: "Split PDF only supports a single PDF source."
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

function createSplitPreviewHtml(fileName: string): string {
  return [
    "<div class=\"pdf-merge-preview\">",
    `  <p>Ready to split <strong>${escapeHtml(fileName)}</strong> into separate single-page PDF files.</p>`,
    "  <p>Each output page will be downloaded as an individual PDF.</p>",
    "</div>"
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const splitPdfTool: ToolPlugin<SplitPdfToolRunSettings> = {
  id: "split-pdf",
  name: "Split PDF",
  description: "Split one PDF into separate single-page PDF files in the browser.",
  category: "manipulation",
  inputTypes: ["pdf"],
  capabilities: ["split", "preview"],
  settingsSchemaName: "SplitPdfSettings",
  run,
  previewAdapter
};
