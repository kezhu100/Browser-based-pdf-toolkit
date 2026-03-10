import type { Result } from "../../types/common";
import type { PdfBinary } from "../../types/pdf-engine";
import type { ToolExecutionArtifact, ToolExecutionContext, ToolPlugin } from "../../types/tool";

export interface MergePdfToolRunSettings {
  generatePdf?: boolean;
}

async function run(context: ToolExecutionContext<MergePdfToolRunSettings>): Promise<Result<ToolExecutionArtifact>> {
  if (context.sourceDocuments.length < 2) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Merge PDF requires at least two PDF files."
      }
    };
  }

  const filesResult = readPdfFiles(context);
  if (!filesResult.ok) {
    return filesResult;
  }

  const previewHtml = createMergePreviewHtml(filesResult.data);
  if (context.settings.generatePdf === false) {
    return {
      ok: true,
      data: {
        previewHtml
      }
    };
  }

  const pdfResult = await context.services.pdfEngine.merge({
    files: filesResult.data,
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

function readPdfFiles(context: ToolExecutionContext<MergePdfToolRunSettings>): Result<PdfBinary[]> {
  const files: PdfBinary[] = [];

  for (const source of context.sourceDocuments) {
    if (source.format !== "pdf") {
      return {
        ok: false,
        error: {
          code: "UNSUPPORTED_FORMAT",
          message: `Merge PDF only supports PDF sources, received "${source.format}".`
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

    files.push({
      bytes,
      fileName: source.meta.fileName,
      mimeType: "application/pdf"
    });
  }

  return {
    ok: true,
    data: files
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

function createMergePreviewHtml(files: PdfBinary[]): string {
  const items = files
    .map((file, index) => `<li><strong>${index + 1}.</strong> ${escapeHtml(file.fileName)}</li>`)
    .join("");

  return [
    "<div class=\"pdf-merge-preview\">",
    `  <p>Ready to merge <strong>${files.length}</strong> PDF files in browser.</p>`,
    "  <ol>",
    `    ${items}`,
    "  </ol>",
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

export const mergePdfTool: ToolPlugin<MergePdfToolRunSettings> = {
  id: "merge-pdf",
  name: "Merge PDF",
  description: "Merge multiple PDF files into a single PDF in the browser.",
  category: "manipulation",
  inputTypes: ["pdf"],
  capabilities: ["merge", "preview"],
  settingsSchemaName: "MergePdfSettings",
  run,
  previewAdapter
};
