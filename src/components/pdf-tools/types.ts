import type { SourceDocument } from "../../types/document";
import type { ToolPlugin } from "../../types/tool";
import type { MergePdfToolRunSettings } from "../../tools/plugins/mergePdfTool";

export type PdfToolId = "merge-pdf";

export interface PdfToolPlugin extends ToolPlugin<MergePdfToolRunSettings> {
  id: PdfToolId;
}

export interface PdfFileItem {
  id: string;
  file: File;
  sourceDocument: SourceDocument;
}
