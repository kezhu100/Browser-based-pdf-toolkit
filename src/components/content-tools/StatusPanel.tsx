interface StatusPanelProps {
  fileLoading: boolean;
  fileStatus: string | null;
  fileError: string | null;
  previewLoading: boolean;
  previewError: string | null;
  exportLoading: boolean;
  exportError: string | null;
  exportSuccess: string | null;
}

export function StatusPanel(props: StatusPanelProps) {
  const { fileLoading, fileStatus, fileError, previewLoading, previewError, exportLoading, exportError, exportSuccess } = props;

  return (
    <section className="panel">
      <h3>Status</h3>
      <div className="status-stack">
        <p className={fileError ? "status error" : fileStatus ? "status success" : "status info"}>
          {fileError
            ? `File: ${fileError}`
            : fileLoading
              ? "File: loading..."
              : fileStatus
                ? `File: ${fileStatus}`
                : "File: idle"}
        </p>
        <p className={previewError ? "status error" : "status info"}>
          {previewError ? `Preview: ${previewError}` : previewLoading ? "Preview: updating..." : "Preview: ready"}
        </p>
        <p className={exportError ? "status error" : exportSuccess ? "status success" : "status info"}>
          {exportError
            ? `Export: ${exportError}`
            : exportLoading
              ? "Export: generating PDF..."
              : exportSuccess
                ? `Export: ${exportSuccess}`
                : "Export: idle"}
        </p>
      </div>
    </section>
  );
}
