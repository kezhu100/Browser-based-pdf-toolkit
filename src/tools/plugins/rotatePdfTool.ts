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

export const rotatePdfTool: ToolPlugin = {
  id: "rotate-pdf",
  name: "Rotate PDF",
  description: "Rotate PDF tool module placeholder.",
  category: "manipulation",
  inputTypes: ["pdf"],
  capabilities: ["rotate"],
  settingsSchemaName: "RotatePdfSettings",
  run,
  previewAdapter
};
