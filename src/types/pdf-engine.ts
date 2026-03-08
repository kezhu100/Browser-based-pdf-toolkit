export interface PdfExportOptions {
  fileName: string;
  pageSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";
  marginMm: number;
  compress?: boolean;
}

export interface PdfBinary {
  bytes: Uint8Array;
  fileName: string;
  mimeType: "application/pdf";
}

export interface PdfOperationResult {
  blob: Blob;
  fileName: string;
  mimeType: "application/pdf";
}

export interface PdfSplitResult {
  files: PdfOperationResult[];
}

export interface PageBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
