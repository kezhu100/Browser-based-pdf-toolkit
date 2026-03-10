import type { PdfFileItem } from "./types";

interface PdfFileListPanelProps {
  items: PdfFileItem[];
}

export function PdfFileListPanel(props: PdfFileListPanelProps) {
  const { items } = props;

  return (
    <section className="panel">
      <h3>Selected Files</h3>
      {items.length === 0 ? (
        <p className="subtle">No PDF files selected yet.</p>
      ) : (
        <ol className="file-list">
          {items.map((item, index) => (
            <li key={item.id}>
              <strong>{index + 1}.</strong> {item.file.name} <span className="subtle">({formatFileSize(item.file.size)})</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
