import type { SourceDocument, SourceFormat, StandardDocumentModel } from "../types/document";
import type { Result } from "../types/common";

export interface FormatDetectionResult {
  format: SourceFormat;
  confidence: number;
}

export interface FormatDetector {
  detect: (source: SourceDocument) => Result<FormatDetectionResult>;
}

export interface ContentParser {
  supports: SourceFormat[];
  parse: (source: SourceDocument) => Promise<Result<StandardDocumentModel>>;
}

export interface ContentSanitizer {
  sanitize: (model: StandardDocumentModel) => Result<StandardDocumentModel>;
}

export interface ContentNormalizer {
  normalize: (model: StandardDocumentModel) => Result<StandardDocumentModel>;
}

export interface DocumentPipeline {
  detectFormat: (source: SourceDocument) => Result<FormatDetectionResult>;
  parse: (source: SourceDocument) => Promise<Result<StandardDocumentModel>>;
  sanitize: (model: StandardDocumentModel) => Result<StandardDocumentModel>;
  normalize: (model: StandardDocumentModel) => Result<StandardDocumentModel>;
  run: (source: SourceDocument) => Promise<Result<StandardDocumentModel>>;
}
