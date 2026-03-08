import type { PdfExportOptions } from "../../types/pdf-engine";
import { normalizeExportOptions } from "./workspace-utils";

interface ExportSettingsPanelProps {
  options: PdfExportOptions;
  onChange: (next: PdfExportOptions) => void;
}

export function ExportSettingsPanel(props: ExportSettingsPanelProps) {
  const { options, onChange } = props;

  function update<K extends keyof PdfExportOptions>(key: K, value: PdfExportOptions[K]) {
    onChange(normalizeExportOptions({ ...options, [key]: value }));
  }

  return (
    <section className="panel">
      <h3>Export Settings</h3>
      <div className="settings-grid">
        <label className="field">
          <span>Page Size</span>
          <select value={options.pageSize} onChange={(e) => update("pageSize", e.target.value as "A4" | "Letter")}>
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
          </select>
        </label>

        <label className="field">
          <span>Orientation</span>
          <select
            value={options.orientation}
            onChange={(e) => update("orientation", e.target.value as "portrait" | "landscape")}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>

        <label className="field">
          <span>Margin (mm)</span>
          <input
            type="number"
            min={0}
            max={40}
            step={1}
            value={options.marginMm}
            onChange={(e) => update("marginMm", Number(e.target.value))}
          />
        </label>
      </div>
    </section>
  );
}
