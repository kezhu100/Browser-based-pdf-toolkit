import { BrowserUnifiedPdfEngine } from "../pdf-engine/unifiedPdfEngine";
import { BasicDocumentNormalizer } from "../pipeline/documentNormalizer";
import { BasicDocumentPipeline } from "../pipeline/documentPipeline";
import { BasicFormatDetector } from "../pipeline/formatDetector";
import { BasicHtmlSanitizer } from "../pipeline/htmlSanitizer";
import { HtmlParser } from "../pipeline/parsers/htmlParser";
import { MarkdownParser } from "../pipeline/parsers/markdownParser";
import { TxtParser } from "../pipeline/parsers/txtParser";
import { BasicPreviewRenderer } from "../preview-engine/basicPreviewRenderer";
import type { ToolRuntimeServices } from "../types/tool";

export function createRuntimeServices(): ToolRuntimeServices {
  const pipeline = new BasicDocumentPipeline(
    new BasicFormatDetector(),
    [new MarkdownParser(), new TxtParser(), new HtmlParser()],
    new BasicHtmlSanitizer(),
    new BasicDocumentNormalizer()
  );

  return {
    pipeline,
    previewRenderer: new BasicPreviewRenderer(),
    pdfEngine: new BrowserUnifiedPdfEngine()
  };
}

