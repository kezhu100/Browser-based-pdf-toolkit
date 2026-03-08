import { useEffect, useMemo, useState } from "react";
import { createRuntimeServices } from "../../app/runtimeServices";
import { useAppStore } from "../../state/useAppStore";
import { toolRegistryById } from "../../tools/registry";
import { downloadBlob } from "../../utils/download";
import { useDebouncedValue } from "../../utils/useDebouncedValue";
import { EditorPanel } from "./EditorPanel";
import { ExportPanel } from "./ExportPanel";
import { ExportSettingsPanel } from "./ExportSettingsPanel";
import { FileInputPanel } from "./FileInputPanel";
import { PreviewPanel } from "./PreviewPanel";
import { StatusPanel } from "./StatusPanel";
import { ToolSelectionPanel } from "./ToolSelectionPanel";
import { CONTENT_TOOL_IDS, TEMPLATE_BY_TOOL, createSourceDocument, resolveToolIdFromFile } from "./config";
import type { ContentToolId, ContentToolPlugin } from "./types";
import type { StandardDocumentModel } from "../../types/document";
import type { PdfExportOptions } from "../../types/pdf-engine";
import { buildPreviewSignature, getExportDisabledReason, isEditorContentEmpty, normalizeExportOptions } from "./workspace-utils";

function isContentToolPlugin(tool: unknown): tool is ContentToolPlugin {
  if (!tool || typeof tool !== "object") {
    return false;
  }
  const candidate = tool as { id?: string };
  return CONTENT_TOOL_IDS.includes(candidate.id as ContentToolId);
}

