import type { PdfExportOptions } from "../../types/pdf-engine";
import type { ContentToolId } from "./types";

export function normalizeMargin(value: number): number {
  if (!Number.isFinite(value)) {
    return 12;
  }
  return Math.min(40, Math.max(0, Math.round(value)));
}

export function normalizeExportOptions(options: PdfExportOptions): PdfExportOptions {
  return {
    ...options,
    marginMm: normalizeMargin(options.marginMm)
  };
}

export function buildPreviewSignature(toolId: ContentToolId, content: string, exportOptions: PdfExportOptions): string {
  return [
    toolId,
    content,
    exportOptions.pageSize,
    exportOptions.orientation,
    String(normalizeMargin(exportOptions.marginMm))
  ].join("::");
}

export function isEditorContentEmpty(content: string): boolean {
  return content.trim().length === 0;
}

export function getExportDisabledReason(params: {
  content: string;
  previewLoading: boolean;
  previewError: string | null;
  exportLoading: boolean;
}): string | null {
  const { content, previewLoading, previewError, exportLoading } = params;

  if (exportLoading) {
    return "Export is already running.";
  }
  if (isEditorContentEmpty(content)) {
    return "Add content before exporting.";
  }
  if (previewLoading) {
    return "Wait for preview update before exporting.";
  }
  if (previewError) {
    return "Fix preview errors before exporting.";
  }
  return null;
}

