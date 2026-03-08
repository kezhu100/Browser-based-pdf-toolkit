interface EditorPanelProps {
  toolLabel: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function EditorPanel(props: EditorPanelProps) {
  const { toolLabel, value, disabled = false, onChange } = props;

  return (
    <section className="panel">
      <h3>Input</h3>
      <p className="subtle">Current: {toolLabel}</p>
      <textarea
        className="editor"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter content here..."
      />
      <p className="subtle">Characters: {value.length}</p>
    </section>
  );
}
