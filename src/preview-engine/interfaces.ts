import type { StandardDocumentModel } from "../types/document";
import type { Result } from "../types/common";

export interface PreviewRenderRequest {
  model: StandardDocumentModel;
  containerWidthPx: number;
  containerHeightPx: number;
}

export interface PreviewRenderResult {
  html: string;
  estimatedPageCount: number;
}

export interface PreviewRenderer {
  render: (request: PreviewRenderRequest) => Promise<Result<PreviewRenderResult>>;
  dispose?: () => void;
}
