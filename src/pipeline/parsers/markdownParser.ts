import { marked } from "marked";
import type { ContentParser } from "../interfaces";
import type { Result } from "../../types/common";
import type { SourceDocument, SourceFormat, StandardDocumentModel } from "../../types/document";
import { guessTitle, readSourceAsText } from "./utils";

export class MarkdownParser implements ContentParser {
  supports: SourceFormat[] = ["markdown"];

  async parse(source: SourceDocument): Promise<Result<StandardDocumentModel>> {
    try {
      const markdown = readSourceAsText(source);
      const html = await marked.parse(markdown);
      const now = new Date().toISOString();

      return {
        ok: true,
        data: {
          id: source.meta.id,
          version: "1.0",
          sourceFormat: "markdown",
          meta: {
            title: guessTitle(source.meta.fileName),
            createdAtIso: now
          },
          styleProfile: {
            pageSize: "A4",
            orientation: "portrait",
            marginMm: 12
          },
          htmlContent: html,
          assets: [],
          metadata: {}
        }
      };
    } catch (cause) {
      return {
        ok: false,
        error: {
          code: "PIPELINE_ERROR",
          message: "Failed to parse markdown content.",
          cause
        }
      };
    }
  }
}
