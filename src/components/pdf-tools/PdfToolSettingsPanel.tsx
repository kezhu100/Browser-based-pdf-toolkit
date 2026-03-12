import type { PdfToolId } from "./types";
import { PdfPageOrderEditor } from "./PdfPageOrderEditor";

interface PdfToolSettingsPanelProps {
  toolId: PdfToolId;
  rotateDegrees: 90 | 180 | 270;
  reorderPageCount: number | null;
  reorderPageOrder: number[];
  reorderLoading: boolean;
  reorderError: string | null;
  onRotateDegreesChange: (degrees: 90 | 180 | 270) => void;
  onMoveReorderPage: (position: number, direction: "up" | "down") => void;
  onRemoveReorderPage: (pageIndex: number) => void;
  onRestoreReorderPage: (pageIndex: number) => void;
  onResetReorderPages: () => void;
}

export function PdfToolSettingsPanel(props: PdfToolSettingsPanelProps) {
  const {
    toolId,
    rotateDegrees,
    reorderPageCount,
    reorderPageOrder,
    reorderLoading,
    reorderError,
    onRotateDegreesChange,
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
