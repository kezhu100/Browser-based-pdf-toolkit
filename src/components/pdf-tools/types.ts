import type { SourceDocument } from "../../types/document";
import type { AnyToolPlugin } from "../../types/tool";
import type { MergePdfToolRunSettings } from "../../tools/plugins/mergePdfTool";
import type { ReorderPdfToolRunSettings } from "../../tools/plugins/reorderPdfTool";
import type { RotatePdfToolRunSettings } from "../../tools/plugins/rotatePdfTool";
import type { SplitPdfToolRunSettings } from "../../tools/plugins/splitPdfTool";

export type PdfToolId = "merge-pdf" | "split-pdf" | "reorder-pdf" | "rotate-pdf";

export type PdfToolRunSettings =
  | MergePdfToolRunSettings
  | SplitPdfToolRunSettings
  | ReorderPdfToolRunSettings
  | RotatePdfToolRunSettings;

export interface PdfToolPlugin extends AnyToolPlugin {
  id: PdfToolId;
}

export interface PdfFileItem {
  id: string;
  file: File;
  sourceDocument: SourceDocument;
}
