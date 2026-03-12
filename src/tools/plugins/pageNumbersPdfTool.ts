import type { Result } from "../../types/common";
import type { PdfBinary } from "../../types/pdf-engine";
import type { ToolExecutionArtifact, ToolExecutionContext, ToolPlugin } from "../../types/tool";

export type PageNumberPositionPreset = "bottom-center" | "bottom-right" | "top-center" | "top-right";

export interface PageNumbersPdfToolRunSettings {
  generatePdf?: boolean;
  startNumber?: number;
  position?: PageNumberPositionPreset;
  fontSize?: number;
  margin?: number;
  prefix?: string;
}

async function run(context: ToolExecutionContext<PageNumbersPdfToolRunSettings>): Promise<Result<ToolExecutionArtifact>> {
  if (context.sourceDocuments.length !== 1) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Add Page Numbers requires exactly one PDF file."
      }
    };
  }

  const fileResult = readSinglePdfFile(context);
  if (!fileResult.ok) {
    return fileResult;
  }

  const normalizedSettings = normalizeSettings(context.settings);
  const previewHtml = createPreviewHtml(fileResult.data.fileName, normalizedSettings);

  if (context.settings.generatePdf === false) {
    return {
      ok: true,
      data: {
        previewHtml
      }
    };
  }

  const pdfResult = await context.services.pdfEngine.pageNumbers({
    file: fileResult.data,
    fileName: context.exportOptions.fileName,
    startNumber: normalizedSettings.startNumber,
    position: normalizedSettings.position,
    fontSize: normalizedSettings.fontSize,
    margin: normalizedSettings.margin,
    prefix: normalizedSettings.prefix
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

function readSinglePdfFile(context: ToolExecutionContext<PageNumbersPdfToolRunSettings>): Result<PdfBinary> {
  const [source] = context.sourceDocuments;

  if (!source || source.format !== "pdf") {
    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_FORMAT",
        message: "Add Page Numbers only supports a single PDF source."
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

function normalizeSettings(settings: PageNumbersPdfToolRunSettings) {
  return {
    startNumber: clampInteger(settings.startNumber, 1, 1, 999999),
    position: settings.position ?? "bottom-center",
    fontSize: clampInteger(settings.fontSize, 12, 6, 72),
    margin: clampInteger(settings.margin, 24, 0, 200),
    prefix: (settings.prefix ?? "").slice(0, 40)
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
  const sampleText = `${settings.prefix}${settings.startNumber}`;

  return [
    "<div class=\"pdf-merge-preview\">",
    `  <p>Ready to add page numbers to <strong>${escapeHtml(fileName)}</strong> in the browser.</p>`,
    "  <ul>",
    `    <li><strong>Start number:</strong> ${settings.startNumber}</li>`,
    `    <li><strong>Position:</strong> ${escapeHtml(formatPositionLabel(settings.position))}</li>`,
    `    <li><strong>Font size:</strong> ${settings.fontSize}px</li>`,
    `    <li><strong>Margin from edge:</strong> ${settings.margin}px</li>`,
    `    <li><strong>Sample text:</strong> ${escapeHtml(sampleText)}</li>`,
    "  </ul>",
    "</div>"
  ].join("\n");
}

function formatPositionLabel(position: PageNumberPositionPreset): string {
  if (position === "bottom-center") {
    return "Bottom center";
  }
  if (position === "bottom-right") {
    return "Bottom right";
  }
  if (position === "top-center") {
    return "Top center";
  }
  return "Top right";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const pageNumbersPdfTool: ToolPlugin<PageNumbersPdfToolRunSettings> = {
  id: "page-numbers-pdf",
  name: "Add Page Numbers",
  description: "Add page numbers to every page of a single PDF in the browser.",
  category: "manipulation",
  inputTypes: ["pdf"],
  capabilities: ["pageNumbers"],
  settingsSchemaName: "PageNumbersPdfSettings",
  run,
  previewAdapter
};
