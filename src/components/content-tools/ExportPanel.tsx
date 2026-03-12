interface ExportPanelProps {
  isLoading: boolean;
  disabledReason: string | null;
  onExport: () => void;
  idleLabel?: string;
  loadingLabel?: string;
}

export function ExportPanel(props: ExportPanelProps) {
  const { isLoading, disabledReason, onExport, idleLabel = "Export PDF", loadingLabel = "Generating..." } = props;
  const disabled = isLoading || disabledReason !== null;

  return (
    <section className="panel">
      <h3>Export</h3>
      <button type="button" className="export-btn" disabled={disabled} onClick={onExport}>
        {isLoading ? loadingLabel : idleLabel}
      </button>
      {disabledReason ? <p className="subtle">{disabledReason}</p> : null}
    </section>
  );
}
