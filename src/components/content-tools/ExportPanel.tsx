interface ExportPanelProps {
  isLoading: boolean;
  disabledReason: string | null;
  onExport: () => void;
}

export function ExportPanel(props: ExportPanelProps) {
  const { isLoading, disabledReason, onExport } = props;
  const disabled = isLoading || disabledReason !== null;

  return (
    <section className="panel">
      <h3>Export</h3>
      <button type="button" className="export-btn" disabled={disabled} onClick={onExport}>
        {isLoading ? "Generating..." : "Export PDF"}
      </button>
      {disabledReason ? <p className="subtle">{disabledReason}</p> : null}
    </section>
  );
}
