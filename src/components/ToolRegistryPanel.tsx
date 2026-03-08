import { toolRegistry } from "../tools/registry";

export function ToolRegistryPanel() {
  return (
    <ul>
      {toolRegistry.map((tool) => (
        <li key={tool.id}>
          <strong>{tool.name}</strong> ({tool.category})
        </li>
      ))}
    </ul>
  );
}

