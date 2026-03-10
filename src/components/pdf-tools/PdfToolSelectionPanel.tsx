import type { PdfToolId, PdfToolPlugin } from "./types";

interface PdfToolSelectionPanelProps {
  tools: PdfToolPlugin[];
  activeToolId: PdfToolId;
  onChange: (toolId: PdfToolId) => void;
}

export function PdfToolSelectionPanel(props: PdfToolSelectionPanelProps) {
  const { tools, activeToolId, onChange } = props;

  return (
    <section className="panel">
      <h3>PDF Tool</h3>
      <div className="tool-list">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={tool.id === activeToolId ? "tool-btn active" : "tool-btn"}
            onClick={() => onChange(tool.id)}
          >
            {tool.name}
          </button>
        ))}
      </div>
    </section>
  );
}
