import type { PreviewRenderRequest, PreviewRenderResult, PreviewRenderer } from "./interfaces";
import type { Result } from "../types/common";

export class BasicPreviewRenderer implements PreviewRenderer {
  async render(request: PreviewRenderRequest): Promise<Result<PreviewRenderResult>> {
    const { model, containerWidthPx, containerHeightPx } = request;

    if (containerWidthPx <= 0 || containerHeightPx <= 0) {
      return {
        ok: false,
        error: {
          code: "PREVIEW_ERROR",
          message: "Preview container size must be greater than zero."
        }
      };
    }

    const estimatedPageCount = Math.max(1, Math.ceil(model.htmlContent.length / 2500));

    return {
      ok: true,
      data: {
        html: model.htmlContent,
        estimatedPageCount
      }
    };
  }
}

