import type {
  ContentNormalizer,
  ContentParser,
  ContentSanitizer,
  DocumentPipeline,
  FormatDetectionResult,
  FormatDetector
} from "./interfaces";
import type { Result } from "../types/common";
import type { SourceDocument, SourceFormat, StandardDocumentModel } from "../types/document";

export class BasicDocumentPipeline implements DocumentPipeline {
  private parserMap: Record<SourceFormat, ContentParser | undefined>;

  constructor(
    private readonly detector: FormatDetector,
    parsers: ContentParser[],
    private readonly sanitizer: ContentSanitizer,
    private readonly normalizer: ContentNormalizer
  ) {
    this.parserMap = {
      markdown: undefined,
      txt: undefined,
      html: undefined,
      image: undefined,
      pdf: undefined
    };

    for (const parser of parsers) {
      for (const format of parser.supports) {
        this.parserMap[format] = parser;
      }
    }
  }

  detectFormat(source: SourceDocument): Result<FormatDetectionResult> {
    return this.detector.detect(source);
  }

  async parse(source: SourceDocument): Promise<Result<StandardDocumentModel>> {
    const detection = this.detectFormat(source);
    if (!detection.ok) {
      return detection;
    }

    const parser = this.parserMap[detection.data.format];
    if (!parser) {
      return {
        ok: false,
        error: {
          code: "UNSUPPORTED_FORMAT",
          message: `No parser registered for "${detection.data.format}".`
        }
      };
    }

    return parser.parse(source);
  }

  sanitize(model: StandardDocumentModel): Result<StandardDocumentModel> {
    return this.sanitizer.sanitize(model);
  }

  normalize(model: StandardDocumentModel): Result<StandardDocumentModel> {
    return this.normalizer.normalize(model);
  }

  async run(source: SourceDocument): Promise<Result<StandardDocumentModel>> {
    const parsed = await this.parse(source);
    if (!parsed.ok) {
      return parsed;
    }

    const sanitized = this.sanitize(parsed.data);
    if (!sanitized.ok) {
      return sanitized;
    }

    return this.normalize(sanitized.data);
  }
}

