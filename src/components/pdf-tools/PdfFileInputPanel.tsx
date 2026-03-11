import type { ChangeEvent } from "react";
import { getPdfAcceptAttribute } from "./config";

interface PdfFileInputPanelProps {
  disabled: boolean;
  hint: string;
  multiple: boolean;
  onFilesSelected: (files: File[]) => void;
}

export function PdfFileInputPanel(props: PdfFileInputPanelProps) {
  const { disabled, hint, multiple, onFilesSelected } = props;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    onFilesSelected(files);
    event.currentTarget.value = "";
  }

  return (
    <section className="panel">
      <h3>PDF Files</h3>
      <label className="file-input">
        <span>Select PDF files</span>
        <input type="file" accept={getPdfAcceptAttribute()} multiple={multiple} disabled={disabled} onChange={handleChange} />
      </label>
      <p className="subtle">{hint}</p>
    </section>
  );
}
