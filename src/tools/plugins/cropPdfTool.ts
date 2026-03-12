import type { Result } from "../../types/common";
import type { PdfBinary } from "../../types/pdf-engine";
import type { ToolExecutionArtifact, ToolExecutionContext, ToolPlugin } from "../../types/tool";

export interface CropPdfToolRunSettings {
  generatePdf?: boolean;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

async function run(context: ToolExecutionContext<CropPdfToolRunSettings>): Promise<Result<ToolExecutionArtifact>> {
  if (context.sourceDocuments.length !== 1) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Crop PDF requires exactly one PDF file."
      }
    };
  }

  const fileResult = readSinglePdfFile(context);
  if (!fileResult.ok) {
    return fileResult;
  }

  const settings = normalizeSettings(context.settings);
  const previewHtml = createPreviewHtml(fileResult.data.fileName, settings);

  if (context.settings.generatePdf === false) {
    return {
      ok: true,
      data: {
        previewHtml
      }
    };
  }

  const pdfResult = await context.services.pdfEngine.crop({
    file: fileResult.data,
    fileName: context.exportOptions.fileName,
    top: settings.top,
    right: settings.right,
    bottom: settings.bottom,
    left: settings.left
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

function readSinglePdfFile(context: ToolExecutionContext<CropPdfToolRunSettings>): Result<PdfBinary> {
  const [source] = context.sourceDocuments;

  if (!source || source.format !== "pdf") {
    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_FORMAT",
        message: "Crop PDF only supports a single PDF source."
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

function normalizeSettings(settings: CropPdfToolRunSettings) {
  return {
    top: clampInteger(settings.top, 0, 0, 2000),
    right: clampInteger(settings.right, 0, 0, 2000),
    bottom: clampInteger(settings.bottom, 0, 0, 2000),
    left: clampInteger(settings.left, 0, 0, 2000)
  };
}

function clampInteger(value: number | undefined, fallback: number, min: number, max: number): number {
  const next = Number.isFinite(value) ? Math.trunc(value as number) : fallback;
  return Math.min(max, Math.max(min, next));
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

function createPreviewHtml(
  fileName: string,
  settings: ReturnType<typeof normalizeSettings>
): string {
  return [
    "<div class=\"pdf-merge-preview\">",
    `  <p>Ready to crop <strong>${escapeHtml(fileName)}</strong> in the browser.</p>`,
    "  <ul>",
    `    <li><strong>Top inset:</strong> ${settings.top} pt</li>`,
    `    <li><strong>Right inset:</strong> ${settings.right} pt</li>`,
    `    <li><strong>Bottom inset:</strong> ${settings.bottom} pt</li>`,
    `    <li><strong>Left inset:</strong> ${settings.left} pt</li>`,
    "  </ul>",
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

export const cropPdfTool: ToolPlugin<CropPdfToolRunSettings> = {
  id: "crop-pdf",
  name: "Crop PDF",
  description: "Apply a fixed inset crop to every page of a single PDF in the browser.",
  category: "manipulation",
  inputTypes: ["pdf"],
  capabilities: ["crop"],
  settingsSchemaName: "CropPdfSettings",
  run,
  previewAdapter
};
