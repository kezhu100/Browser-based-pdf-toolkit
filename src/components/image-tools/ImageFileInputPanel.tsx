import type { ChangeEvent, DragEvent } from "react";
import { useState } from "react";
import { getImageAcceptAttribute } from "./config";

interface ImageFileInputPanelProps {
  disabled?: boolean;
  onFilesSelected: (files: File[]) => Promise<void>;
}

export function ImageFileInputPanel(props: ImageFileInputPanelProps) {
  const { disabled = false, onFilesSelected } = props;
  const [dragActive, setDragActive] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) {
      return;
    }
    await onFilesSelected(files);
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    if (disabled) {
      return;
    }

    const files = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
    if (files.length === 0) {
      return;
    }

    await onFilesSelected(files);
  }

  return (
    <section className="panel">
      <h3>Image Files</h3>
      <p className="subtle">Supported: PNG, JPG, JPEG, WEBP. Multi-file upload creates multi-page PDF.</p>
      <div
        className={disabled ? "dropzone disabled" : dragActive ? "dropzone active" : "dropzone"}
        onDragOver={(event) => {
          if (disabled) {
            return;
          }
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        {disabled ? "File input disabled while exporting" : "Drag and drop image files here"}
      </div>
      <input type="file" multiple disabled={disabled} accept={getImageAcceptAttribute()} onChange={handleFileChange} />
    </section>
  );
}
