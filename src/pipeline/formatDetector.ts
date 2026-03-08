import type { FormatDetectionResult, FormatDetector } from "./interfaces";
import type { Result } from "../types/common";
import type { SourceDocument, SourceFormat } from "../types/document";

const SUPPORTED_FORMATS: SourceFormat[] = ["markdown", "txt", "html"];

export class BasicFormatDetector implements FormatDetector {
  detect(source: SourceDocument): Result<FormatDetectionResult> {
    const format = source.format;

    if (SUPPORTED_FORMATS.includes(format)) {
      return { ok: true, data: { format, confidence: 1 } };
    }

    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_FORMAT",
        message: `Format "${format}" is not supported in Phase 3.`
      }
    };
  }
}

