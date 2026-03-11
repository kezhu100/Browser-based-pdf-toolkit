import type { PdfToolId } from "./types";

interface PdfToolSettingsPanelProps {
  toolId: PdfToolId;
  rotateDegrees: 90 | 180 | 270;
  onRotateDegreesChange: (degrees: 90 | 180 | 270) => void;
}

export function PdfToolSettingsPanel(props: PdfToolSettingsPanelProps) {
  const { toolId, rotateDegrees, onRotateDegreesChange } = props;

  if (toolId === "merge-pdf") {
    return null;
  }

  return (
    <section className="panel">
      <h3>Tool Settings</h3>
      {toolId === "split-pdf" ? (
        <p className="subtle">Phase 10.2 uses the minimal split workflow: one uploaded PDF becomes one PDF per page.</p>
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
