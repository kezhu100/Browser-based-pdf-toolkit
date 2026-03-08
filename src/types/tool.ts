import type { PdfExportOptions, PdfOperationResult } from "./pdf-engine";
import type { SourceDocument, SourceFormat, StandardDocumentModel } from "./document";
import type { Result } from "./common";
import type { DocumentPipeline } from "../pipeline/interfaces";
import type { UnifiedPdfEngine } from "../pdf-engine/interfaces";
import type { PreviewRenderer } from "../preview-engine/interfaces";
import type { ZodType } from "zod";

export type ToolCategory = "conversion" | "manipulation";
export type ToolCapability =
  | "parse"
  | "sanitize"
  | "preview"
  | "generate"
  | "merge"
  | "split"
  | "reorder"
  | "watermark"
  | "pageNumbers"
  | "rotate"
  | "crop";

export type ToolId =
  | "markdown-to-pdf"
  | "txt-to-pdf"
  | "html-to-pdf"
  | "image-to-pdf"
  | "merge-pdf"
  | "split-pdf"
  | "reorder-pdf"
  | "watermark-pdf"
  | "page-numbers-pdf"
  | "rotate-pdf"
  | "crop-pdf";

export interface ToolRuntimeServices {
  pipeline: DocumentPipeline;
  previewRenderer: PreviewRenderer;
  pdfEngine: UnifiedPdfEngine;
}

export interface ToolExecutionContext<TSettings = Record<string, unknown>> {
  sourceDocuments: SourceDocument[];
  settings: TSettings;
  exportOptions: PdfExportOptions;
  services: ToolRuntimeServices;
  signal?: AbortSignal;
}

export interface ToolExecutionArtifact {
  output?: PdfOperationResult | PdfOperationResult[];
  model?: StandardDocumentModel;
  previewHtml?: string;
}

export interface ToolPlugin<
  TSettings = Record<string, unknown>,
  TArtifact extends ToolExecutionArtifact = ToolExecutionArtifact
> {
  id: ToolId;
  name: string;
  description: string;
  category: ToolCategory;
  inputTypes: SourceFormat[];
  capabilities: ToolCapability[];
  settingsSchema?: ZodType<TSettings>;
  settingsSchemaName: string;
  run: (context: ToolExecutionContext<TSettings>) => Promise<Result<TArtifact>>;
  previewAdapter?: (artifact: TArtifact) => string | null;
}

export type AnyToolPlugin = ToolPlugin<any, any>;
