export type SourceFormat = "markdown" | "txt" | "html" | "image" | "pdf";

export interface SourceDocumentMeta {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  lastModified?: number;
}

export type SourceContent = string | ArrayBuffer | Uint8Array;

export interface SourceDocument {
  meta: SourceDocumentMeta;
  format: SourceFormat;
  content: SourceContent;
}

export interface DocumentStyleProfile {
  pageSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";
  marginMm: number;
}

export interface StandardDocumentMeta {
  title: string;
  language?: string;
  author?: string;
  createdAtIso: string;
  tags?: string[];
}

export interface StandardDocumentModel {
  id: string;
  version: "1.0";
  sourceFormat: SourceFormat;
  meta: StandardDocumentMeta;
  styleProfile: DocumentStyleProfile;
  htmlContent: string;
  assets: Array<{ id: string; mimeType: string; dataUrl: string }>;
  metadata: Record<string, string>;
}
