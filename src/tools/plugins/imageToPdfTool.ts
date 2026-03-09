import type { PdfExportOptions } from "../../types/pdf-engine";
import type { ToolPlugin } from "../../types/tool";
import type { Result } from "../../types/common";
import type { SourceDocument, StandardDocumentModel } from "../../types/document";
import type { ToolExecutionContext, ToolExecutionArtifact } from "../../types/tool";

export interface ImageToolRunSettings {
  generatePdf?: boolean;
  precomputedModel?: StandardDocumentModel;
}

interface ImageSourceItem {
  name: string;
  mimeType: string;
  objectUrl: string;
}

async function run(context: ToolExecutionContext<ImageToolRunSettings>): Promise<Result<ToolExecutionArtifact>> {
  const sources = context.sourceDocuments;
  if (sources.length === 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Image tool requires at least one image file."
      }
    };
  }

  const imageItemsResult = readImageSources(sources);
  if (!imageItemsResult.ok) {
    return imageItemsResult;
  }

  const shouldGeneratePdf = context.settings.generatePdf ?? true;
  const model =
    context.settings.precomputedModel ??
    createImageDocumentModel({
      images: imageItemsResult.data,
      exportOptions: context.exportOptions
    });

  const previewResult = await context.services.previewRenderer.render({
    model,
    containerWidthPx: 1000,
    containerHeightPx: 1400
  });

  if (!previewResult.ok) {
    return previewResult;
  }

  if (!shouldGeneratePdf) {
    return {
      ok: true,
      data: {
        model,
        previewHtml: previewResult.data.html
      }
    };
  }

  const pdfResult = await context.services.pdfEngine.generateFromModel({
    model,
    options: context.exportOptions
  });

  if (!pdfResult.ok) {
    return pdfResult;
  }

  return {
    ok: true,
    data: {
      model,
      previewHtml: previewResult.data.html,
      output: pdfResult.data
    }
  };
}

function previewAdapter(artifact: ToolExecutionArtifact): string | null {
  return artifact.previewHtml ?? artifact.model?.htmlContent ?? null;
}

function readImageSources(sources: SourceDocument[]): Result<ImageSourceItem[]> {
  const images: ImageSourceItem[] = [];

  for (const source of sources) {
    if (source.format !== "image") {
      return {
        ok: false,
        error: {
          code: "UNSUPPORTED_FORMAT",
          message: `Image tool only supports image sources, received "${source.format}".`
        }
      };
    }

    if (typeof source.content !== "string" || source.content.trim().length === 0) {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: `Invalid image content for ${source.meta.fileName}.`
        }
      };
    }

    images.push({
      name: source.meta.fileName,
      mimeType: source.meta.mimeType,
      objectUrl: source.content
    });
  }

  return {
    ok: true,
    data: images
  };
}

function createImageDocumentModel(params: {
  images: ImageSourceItem[];
  exportOptions: PdfExportOptions;
}): StandardDocumentModel {
  const { images, exportOptions } = params;

  const sections = images
    .map((image, index) => {
      const pageBreak = index < images.length - 1 ? " image-page-break" : "";
      return [
        `<section class="image-pdf-page${pageBreak}">`,
        `  <figure class="image-pdf-figure">`,
        `    <img class="image-pdf-img" src="${escapeAttribute(image.objectUrl)}" alt="${escapeAttribute(image.name)}" />`,
        `    <figcaption class="image-pdf-caption">${escapeText(image.name)}</figcaption>`,
        "  </figure>",
        "</section>"
      ].join("\n");
    })
    .join("\n");

  const htmlContent = [
    "<style>",
    "  .image-pdf-page { width: 100%; }",
    "  .image-pdf-page-break { break-after: page; page-break-after: always; }",
    "  .image-pdf-figure { margin: 0; display: flex; flex-direction: column; gap: 8px; align-items: center; }",
    "  .image-pdf-img { display: block; width: 100%; height: auto; max-width: 100%; max-height: 1200px; object-fit: contain; border-radius: 4px; /* conservative cap to avoid huge html2canvas render surfaces during PDF export */ }",
    "  .image-pdf-caption { width: 100%; font-size: 12px; color: #4b5565; text-align: left; overflow-wrap: anywhere; }",
    "</style>",
    sections
  ].join("\n");

  return {
    id: `img-model-${Date.now()}`,
    version: "1.0",
    sourceFormat: "image",
    meta: {
      title: "Image to PDF",
      createdAtIso: new Date().toISOString(),
      tags: ["image", "pdf"]
    },
    styleProfile: {
      pageSize: exportOptions.pageSize,
      orientation: exportOptions.orientation,
      marginMm: exportOptions.marginMm
    },
    htmlContent,
    assets: images.map((image, index) => ({
      id: `img-${index + 1}`,
      mimeType: image.mimeType,
      dataUrl: image.objectUrl
    })),
    metadata: {
      imageCount: String(images.length)
    }
  };
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export const imageToPdfTool: ToolPlugin<ImageToolRunSettings> = {
  id: "image-to-pdf",
  name: "Image to PDF",
  description: "Convert local images to single-page or multi-page PDF in the browser.",
  category: "conversion",
  inputTypes: ["image"],
  capabilities: ["preview", "generate"],
  settingsSchemaName: "ImageToPdfSettings",
  run,
  previewAdapter
};
