import type { ContentNormalizer } from "./interfaces";
import type { Result } from "../types/common";
import type { StandardDocumentModel } from "../types/document";

export class BasicDocumentNormalizer implements ContentNormalizer {
  normalize(model: StandardDocumentModel): Result<StandardDocumentModel> {
    const normalizedTitle = model.meta.title.trim() || "Untitled Document";

    return {
      ok: true,
      data: {
        ...model,
        meta: {
          ...model.meta,
          title: normalizedTitle
        },
        metadata: {
          ...model.metadata,
          normalizedBy: "BasicDocumentNormalizer"
        }
      }
    };
  }
}

