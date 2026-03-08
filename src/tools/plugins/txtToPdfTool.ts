import type { ToolExecutionContext, ToolPlugin } from "../../types/tool";
import { contentPreviewAdapter, runContentToolFlow, type ContentToolRunSettings } from "./contentToolRunner";

async function run(context: ToolExecutionContext<ContentToolRunSettings>) {
  return runContentToolFlow(context, "txt", "TXT tool requires one source document.");
}

export const txtToPdfTool: ToolPlugin<ContentToolRunSettings> = {
  id: "txt-to-pdf",
  name: "TXT to PDF",
  description: "Convert plain text content to preview and downloadable PDF.",
  category: "conversion",
  inputTypes: ["txt"],
  capabilities: ["parse", "sanitize", "preview", "generate"],
  settingsSchemaName: "TxtToPdfSettings",
  run,
  previewAdapter: contentPreviewAdapter
};
