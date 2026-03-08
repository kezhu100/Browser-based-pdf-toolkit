import type { ContentParser } from "../interfaces";
import type { Result } from "../../types/common";
import type { SourceDocument, SourceFormat, StandardDocumentModel } from "../../types/document";
import { guessTitle, readSourceAsText } from "./utils";

export class HtmlParser implements ContentParser {
  supports: SourceFormat[] = ["html"];

  async parse(source: SourceDocument): Promise<Result<StandardDocumentModel>> {
    try {
      const html = readSourceAsText(source);
      const now = new Date().toISOString();

      return {
        ok: true,
        data: {
          id: source.meta.id,
          version: "1.0",
          sourceFormat: "html",
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
          message: "Failed to parse HTML content.",
          cause
        }
      };
    }
  }
}
