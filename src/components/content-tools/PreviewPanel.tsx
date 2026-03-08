import type { PdfExportOptions } from "../../types/pdf-engine";

interface PreviewPanelProps {
  html: string;
  exportOptions: PdfExportOptions;
}

export function PreviewPanel(props: PreviewPanelProps) {
  const { html, exportOptions } = props;
  const page = getPageDimensionsPx(exportOptions);
  const marginPx = Math.round((exportOptions.marginMm / 25.4) * 96);
  const contentWidth = Math.max(120, page.width - marginPx * 2);

  return (
    <section className="panel preview-panel">
      <h3>Preview</h3>
      <div className="preview-frame">
        <div className="preview-page" style={{ maxWidth: `${page.width}px`, padding: `${marginPx}px` }}>
          <div
            className="preview-content"
            style={{ width: `${contentWidth}px`, maxWidth: `${contentWidth}px` }}
            dangerouslySetInnerHTML={{ __html: html || "<p>No preview yet.</p>" }}
          />
        </div>
      </div>
    </section>
  );
}

function getPageDimensionsPx(options: PdfExportOptions): { width: number; height: number } {
  const base = options.pageSize === "Letter" ? { width: 8.5, height: 11 } : { width: 8.27, height: 11.69 };
  const inches = options.orientation === "landscape" ? { width: base.height, height: base.width } : base;
  return {
    width: Math.round(inches.width * 96),
    height: Math.round(inches.height * 96)
  };
}
