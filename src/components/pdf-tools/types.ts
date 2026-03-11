import type { SourceDocument } from "../../types/document";
import type { AnyToolPlugin } from "../../types/tool";
import type { MergePdfToolRunSettings } from "../../tools/plugins/mergePdfTool";
import type { RotatePdfToolRunSettings } from "../../tools/plugins/rotatePdfTool";
import type { SplitPdfToolRunSettings } from "../../tools/plugins/splitPdfTool";

export type PdfToolId = "merge-pdf" | "split-pdf" | "rotate-pdf";

export type PdfToolRunSettings = MergePdfToolRunSettings | SplitPdfToolRunSettings | RotatePdfToolRunSettings;

export interface PdfToolPlugin extends AnyToolPlugin {
  id: PdfToolId;
}

export interface PdfFileItem {
  id: string;
  file: File;
  sourceDocument: SourceDocument;
}
