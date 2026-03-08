export type WarningMessage = {
  code: string;
  message: string;
};

export type AppErrorCode =
  | "NOT_IMPLEMENTED"
  | "INVALID_INPUT"
  | "UNSUPPORTED_FORMAT"
  | "PIPELINE_ERROR"
  | "PREVIEW_ERROR"
  | "PDF_ENGINE_ERROR"
  | "VALIDATION_ERROR"
  | "UNKNOWN_ERROR";

export interface AppError {
  code: AppErrorCode;
  message: string;
  cause?: unknown;
}

export type Result<T, E = AppError> =
  | { ok: true; data: T; warnings?: WarningMessage[] }
  | { ok: false; error: E; warnings?: WarningMessage[] };

export interface FileLike {
  name: string;
  type: string;
  size: number;
}
