import type { PdfFileItem, PdfToolId } from "./types";

export function getPdfExportDisabledReason(params: {
  toolId: PdfToolId;
  files: PdfFileItem[];
  previewLoading: boolean;
  previewError: string | null;
  exportLoading: boolean;
}): string | null {
  if (params.exportLoading) {
    return "Merge is already running.";
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
  if (params.previewLoading) {
    return "Wait for validation to finish.";
  }
  if (params.previewError) {
    return "Fix validation errors before exporting.";
  }
  return null;
}
