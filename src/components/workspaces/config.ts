import type { ToolId } from "../../types/tool";

export type WorkspaceFamily = "content" | "image" | "pdf";

export const DEFAULT_CONVERSION_TOOL_ID: ToolId = "markdown-to-pdf";
export const DEFAULT_PDF_TOOL_ID: ToolId = "merge-pdf";

export const CONVERSION_TOOL_IDS: ToolId[] = ["markdown-to-pdf", "txt-to-pdf", "html-to-pdf", "image-to-pdf"];
export const PDF_TOOL_IDS: ToolId[] = ["merge-pdf"];
export const WORKSPACE_FAMILIES: WorkspaceFamily[] = ["content", "image", "pdf"];

const CONTENT_TOOL_IDS: ToolId[] = ["markdown-to-pdf", "txt-to-pdf", "html-to-pdf"];
const IMAGE_TOOL_IDS: ToolId[] = ["image-to-pdf"];

export function resolveSelectedWorkspaceToolId(activeToolId: ToolId | null): ToolId {
  if (activeToolId && [...CONVERSION_TOOL_IDS, ...PDF_TOOL_IDS].includes(activeToolId)) {
    return activeToolId;
  }
  return DEFAULT_CONVERSION_TOOL_ID;
}

export function resolveWorkspaceFamily(toolId: ToolId): WorkspaceFamily {
  if (CONTENT_TOOL_IDS.includes(toolId)) {
    return "content";
  }
  if (IMAGE_TOOL_IDS.includes(toolId)) {
    return "image";
  }
  return "pdf";
}

export function getWorkspaceFamilyLabel(family: WorkspaceFamily): string {
  if (family === "content") {
    return "Content";
  }
  if (family === "image") {
    return "Images";
  }
  return "PDF Tools";
}

export function getWorkspaceDefaultToolId(family: WorkspaceFamily): ToolId {
  if (family === "content") {
    return DEFAULT_CONVERSION_TOOL_ID;
  }
  if (family === "image") {
    return "image-to-pdf";
  }
  return DEFAULT_PDF_TOOL_ID;
}
