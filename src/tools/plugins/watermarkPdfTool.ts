import type { Result } from "../../types/common";
import type { PdfBinary } from "../../types/pdf-engine";
import type { ToolExecutionArtifact, ToolExecutionContext, ToolPlugin } from "../../types/tool";

export type WatermarkPositionPreset = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface WatermarkPdfToolRunSettings {
  generatePdf?: boolean;
  text?: string;
  opacity?: number;
  fontSize?: number;
  rotation?: number;
  position?: WatermarkPositionPreset;
  margin?: number;
}

async function run(context: ToolExecutionContext<WatermarkPdfToolRunSettings>): Promise<Result<ToolExecutionArtifact>> {
  if (context.sourceDocuments.length !== 1) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Add Watermark requires exactly one PDF file."
      }
    };
  }

  const fileResult = readSinglePdfFile(context);
  if (!fileResult.ok) {
    return fileResult;
  }

  const settingsResult = normalizeSettings(context.settings);
  if (!settingsResult.ok) {
    return settingsResult;
  }

  const previewHtml = createPreviewHtml(fileResult.data.fileName, settingsResult.data);
  if (context.settings.generatePdf === false) {
    return {
      ok: true,
      data: {
        previewHtml
      }
    };
  }

  const pdfResult = await context.services.pdfEngine.watermark({
    file: fileResult.data,
    fileName: context.exportOptions.fileName,
    text: settingsResult.data.text,
    opacity: settingsResult.data.opacity,
    fontSize: settingsResult.data.fontSize,
    rotation: settingsResult.data.rotation,
    position: settingsResult.data.position,
    margin: settingsResult.data.margin
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

function readSinglePdfFile(context: ToolExecutionContext<WatermarkPdfToolRunSettings>): Result<PdfBinary> {
  const [source] = context.sourceDocuments;

  if (!source || source.format !== "pdf") {
    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_FORMAT",
        message: "Add Watermark only supports a single PDF source."
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

function normalizeSettings(settings: WatermarkPdfToolRunSettings): Result<{
  text: string;
  opacity: number;
  fontSize: number;
  rotation: number;
  position: WatermarkPositionPreset;
  margin: number;
}> {
  const text = (settings.text ?? "").trim().slice(0, 120);
  if (text.length === 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Enter watermark text before exporting."
      }
    };
  }

  return {
    ok: true,
    data: {
      text,
      opacity: clampNumber(settings.opacity, 0.2, 0.05, 1),
      fontSize: clampInteger(settings.fontSize, 48, 8, 144),
      rotation: clampInteger(settings.rotation, -30, -180, 180),
      position: settings.position ?? "center",
      margin: clampInteger(settings.margin, 24, 0, 200)
    }
  };
}

function clampInteger(value: number | undefined, fallback: number, min: number, max: number): number {
  const next = Number.isFinite(value) ? Math.trunc(value as number) : fallback;
  return Math.min(max, Math.max(min, next));
}

function clampNumber(value: number | undefined, fallback: number, min: number, max: number): number {
  const next = Number.isFinite(value) ? Number(value) : fallback;
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
  settings: {
    text: string;
    opacity: number;
    fontSize: number;
    rotation: number;
    position: WatermarkPositionPreset;
    margin: number;
  }
): string {
  return [
    "<div class=\"pdf-merge-preview\">",
    "  <p><strong>Operation:</strong> Add Watermark</p>",
    `  <p><strong>Files affected:</strong> 1 PDF file (${escapeHtml(fileName)})</p>`,
    "  <ul>",
    "    <li><strong>Pages affected:</strong> All pages</li>",
    `    <li><strong>Text:</strong> ${escapeHtml(settings.text)}</li>`,
    `    <li><strong>Opacity:</strong> ${settings.opacity.toFixed(2)}</li>`,
    `    <li><strong>Font size:</strong> ${settings.fontSize}px</li>`,
    `    <li><strong>Rotation:</strong> ${settings.rotation} degrees</li>`,
    `    <li><strong>Position:</strong> ${escapeHtml(formatPositionLabel(settings.position))}</li>`,
    `    <li><strong>Margin from edge:</strong> ${settings.margin}px</li>`,
    "  </ul>",
    "</div>"
  ].join("\n");
}

function formatPositionLabel(position: WatermarkPositionPreset): string {
  if (position === "center") {
    return "Center";
  }
  if (position === "top-left") {
    return "Top left";
  }
  if (position === "top-right") {
    return "Top right";
  }
  if (position === "bottom-left") {
    return "Bottom left";
  }
  return "Bottom right";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const watermarkPdfTool: ToolPlugin<WatermarkPdfToolRunSettings> = {
  id: "watermark-pdf",
  name: "Add Watermark",
  description: "Add a text watermark to every page of a single PDF in the browser.",
  category: "manipulation",
  inputTypes: ["pdf"],
  capabilities: ["watermark"],
  settingsSchemaName: "WatermarkPdfSettings",
  run,
  previewAdapter
};
