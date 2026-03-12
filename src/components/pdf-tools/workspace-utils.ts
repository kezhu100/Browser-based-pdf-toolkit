import type { PdfFileItem, PdfToolId } from "./types";

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
    return "Apply is already running.";
  }
  if (params.toolId === "merge-pdf" && params.files.length < 2) {
    return "Please upload at least two PDF files.";
  }
  if (params.toolId !== "merge-pdf" && params.files.length !== 1) {
    return "Please upload exactly one PDF file.";
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
