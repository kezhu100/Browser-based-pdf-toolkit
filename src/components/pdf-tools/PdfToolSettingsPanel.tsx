import type { PdfToolId } from "./types";
import { PdfPageOrderEditor } from "./PdfPageOrderEditor";

interface PdfToolSettingsPanelProps {
  toolId: PdfToolId;
  rotateDegrees: 90 | 180 | 270;
  pageNumberStart: number;
  pageNumberPosition: "bottom-center" | "bottom-right" | "top-center" | "top-right";
  pageNumberFontSize: number;
  pageNumberMargin: number;
  pageNumberPrefix: string;
  reorderPageCount: number | null;
  reorderPageOrder: number[];
  reorderLoading: boolean;
  reorderError: string | null;
  onRotateDegreesChange: (degrees: 90 | 180 | 270) => void;
  onPageNumberStartChange: (value: number) => void;
  onPageNumberPositionChange: (value: "bottom-center" | "bottom-right" | "top-center" | "top-right") => void;
  onPageNumberFontSizeChange: (value: number) => void;
  onPageNumberMarginChange: (value: number) => void;
  onPageNumberPrefixChange: (value: string) => void;
  onMoveReorderPage: (position: number, direction: "up" | "down") => void;
  onRemoveReorderPage: (pageIndex: number) => void;
  onRestoreReorderPage: (pageIndex: number) => void;
  onResetReorderPages: () => void;
}

export function PdfToolSettingsPanel(props: PdfToolSettingsPanelProps) {
  const {
    toolId,
    rotateDegrees,
    pageNumberStart,
    pageNumberPosition,
    pageNumberFontSize,
    pageNumberMargin,
    pageNumberPrefix,
    reorderPageCount,
    reorderPageOrder,
    reorderLoading,
    reorderError,
    onRotateDegreesChange,
    onPageNumberStartChange,
    onPageNumberPositionChange,
    onPageNumberFontSizeChange,
    onPageNumberMarginChange,
    onPageNumberPrefixChange,
    onMoveReorderPage,
    onRemoveReorderPage,
    onRestoreReorderPage,
    onResetReorderPages
  } = props;

  if (toolId === "merge-pdf") {
    return null;
  }

  return (
    <section className="panel">
      <h3>Tool Settings</h3>
      {toolId === "split-pdf" ? (
        <>
          <p className="subtle">Phase 10.2 uses the minimal split workflow: one uploaded PDF becomes one PDF per page.</p>
          <p className="subtle">Large PDFs or PDFs with many pages may trigger many browser downloads and higher memory usage.</p>
        </>
      ) : toolId === "reorder-pdf" ? (
        <>
          <p className="subtle">Phase 10.3 keeps the page editor lightweight: move pages up/down, remove pages, then export the reordered PDF.</p>
          {reorderLoading ? <p className="subtle">Reading page count from the selected PDF...</p> : null}
          {reorderError ? <p className="subtle">{reorderError}</p> : null}
          {reorderPageCount !== null ? (
            <PdfPageOrderEditor
              pageCount={reorderPageCount}
              pageOrder={reorderPageOrder}
              disabled={reorderLoading}
              onMovePage={onMoveReorderPage}
              onRemovePage={onRemoveReorderPage}
              onRestorePage={onRestoreReorderPage}
              onReset={onResetReorderPages}
            />
          ) : null}
        </>
      ) : toolId === "page-numbers-pdf" ? (
        <div className="settings-grid">
          <label className="field">
            <span>Start Number</span>
            <input
              type="number"
              min={1}
              max={999999}
              value={pageNumberStart}
              onChange={(event) => onPageNumberStartChange(Number(event.target.value))}
            />
          </label>
          <label className="field">
            <span>Position</span>
            <select
              value={pageNumberPosition}
              onChange={(event) =>
                onPageNumberPositionChange(
                  event.target.value as "bottom-center" | "bottom-right" | "top-center" | "top-right"
                )
              }
            >
              <option value="bottom-center">Bottom center</option>
              <option value="bottom-right">Bottom right</option>
              <option value="top-center">Top center</option>
              <option value="top-right">Top right</option>
            </select>
          </label>
          <label className="field">
            <span>Font Size</span>
            <input
              type="number"
              min={6}
              max={72}
              value={pageNumberFontSize}
              onChange={(event) => onPageNumberFontSizeChange(Number(event.target.value))}
            />
          </label>
          <label className="field">
            <span>Margin</span>
            <input
              type="number"
              min={0}
              max={200}
              value={pageNumberMargin}
              onChange={(event) => onPageNumberMarginChange(Number(event.target.value))}
            />
          </label>
          <label className="field">
            <span>Prefix</span>
            <input
              type="text"
              maxLength={40}
              value={pageNumberPrefix}
              onChange={(event) => onPageNumberPrefixChange(event.target.value)}
              placeholder="Page "
            />
          </label>
          <p className="subtle">Phase 10.4 keeps page numbering minimal: one PDF in, preset placement, browser-side export.</p>
        </div>
      ) : (
        <div className="settings-grid">
          <label className="field">
            <span>Rotation</span>
            <select
              value={String(rotateDegrees)}
              onChange={(event) => onRotateDegreesChange(Number(event.target.value) as 90 | 180 | 270)}
            >
              <option value="90">90 degrees</option>
              <option value="180">180 degrees</option>
              <option value="270">270 degrees</option>
            </select>
          </label>
          <p className="subtle">Phase 10.2 rotates all pages of the uploaded PDF.</p>
        </div>
      )}
    </section>
  );
}
