import type { ContentParser } from "../interfaces";
import type { Result } from "../../types/common";
import type { SourceDocument, SourceFormat, StandardDocumentModel } from "../../types/document";
import { escapeHtml, guessTitle, readSourceAsText } from "./utils";

export class TxtParser implements ContentParser {
  supports: SourceFormat[] = ["txt"];

  async parse(source: SourceDocument): Promise<Result<StandardDocumentModel>> {
    try {
      const text = readSourceAsText(source);
      const paragraphs = text
        .split(/\r?\n\r?\n/)
        .map((segment) => segment.trim())
        .filter(Boolean)
        .map((segment) => `<p>${escapeHtml(segment).replace(/\r?\n/g, "<br/>")}</p>`)
        .join("");

      const html = `<article>${paragraphs}</article>`;
      const now = new Date().toISOString();

      return {
        ok: true,
        data: {
          id: source.meta.id,
          version: "1.0",
          sourceFormat: "txt",
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
          message: "Failed to parse TXT content.",
          cause
        }
      };
    }
  }
}
