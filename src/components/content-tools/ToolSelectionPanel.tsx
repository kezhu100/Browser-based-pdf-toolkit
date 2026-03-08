import type { ContentToolId, ContentToolPlugin } from "./types";

interface ToolSelectionPanelProps {
  tools: ContentToolPlugin[];
  activeToolId: ContentToolId;
  onChange: (toolId: ContentToolId) => void;
}

export function ToolSelectionPanel(props: ToolSelectionPanelProps) {
  const { tools, activeToolId, onChange } = props;

  return (
    <section className="panel">
      <h3>Tool</h3>
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

