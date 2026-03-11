import type { Result } from "../../types/common";
import type { PdfBinary } from "../../types/pdf-engine";
import type { ToolExecutionArtifact, ToolExecutionContext, ToolPlugin } from "../../types/tool";

export interface RotatePdfToolRunSettings {
  generatePdf?: boolean;
  degrees?: 90 | 180 | 270;
}

async function run(context: ToolExecutionContext<RotatePdfToolRunSettings>): Promise<Result<ToolExecutionArtifact>> {
  if (context.sourceDocuments.length !== 1) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Rotate PDF requires exactly one PDF file."
      }
    };
  }

  const fileResult = readSinglePdfFile(context);
  if (!fileResult.ok) {
    return fileResult;
  }

  const degrees = context.settings.degrees ?? 90;
  const previewHtml = createRotatePreviewHtml(fileResult.data.fileName, degrees);

  if (context.settings.generatePdf === false) {
    return {
      ok: true,
      data: {
        previewHtml
      }
    };
  }

  const pdfResult = await context.services.pdfEngine.rotate({
    file: fileResult.data,
    pages: [],
    degrees,
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

function previewAdapter(_: ToolExecutionArtifact): string | null {
  return null;
}

function readSinglePdfFile(context: ToolExecutionContext<RotatePdfToolRunSettings>): Result<PdfBinary> {
  const [source] = context.sourceDocuments;

  if (!source || source.format !== "pdf") {
    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_FORMAT",
        message: "Rotate PDF only supports a single PDF source."
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

function createRotatePreviewHtml(fileName: string, degrees: 90 | 180 | 270): string {
  return [
    "<div class=\"pdf-merge-preview\">",
    `  <p>Ready to rotate <strong>${escapeHtml(fileName)}</strong> by <strong>${degrees} degrees</strong> in the browser.</p>`,
    "  <p>This Phase 10.2 workflow rotates all pages of the uploaded PDF.</p>",
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

export const rotatePdfTool: ToolPlugin<RotatePdfToolRunSettings> = {
  id: "rotate-pdf",
  name: "Rotate PDF",
  description: "Rotate all pages of a PDF in the browser.",
  category: "manipulation",
  inputTypes: ["pdf"],
  capabilities: ["rotate", "preview"],
  settingsSchemaName: "RotatePdfSettings",
  run,
  previewAdapter
};
