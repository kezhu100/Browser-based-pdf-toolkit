import { Suspense, lazy, useMemo } from "react";
import { useAppStore } from "../../state/useAppStore";
import {
  WORKSPACE_FAMILIES,
  getWorkspaceDefaultToolId,
  getWorkspaceFamilyLabel,
  resolveSelectedWorkspaceToolId,
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

const LazyPdfToolsWorkspace = lazy(async () => {
  const module = await import("../pdf-tools/PdfToolsWorkspace");
  return { default: module.PdfToolsWorkspace };
});

export function ToolWorkspaceRouter() {
  const activeToolId = useAppStore((state) => state.activeToolId);
  const setActiveTool = useAppStore((state) => state.setActiveTool);

  const selectedToolId = useMemo(() => resolveSelectedWorkspaceToolId(activeToolId), [activeToolId]);
  const workspaceFamily = useMemo(() => resolveWorkspaceFamily(selectedToolId), [selectedToolId]);

  const WorkspaceComponent =
    workspaceFamily === "image"
      ? LazyImageToolsWorkspace
      : workspaceFamily === "pdf"
        ? LazyPdfToolsWorkspace
        : LazyContentToolsWorkspace;

  return (
    <>
      <section className="panel">
        <h3>Workspace Mode</h3>
        <div className="tool-list tool-list-inline">
          {WORKSPACE_FAMILIES.map((family) => (
            <button
              key={family}
              type="button"
              className={family === workspaceFamily ? "tool-btn active" : "tool-btn"}
              onClick={() => setActiveTool(getWorkspaceDefaultToolId(family))}
            >
              {getWorkspaceFamilyLabel(family)}
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
