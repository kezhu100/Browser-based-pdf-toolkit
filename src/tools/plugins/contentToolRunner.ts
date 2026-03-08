import type { StandardDocumentModel } from "../../types/document";
import type { Result } from "../../types/common";
import type { SourceFormat } from "../../types/document";
import type { ToolExecutionArtifact, ToolExecutionContext } from "../../types/tool";

const DEFAULT_PREVIEW_CONTAINER = {
  width: 800,
  height: 1000
};

export async function runContentToolFlow(
  context: ToolExecutionContext<ContentToolRunSettings>,
  expectedFormat: SourceFormat,
  missingSourceMessage: string
): Promise<Result<ToolExecutionArtifact>> {
  const source = context.sourceDocuments[0];
  if (!source) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: missingSourceMessage
      }
    };
  }

  if (source.format !== expectedFormat) {
    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_FORMAT",
        message: `Expected "${expectedFormat}" source format, received "${source.format}".`
      }
    };
  }

  const rawContent = readSourceContent(source.content);
  if (rawContent.trim().length === 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "Input content is empty."
      }
    };
  }

  const shouldGeneratePdf = context.settings.generatePdf ?? true;
  const previewWidth = context.settings.previewWidth ?? DEFAULT_PREVIEW_CONTAINER.width;
  const previewHeight = context.settings.previewHeight ?? DEFAULT_PREVIEW_CONTAINER.height;

  let model: StandardDocumentModel;
  if (context.settings.precomputedModel) {
    model = context.settings.precomputedModel;
  } else {
    const modelResult = await context.services.pipeline.run(source);
    if (!modelResult.ok) {
      return modelResult;
    }
    model = modelResult.data;
  }

  const previewResult = await context.services.previewRenderer.render({
    model,
    containerWidthPx: previewWidth,
    containerHeightPx: previewHeight
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

export function contentPreviewAdapter(artifact: ToolExecutionArtifact): string | null {
  return artifact.previewHtml ?? artifact.model?.htmlContent ?? null;
}

export interface ContentToolRunSettings {
  generatePdf?: boolean;
  precomputedModel?: StandardDocumentModel;
  previewWidth?: number;
  previewHeight?: number;
}

function readSourceContent(content: string | ArrayBuffer | Uint8Array): string {
  if (typeof content === "string") {
    return content;
  }
  if (content instanceof Uint8Array) {
    return new TextDecoder().decode(content);
  }
  return new TextDecoder().decode(new Uint8Array(content));
}
