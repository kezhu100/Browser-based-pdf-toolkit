import type { ToolExecutionContext, ToolPlugin } from "../../types/tool";
import { contentPreviewAdapter, runContentToolFlow, type ContentToolRunSettings } from "./contentToolRunner";

async function run(context: ToolExecutionContext<ContentToolRunSettings>) {
  return runContentToolFlow(context, "markdown", "Markdown tool requires one source document.");
}

export const markdownToPdfTool: ToolPlugin<ContentToolRunSettings> = {
  id: "markdown-to-pdf",
  name: "Markdown to PDF",
  description: "Convert Markdown content to preview and downloadable PDF.",
  category: "conversion",
  inputTypes: ["markdown"],
  capabilities: ["parse", "sanitize", "preview", "generate"],
  settingsSchemaName: "MarkdownToPdfSettings",
  run,
  previewAdapter: contentPreviewAdapter
};
