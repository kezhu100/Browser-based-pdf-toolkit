interface PdfPageOrderEditorProps {
  pageCount: number;
  pageOrder: number[];
  disabled: boolean;
  onMovePage: (position: number, direction: "up" | "down") => void;
  onRemovePage: (pageIndex: number) => void;
  onRestorePage: (pageIndex: number) => void;
  onReset: () => void;
}

export function PdfPageOrderEditor(props: PdfPageOrderEditorProps) {
  const { pageCount, pageOrder, disabled, onMovePage, onRemovePage, onRestorePage, onReset } = props;
  const removedPages = getRemovedPages(pageCount, pageOrder);

  return (
    <div className="pdf-page-order-editor">
      <div className="pdf-order-toolbar">
        <p className="subtle">Current order keeps {pageOrder.length} of {pageCount} page(s). Remove pages here to exclude them from export.</p>
        <button type="button" className="tool-btn" onClick={onReset} disabled={disabled}>
          Reset order
        </button>
      </div>
      <ol className="pdf-page-order-list">
        {pageOrder.map((pageIndex, position) => (
          <li key={pageIndex} className="pdf-page-order-item">
            <div>
              <strong>{position + 1}.</strong> Page {pageIndex + 1}
            </div>
            <div className="pdf-page-order-actions">
              <button type="button" className="tool-btn" onClick={() => onMovePage(position, "up")} disabled={disabled || position === 0}>
                Up
              </button>
              <button
                type="button"
                className="tool-btn"
                onClick={() => onMovePage(position, "down")}
                disabled={disabled || position === pageOrder.length - 1}
              >
                Down
              </button>
              <button type="button" className="tool-btn" onClick={() => onRemovePage(pageIndex)} disabled={disabled}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ol>
      <div className="pdf-removed-pages">
        <h4>Removed Pages</h4>
        {removedPages.length === 0 ? (
          <p className="subtle">No pages removed.</p>
        ) : (
          <div className="pdf-removed-page-list">
            {removedPages.map((pageIndex) => (
              <button key={pageIndex} type="button" className="tool-btn" onClick={() => onRestorePage(pageIndex)} disabled={disabled}>
                Restore page {pageIndex + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getRemovedPages(pageCount: number, pageOrder: number[]): number[] {
  const activePages = new Set(pageOrder);
  const removedPages: number[] = [];

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    if (!activePages.has(pageIndex)) {
      removedPages.push(pageIndex);
    }
  }

  return removedPages;
}
