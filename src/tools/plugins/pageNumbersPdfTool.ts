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

export const pageNumbersPdfTool: ToolPlugin = {
  id: "page-numbers-pdf",
  name: "Add Page Numbers",
  description: "Add Page Numbers tool module placeholder.",
  category: "manipulation",
  inputTypes: ["pdf"],
  capabilities: ["pageNumbers"],
  settingsSchemaName: "PageNumbersPdfSettings",
  run,
  previewAdapter
};
