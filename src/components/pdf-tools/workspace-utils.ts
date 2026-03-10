import type { PdfFileItem } from "./types";

export function getMergeExportDisabledReason(params: {
  files: PdfFileItem[];
  previewLoading: boolean;
  previewError: string | null;
  exportLoading: boolean;
}): string | null {
  if (params.exportLoading) {
    return "Merge is already running.";
  }
  if (params.files.length === 0) {
    return "Add PDF files before merging.";
  }
  if (params.files.length === 1) {
    return "Add at least two PDF files to merge.";
  }
  if (params.previewLoading) {
    return "Wait for validation to finish.";
  }
  if (params.previewError) {
    return "Fix validation errors before merging.";
  }
  return null;
}
