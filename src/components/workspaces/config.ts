import { toolRegistryById } from "../../tools/registry";
import type { ToolId } from "../../types/tool";

export type WorkspaceFamily = "content" | "image";

export const DEFAULT_CONVERSION_TOOL_ID: ToolId = "markdown-to-pdf";

export const CONVERSION_TOOL_IDS: ToolId[] = ["markdown-to-pdf", "txt-to-pdf", "html-to-pdf", "image-to-pdf"];

const CONTENT_TOOL_IDS: ToolId[] = ["markdown-to-pdf", "txt-to-pdf", "html-to-pdf"];

export function resolveSelectedConversionToolId(activeToolId: ToolId | null): ToolId {
  if (activeToolId && CONVERSION_TOOL_IDS.includes(activeToolId)) {
    return activeToolId;
  }
  return DEFAULT_CONVERSION_TOOL_ID;
}

export function resolveWorkspaceFamily(toolId: ToolId): WorkspaceFamily {
  if (CONTENT_TOOL_IDS.includes(toolId)) {
    return "content";
  }
  return "image";
}

export function getWorkspaceToolLabel(toolId: ToolId): string {
  return toolRegistryById[toolId]?.name ?? toolId;
}
