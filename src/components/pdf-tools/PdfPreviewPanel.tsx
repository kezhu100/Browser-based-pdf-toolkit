interface PdfPreviewPanelProps {
  html: string;
}

export function PdfPreviewPanel(props: PdfPreviewPanelProps) {
  const { html } = props;

  return (
    <section className="panel preview-panel">
      <h3>Preview</h3>
      <div className="preview-frame">
        <div className="preview-page">
          <div className="preview-content" dangerouslySetInnerHTML={{ __html: html || "<p>No preview yet.</p>" }} />
        </div>
      </div>
    </section>
  );
}
