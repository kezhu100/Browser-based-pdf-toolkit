import type { ToolPlugin } from "../../types/tool";
import type { ContentToolRunSettings } from "../../tools/plugins/contentToolRunner";

export type ContentToolId = "markdown-to-pdf" | "txt-to-pdf" | "html-to-pdf";

export interface ContentToolPlugin extends ToolPlugin<ContentToolRunSettings> {
  id: ContentToolId;
}
