import type { PdfFileItem, PdfToolId } from "./types";

function getPdfToolActionLabel(toolId: PdfToolId): string {
  if (toolId === "merge-pdf") {
    return "Merge";
  }
  if (toolId === "split-pdf") {
    return "Split";
  }
  if (toolId === "reorder-pdf") {
    return "Reorder";
  }
  if (toolId === "watermark-pdf") {
    return "Add Watermark";
  }
  if (toolId === "page-numbers-pdf") {
    return "Add Page Numbers";
  }
  if (toolId === "crop-pdf") {
    return "Crop";
  }
  return "Rotate";
}

export function getPdfExportDisabledReason(params: {
  toolId: PdfToolId;
  files: PdfFileItem[];
  reorderPageOrder?: number[];
  reorderReady?: boolean;
  previewLoading: boolean;
  previewError: string | null;
  exportLoading: boolean;
}): string | null {
  if (params.exportLoading) {
    return `${getPdfToolActionLabel(params.toolId)} is already running.`;
  }
  if (params.files.length === 0) {
    return "Add PDF files before running this tool.";
  }
  if (params.toolId === "merge-pdf" && params.files.length === 1) {
    return "Add at least two PDF files to merge.";
  }
  if (params.toolId !== "merge-pdf" && params.files.length !== 1) {
    return "This tool requires exactly one PDF file.";
  }
  if (params.toolId === "reorder-pdf" && !params.reorderReady) {
    return "Wait for page order setup to finish.";
  }
  if (params.toolId === "reorder-pdf" && (params.reorderPageOrder?.length ?? 0) === 0) {
    return "Keep at least one page before exporting.";
  }
  if (params.previewLoading) {
    return "Wait for validation to finish.";
  }
  if (params.previewError) {
    return "Fix validation errors before exporting.";
  }
  return null;
}
