import type { SourceDocument } from "../../types/document";
import type { AnyToolPlugin } from "../../types/tool";
import type { MergePdfToolRunSettings } from "../../tools/plugins/mergePdfTool";
import type { CropPdfToolRunSettings } from "../../tools/plugins/cropPdfTool";
import type { PageNumbersPdfToolRunSettings } from "../../tools/plugins/pageNumbersPdfTool";
import type { ReorderPdfToolRunSettings } from "../../tools/plugins/reorderPdfTool";
import type { RotatePdfToolRunSettings } from "../../tools/plugins/rotatePdfTool";
import type { SplitPdfToolRunSettings } from "../../tools/plugins/splitPdfTool";
import type { WatermarkPdfToolRunSettings } from "../../tools/plugins/watermarkPdfTool";

export type PdfToolId = "merge-pdf" | "split-pdf" | "reorder-pdf" | "watermark-pdf" | "page-numbers-pdf" | "rotate-pdf" | "crop-pdf";

export type PdfToolRunSettings =
  | CropPdfToolRunSettings
  | MergePdfToolRunSettings
  | SplitPdfToolRunSettings
  | ReorderPdfToolRunSettings
  | WatermarkPdfToolRunSettings
  | PageNumbersPdfToolRunSettings
  | RotatePdfToolRunSettings;

export interface PdfToolPlugin extends AnyToolPlugin {
  id: PdfToolId;
}

export interface PdfFileItem {
  id: string;
  file: File;
  sourceDocument: SourceDocument;
}
