import type { SourceDocument } from "../../types/document";
import type { PdfExportOptions } from "../../types/pdf-engine";
import type { ImageFileItem, ImageToolId } from "./types";

const IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

export function isSupportedImageFile(file: File): boolean {
  const extension = file.name.toLowerCase().split(".").pop() ?? "";
  const byExtension = IMAGE_EXTENSIONS.includes(extension);
  const byMime = IMAGE_MIME_TYPES.includes(file.type.toLowerCase());
  return byExtension || byMime;
}

export function getUnsupportedImageFiles(files: File[]): File[] {
  return files.filter((file) => !isSupportedImageFile(file));
}

export function toImageFileItems(files: File[]): ImageFileItem[] {
  return files.map((file, index) => {
    const id = `${file.name}-${file.size}-${file.lastModified}-${index}`;
    const objectUrl = URL.createObjectURL(file);
    const sourceDocument: SourceDocument = {
      format: "image",
      content: objectUrl,
      meta: {
        id,
        fileName: file.name,
        mimeType: file.type || inferMimeFromFileName(file.name),
        size: file.size,
        lastModified: file.lastModified
      }
    };

    return {
      id,
      file,
      objectUrl,
      sourceDocument
    };
  });
}

export function revokeImageFileItems(items: ImageFileItem[]): void {
  for (const item of items) {
    URL.revokeObjectURL(item.objectUrl);
  }
}

export function buildImagePreviewSignature(
  toolId: ImageToolId,
  imageItems: ImageFileItem[],
  exportOptions: PdfExportOptions
): string {
  const filePart = imageItems
    .map((item, index) => `${index}:${item.file.name}:${item.file.size}:${item.file.lastModified}:${item.file.type}`)
    .join("|");

  return [
    toolId,
    filePart,
    exportOptions.pageSize,
    exportOptions.orientation,
    String(exportOptions.marginMm)
  ].join("::");
}

export function getImageExportDisabledReason(params: {
  imageItems: ImageFileItem[];
  previewLoading: boolean;
  previewError: string | null;
  exportLoading: boolean;
}): string | null {
  if (params.exportLoading) {
    return "Export is already running.";
  }
  if (params.imageItems.length === 0) {
    return "Add at least one image before exporting.";
  }
  if (params.previewLoading) {
    return "Wait for preview update before exporting.";
  }
  if (params.previewError) {
    return "Fix preview errors before exporting.";
  }
  return null;
}

export function getImageAcceptAttribute(): string {
  return ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp";
}

function inferMimeFromFileName(fileName: string): string {
  const extension = fileName.toLowerCase().split(".").pop();
  if (extension === "png") {
    return "image/png";
  }
  if (extension === "webp") {
    return "image/webp";
  }
  return "image/jpeg";
}
