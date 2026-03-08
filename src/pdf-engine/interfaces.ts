import type {
  PageBox,
  PdfBinary,
  PdfExportOptions,
  PdfOperationResult,
  PdfSplitResult
} from "../types/pdf-engine";
import type { StandardDocumentModel } from "../types/document";
import type { Result } from "../types/common";

export interface GeneratePdfRequest {
  model: StandardDocumentModel;
  options: PdfExportOptions;
}

export interface MergePdfRequest {
  files: PdfBinary[];
  fileName: string;
}

export interface SplitPdfRequest {
  file: PdfBinary;
  ranges: string;
  fileNamePrefix: string;
}

export interface ReorderPdfRequest {
  file: PdfBinary;
  pageOrder: number[];
  fileName: string;
}

export interface WatermarkPdfRequest {
  file: PdfBinary;
  text: string;
  fileName: string;
}

export interface PageNumbersPdfRequest {
  file: PdfBinary;
  fileName: string;
}

export interface RotatePdfRequest {
  file: PdfBinary;
  pages: number[];
  degrees: 90 | 180 | 270;
  fileName: string;
}

export interface CropPdfRequest {
  file: PdfBinary;
  pages: number[];
  box: PageBox;
  fileName: string;
}

export interface PdfRenderEngine {
  generateFromModel: (request: GeneratePdfRequest) => Promise<Result<PdfOperationResult>>;
}

export interface PdfEditEngine {
  merge: (request: MergePdfRequest) => Promise<Result<PdfOperationResult>>;
  split: (request: SplitPdfRequest) => Promise<Result<PdfSplitResult>>;
  reorder: (request: ReorderPdfRequest) => Promise<Result<PdfOperationResult>>;
  watermark: (request: WatermarkPdfRequest) => Promise<Result<PdfOperationResult>>;
  pageNumbers: (request: PageNumbersPdfRequest) => Promise<Result<PdfOperationResult>>;
  rotate: (request: RotatePdfRequest) => Promise<Result<PdfOperationResult>>;
  crop: (request: CropPdfRequest) => Promise<Result<PdfOperationResult>>;
}

export interface UnifiedPdfEngine extends PdfRenderEngine, PdfEditEngine {}
