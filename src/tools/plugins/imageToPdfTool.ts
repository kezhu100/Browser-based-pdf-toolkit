import type { Result } from "../../types/common";
import type { ToolExecutionArtifact, ToolExecutionContext, ToolPlugin } from "../../types/tool";

async function run(_: ToolExecutionContext): Promise<Result<ToolExecutionArtifact>> {
  return {
    ok: false,
    error: { code: "NOT_IMPLEMENTED", message: "Not implemented in Phase 2 interface refinement." }
  };
}

function previewAdapter(_: ToolExecutionArtifact): string | null {
  return null;
}

export const imageToPdfTool: ToolPlugin = {
  id: "image-to-pdf",
  name: "Image to PDF",
  description: "Image to PDF tool module placeholder.",
  category: "conversion",
  inputTypes: ["image"],
  capabilities: ["preview", "generate"],
  settingsSchemaName: "ImageToPdfSettings",
  run,
  previewAdapter
};
