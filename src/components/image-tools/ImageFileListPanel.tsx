import type { ImageFileItem } from "./types";

interface ImageFileListPanelProps {
  items: ImageFileItem[];
}

export function ImageFileListPanel(props: ImageFileListPanelProps) {
  const { items } = props;

  return (
    <section className="panel">
      <h3>Selected Images</h3>
      {items.length === 0 ? (
        <p className="subtle">No image files selected yet.</p>
      ) : (
        <ol className="image-file-list">
          {items.map((item, index) => (
            <li key={item.id}>
              <span>{index + 1}.</span> <strong>{item.file.name}</strong> <span className="subtle">({formatSize(item.file.size)})</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function formatSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}