export function ContentToolsWorkspace() {
  const activeToolIdInStore = useAppStore((state) => state.activeToolId);
  const setActiveTool = useAppStore((state) => state.setActiveTool);
  const runtimeServices = useMemo(() => createRuntimeServices(), []);

  const initialToolId: ContentToolId = isContentToolPlugin(toolRegistryById["markdown-to-pdf"])
    ? "markdown-to-pdf"
    : "txt-to-pdf";

  const activeToolId: ContentToolId =
    activeToolIdInStore && CONTENT_TOOL_IDS.includes(activeToolIdInStore as ContentToolId)
      ? (activeToolIdInStore as ContentToolId)
      : initialToolId;

  const [editorValue, setEditorValue] = useState<string>(TEMPLATE_BY_TOOL[activeToolId]);
  const debouncedEditorValue = useDebouncedValue(editorValue, 250);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewModel, setPreviewModel] = useState<StandardDocumentModel | null>(null);
  const [previewSignature, setPreviewSignature] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [fileStatus, setFileStatus] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [exportOptions, setExportOptions] = useState<PdfExportOptions>({
    fileName: "preview.pdf",
    pageSize: "A4",
    orientation: "portrait",
    marginMm: 12
  });

  const contentTools: ContentToolPlugin[] = CONTENT_TOOL_IDS.map((id) => toolRegistryById[id]).filter(
    isContentToolPlugin
  );

  if (contentTools.length === 0) {
    return <p>Content tool registry is not configured correctly.</p>;
  }
  const activeTool = contentTools.find((tool) => tool.id === activeToolId) ?? contentTools[0];

  function handleSelectTool(toolId: ContentToolId) {
    setActiveTool(toolId);
    setEditorValue(TEMPLATE_BY_TOOL[toolId]);
    setPreviewHtml("");
    setPreviewModel(null);
    setPreviewSignature(null);
    setFileStatus(null);
    setFileError(null);
    setPreviewError(null);
    setExportError(null);
    setExportSuccess(null);
  }

  async function handleFileSelected(file: File) {
    if (exportLoading) {
      return;
    }

    setFileLoading(true);
    setFileStatus(null);
    setFileError(null);
    setPreviewError(null);
    setExportError(null);
    setExportSuccess(null);

    const matchedToolId = resolveToolIdFromFile(file);
    if (!matchedToolId) {
      setFileError("Unsupported file type. Please upload .md, .txt, or .html.");
      setFileLoading(false);
      return;
    }

    try {
      const content = await file.text();
      if (isEditorContentEmpty(content)) {
        setFileError("The selected file is empty.");
        setFileLoading(false);
        return;
      }

      if (matchedToolId !== activeTool.id) {
        setActiveTool(matchedToolId);
      }
      setEditorValue(content);
      setPreviewHtml("");
      setPreviewModel(null);
      setPreviewSignature(null);
      setFileStatus(`Loaded ${file.name}${matchedToolId !== activeTool.id ? ` and switched to ${matchedToolId}.` : "."}`);
      setFileLoading(false);
    } catch {
      setFileError(`Failed to read ${file.name}.`);
      setFileLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function executePreview() {
      setPreviewLoading(true);
      setPreviewError(null);

      if (isEditorContentEmpty(debouncedEditorValue)) {
        setPreviewLoading(false);
        setPreviewError("Preview requires non-empty content.");
        setPreviewHtml("");
        setPreviewModel(null);
        setPreviewSignature(null);
        return;
      }

      const source = createSourceDocument(activeTool.id, debouncedEditorValue);
      const result = await activeTool.run({
        sourceDocuments: [source],
        settings: {
          generatePdf: false
        },
        exportOptions: {
          ...normalizeExportOptions(exportOptions),
          fileName: "preview.pdf"
        },
        services: runtimeServices
      });

      if (cancelled) {
        return;
      }

      if (!result.ok) {
        setPreviewLoading(false);
        setPreviewError(result.error.message);
        setPreviewHtml("");
        setPreviewModel(null);
        return;
      }

      const artifact = result.data;
      const preview = activeTool.previewAdapter?.(artifact) ?? artifact.previewHtml ?? "";
      setPreviewHtml(preview);
      setPreviewModel(artifact.model ?? null);
      setPreviewSignature(buildPreviewSignature(activeTool.id, debouncedEditorValue, exportOptions));
      setPreviewLoading(false);
    }

    executePreview();
    return () => {
      cancelled = true;
    };
  }, [activeTool, debouncedEditorValue, exportOptions, runtimeServices]);

  async function handleExport() {
    setExportLoading(true);
    setExportError(null);
    setExportSuccess(null);

    if (isEditorContentEmpty(editorValue)) {
      setExportLoading(false);
      setExportError("Cannot export empty content.");
      return;
    }

    const source = createSourceDocument(activeTool.id, editorValue);
    const currentSignature = buildPreviewSignature(activeTool.id, editorValue, exportOptions);
    const canReusePreviewModel = previewModel !== null && previewSignature === currentSignature;

    const result = await activeTool.run({
      sourceDocuments: [source],
      settings: {
        generatePdf: true,
        precomputedModel: canReusePreviewModel ? previewModel : undefined
      },
      exportOptions: {
        ...normalizeExportOptions(exportOptions),
        fileName: `${activeTool.id}-${Date.now()}.pdf`
      },
      services: runtimeServices
    });

    if (!result.ok) {
      setExportLoading(false);
      setExportError(result.error.message);
      return;
    }

    const artifact = result.data;
    const preview = activeTool.previewAdapter?.(artifact) ?? artifact.previewHtml ?? "";
    setPreviewHtml(preview);
    setPreviewModel(artifact.model ?? previewModel);

    const output = artifact.output;
    if (output && !Array.isArray(output)) {
      downloadBlob(output.blob, output.fileName);
      setExportSuccess(`PDF generated: ${output.fileName}`);
    } else {
      setExportSuccess("Export completed.");
    }

    setExportLoading(false);
  }

  return (
    <>
      <StatusPanel
        fileLoading={fileLoading}
        fileStatus={fileStatus}
        fileError={fileError}
        previewLoading={previewLoading}
        previewError={previewError}
        exportLoading={exportLoading}
        exportError={exportError}
        exportSuccess={exportSuccess}
      />
      <div className="workspace-grid">
        <div className="workspace-left">
          <ToolSelectionPanel tools={contentTools} activeToolId={activeTool.id} onChange={handleSelectTool} />
          <FileInputPanel disabled={exportLoading} onFileSelected={handleFileSelected} />
          <ExportSettingsPanel options={exportOptions} onChange={setExportOptions} />
          <EditorPanel toolLabel={activeTool.name} value={editorValue} disabled={exportLoading} onChange={setEditorValue} />
          <ExportPanel
            isLoading={exportLoading}
            disabledReason={getExportDisabledReason({
              content: editorValue,
              previewLoading,
              previewError,
              exportLoading
            })}
            onExport={handleExport}
          />
        </div>
        <PreviewPanel html={previewHtml} exportOptions={exportOptions} />
      </div>
    </>
  );
}
