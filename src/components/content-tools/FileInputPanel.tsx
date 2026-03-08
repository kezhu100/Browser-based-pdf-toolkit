import { useState } from "react";
import type { ChangeEvent, DragEvent } from "react";

interface FileInputPanelProps {
  disabled?: boolean;
  onFileSelected: (file: File) => Promise<void>;
}

export function FileInputPanel(props: FileInputPanelProps) {
  const { disabled = false, onFileSelected } = props;
  const [dragActive, setDragActive] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await onFileSelected(file);
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    if (disabled) {
      return;
    }
    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }
    await onFileSelected(file);
  }

  return (
    <section className="panel">
      <h3>Local File</h3>
      <p className="subtle">Supported: .md .txt .html</p>
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
        {disabled ? "File input disabled while exporting" : "Drag and drop a file here"}
      </div>
      <input type="file" disabled={disabled} accept=".md,.markdown,.txt,.html,.htm,text/*" onChange={handleFileChange} />
    </section>
  );
}
