import { Suspense, lazy, useMemo } from "react";
import { useAppStore } from "../../state/useAppStore";
import {
  CONVERSION_TOOL_IDS,
  getWorkspaceToolLabel,
  resolveSelectedConversionToolId,
  resolveWorkspaceFamily
} from "./config";

const LazyContentToolsWorkspace = lazy(async () => {
  const module = await import("../content-tools/ContentToolsWorkspace");
  return { default: module.ContentToolsWorkspace };
});

const LazyImageToolsWorkspace = lazy(async () => {
  const module = await import("../image-tools/ImageToolsWorkspace");
  return { default: module.ImageToolsWorkspace };
});

export function ToolWorkspaceRouter() {
  const activeToolId = useAppStore((state) => state.activeToolId);
  const setActiveTool = useAppStore((state) => state.setActiveTool);

  const selectedToolId = useMemo(() => resolveSelectedConversionToolId(activeToolId), [activeToolId]);
  const workspaceFamily = useMemo(() => resolveWorkspaceFamily(selectedToolId), [selectedToolId]);

  const WorkspaceComponent = workspaceFamily === "image" ? LazyImageToolsWorkspace : LazyContentToolsWorkspace;

  return (
    <>
      <section className="panel">
        <h3>Workspace Mode</h3>
        <div className="tool-list tool-list-inline">
          {CONVERSION_TOOL_IDS.map((toolId) => (
            <button
              key={toolId}
              type="button"
              className={toolId === selectedToolId ? "tool-btn active" : "tool-btn"}
              onClick={() => setActiveTool(toolId)}
            >
              {getWorkspaceToolLabel(toolId)}
            </button>
          ))}
        </div>
      </section>

      <Suspense
        fallback={
          <section className="panel">
            <p>Loading workspace...</p>
          </section>
        }
      >
        <WorkspaceComponent />
      </Suspense>
    </>
  );
}
