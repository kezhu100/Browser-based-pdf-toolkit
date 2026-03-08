import type { ToolExecutionContext, ToolPlugin } from "../../types/tool";
import { contentPreviewAdapter, runContentToolFlow, type ContentToolRunSettings } from "./contentToolRunner";

async function run(context: ToolExecutionContext<ContentToolRunSettings>) {
  return runContentToolFlow(context, "html", "HTML tool requires one source document.");
}

export const htmlToPdfTool: ToolPlugin<ContentToolRunSettings> = {
  id: "html-to-pdf",
  name: "HTML to PDF",
  description: "Convert safe HTML content to preview and downloadable PDF.",
  category: "conversion",
  inputTypes: ["html"],
  capabilities: ["parse", "sanitize", "preview", "generate"],
  settingsSchemaName: "HtmlToPdfSettings",
  run,
  previewAdapter: contentPreviewAdapter
};
