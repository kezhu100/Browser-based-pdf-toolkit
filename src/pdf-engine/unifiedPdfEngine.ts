import type {
  CropPdfRequest,
  MergePdfRequest,
  PageNumbersPdfRequest,
  PdfEditEngine,
  ReorderPdfRequest,
  RotatePdfRequest,
  SplitPdfRequest,
  UnifiedPdfEngine,
  WatermarkPdfRequest
} from "./interfaces";
import type { Result } from "../types/common";
import type { PdfOperationResult, PdfSplitResult } from "../types/pdf-engine";
import { Html2PdfRenderEngine } from "./adapters/contentPdfGenerator";

function notImplemented<T>(message: string): Result<T> {
  return {
    ok: false,
    error: { code: "NOT_IMPLEMENTED", message }
  };
}

export class BrowserUnifiedPdfEngine implements UnifiedPdfEngine, PdfEditEngine {
  private readonly renderEngine = new Html2PdfRenderEngine();

  generateFromModel = this.renderEngine.generateFromModel.bind(this.renderEngine);

  async merge(_: MergePdfRequest): Promise<Result<PdfOperationResult>> {
    return notImplemented("Merge PDF is not implemented in Phase 3.");
  }

  async split(_: SplitPdfRequest): Promise<Result<PdfSplitResult>> {
    return notImplemented("Split PDF is not implemented in Phase 3.");
  }

  async reorder(_: ReorderPdfRequest): Promise<Result<PdfOperationResult>> {
    return notImplemented("Reorder PDF is not implemented in Phase 3.");
  }

  async watermark(_: WatermarkPdfRequest): Promise<Result<PdfOperationResult>> {
    return notImplemented("Watermark PDF is not implemented in Phase 3.");
  }

  async pageNumbers(_: PageNumbersPdfRequest): Promise<Result<PdfOperationResult>> {
    return notImplemented("Page number insertion is not implemented in Phase 3.");
  }

  async rotate(_: RotatePdfRequest): Promise<Result<PdfOperationResult>> {
    return notImplemented("Rotate PDF is not implemented in Phase 3.");
  }

  async crop(_: CropPdfRequest): Promise<Result<PdfOperationResult>> {
    return notImplemented("Crop PDF is not implemented in Phase 3.");
  }
}

