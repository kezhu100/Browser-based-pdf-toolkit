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
import { addPageNumbersToPdfFile, mergePdfFiles, reorderPdfFile, rotatePdfFile, splitPdfFile } from "./adapters/pdfEditAdapter";

function notImplemented<T>(message: string): Result<T> {
  return {
    ok: false,
    error: { code: "NOT_IMPLEMENTED", message }
  };
}

export class BrowserUnifiedPdfEngine implements UnifiedPdfEngine, PdfEditEngine {
  private readonly renderEngine = new Html2PdfRenderEngine();

  generateFromModel = this.renderEngine.generateFromModel.bind(this.renderEngine);

  async merge(request: MergePdfRequest): Promise<Result<PdfOperationResult>> {
    return mergePdfFiles(request);
  }

  async split(request: SplitPdfRequest): Promise<Result<PdfSplitResult>> {
    return splitPdfFile(request);
  }

  async reorder(request: ReorderPdfRequest): Promise<Result<PdfOperationResult>> {
    return reorderPdfFile(request);
  }

  async watermark(_: WatermarkPdfRequest): Promise<Result<PdfOperationResult>> {
    return notImplemented("Watermark PDF is not implemented in Phase 3.");
  }

  async pageNumbers(request: PageNumbersPdfRequest): Promise<Result<PdfOperationResult>> {
    return addPageNumbersToPdfFile(request);
  }

  async rotate(request: RotatePdfRequest): Promise<Result<PdfOperationResult>> {
    return rotatePdfFile(request);
  }

  async crop(_: CropPdfRequest): Promise<Result<PdfOperationResult>> {
    return notImplemented("Crop PDF is not implemented in Phase 3.");
  }
}
