import type { SourceDocument } from "../../types/document";
import type { ToolPlugin } from "../../types/tool";
import type { ImageToolRunSettings } from "../../tools/plugins/imageToPdfTool";

export type ImageToolId = "image-to-pdf";

export interface ImageToolPlugin extends ToolPlugin<ImageToolRunSettings> {
  id: ImageToolId;
}

export interface ImageFileItem {
  id: string;
  file: File;
  objectUrl: string;
  sourceDocument: SourceDocument;
}
