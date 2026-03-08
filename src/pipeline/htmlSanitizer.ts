import DOMPurify from "dompurify";
import type { ContentSanitizer } from "./interfaces";
import type { Result } from "../types/common";
import type { StandardDocumentModel } from "../types/document";

export class BasicHtmlSanitizer implements ContentSanitizer {
  sanitize(model: StandardDocumentModel): Result<StandardDocumentModel> {
    if (typeof window === "undefined") {
      return {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "HTML sanitization requires a browser environment."
        }
      };
    }

    try {
      const sanitizedHtml = DOMPurify.sanitize(model.htmlContent, {
        USE_PROFILES: { html: true }
      });

      return {
        ok: true,
        data: {
          ...model,
          htmlContent: sanitizedHtml
        }
      };
    } catch (cause) {
      return {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Failed to sanitize HTML content.",
          cause
        }
      };
    }
  }
}
