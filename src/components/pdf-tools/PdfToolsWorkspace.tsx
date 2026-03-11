import { useEffect, useMemo, useState } from "react";
import { createRuntimeServices } from "../../app/runtimeServices";
import { useAppStore } from "../../state/useAppStore";
import { toolRegistryById } from "../../tools/registry";
import { downloadBlob } from "../../utils/download";
import { ExportPanel } from "../content-tools/ExportPanel";
import { StatusPanel } from "../content-tools/StatusPanel";
import { PDF_TOOL_IDS, getPdfExportFileName, getPdfFileInputHint, getUnsupportedPdfFiles, toPdfFileItems } from "./config";
import { PdfFileInputPanel } from "./PdfFileInputPanel";
import { PdfFileListPanel } from "./PdfFileListPanel";
import { PdfPreviewPanel } from "./PdfPreviewPanel";
import { PdfToolSettingsPanel } from "./PdfToolSettingsPanel";
import { PdfToolSelectionPanel } from "./PdfToolSelectionPanel";
import type { PdfFileItem, PdfToolId, PdfToolPlugin } from "./types";
import { getPdfExportDisabledReason } from "./workspace-utils";

function isPdfToolPlugin(tool: unknown): tool is PdfToolPlugin {
  if (!tool || typeof tool !== "object") {
    return false;
  }

  const candidate = tool as { id?: string };
  return PDF_TOOL_IDS.includes(candidate.id as PdfToolId);
}

export function PdfToolsWorkspace() {
  const activeToolIdInStore = useAppStore((state) => state.activeToolId);
  const setActiveTool = useAppStore((state) => state.setActiveTool);
  const runtimeServices = useMemo(() => createRuntimeServices(), []);

  const pdfTools: PdfToolPlugin[] = PDF_TOOL_IDS.map((id) => toolRegistryById[id]).filter(isPdfToolPlugin);
  const activeToolId: PdfToolId =
    activeToolIdInStore && PDF_TOOL_IDS.includes(activeToolIdInStore as PdfToolId)
      ? (activeToolIdInStore as PdfToolId)
      : "merge-pdf";

  const activeTool = pdfTools.find((tool) => tool.id === activeToolId) ?? pdfTools[0];

  const [pdfItems, setPdfItems] = useState<PdfFileItem[]>([]);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [fileStatus, setFileStatus] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [rotateDegrees, setRotateDegrees] = useState<90 | 180 | 270>(90);

  useEffect(() => {
    if (activeToolIdInStore !== activeToolId) {
      setActiveTool(activeToolId);
    }
  }, [activeToolId, activeToolIdInStore, setActiveTool]);

  useEffect(() => {
    let cancelled = false;

    async function executePreview() {
      setPreviewLoading(true);
      setPreviewError(null);

      if (pdfItems.length === 0) {
        setPreviewHtml("");
        setPreviewLoading(false);
        return;
      }

      const result = await activeTool.run({
        sourceDocuments: pdfItems.map((item) => item.sourceDocument),
        settings: buildPdfToolSettings(activeTool.id, false, rotateDegrees),
        exportOptions: {
          fileName: getPdfExportFileName(activeTool.id),
          pageSize: "A4",
          orientation: "portrait",
          marginMm: 12
        },
        services: runtimeServices
      });

      if (cancelled) {
        return;
      }

      if (!result.ok) {
        setPreviewError(result.error.message);
        setPreviewHtml("");
        setPreviewLoading(false);
        return;
      }

      const artifact = result.data;
      const preview = activeTool.previewAdapter?.(artifact) ?? artifact.previewHtml ?? "";
      setPreviewHtml(preview);
      setPreviewLoading(false);
    }

    executePreview();

    return () => {
      cancelled = true;
    };
  }, [activeTool, pdfItems, rotateDegrees, runtimeServices]);

  if (pdfTools.length === 0) {
    return <p>PDF tool registry is not configured correctly.</p>;
  }

  async function handleFilesSelected(files: File[]) {
    if (exportLoading) {
      return;
    }

    setFileLoading(true);
    setFileStatus(null);
    setFileError(null);
    setPreviewError(null);
    setExportError(null);
    setExportSuccess(null);

    if (files.length === 0) {
      setFileLoading(false);
      return;
    }

    const unsupported = getUnsupportedPdfFiles(files);
    if (unsupported.length > 0) {
      setFileError(`Unsupported file type: ${unsupported.map((file) => file.name).join(", ")}. Please use PDF files only.`);
      setFileLoading(false);
      return;
    }

    try {
      const nextItems = await toPdfFileItems(files);
      setPdfItems(nextItems);
      setFileStatus(`Loaded ${nextItems.length} PDF file${nextItems.length > 1 ? "s" : ""}.`);
      setFileLoading(false);
    } catch {
      setFileError("Failed to read selected PDF files.");
      setFileLoading(false);
    }
  }

  function handleSelectTool(toolId: PdfToolId) {
    setActiveTool(toolId);
    setPreviewHtml("");
    setPreviewError(null);
    setExportError(null);
    setExportSuccess(null);
  }

  async function handleExport() {
    setExportLoading(true);
    setExportError(null);
    setExportSuccess(null);

    const result = await activeTool.run({
      sourceDocuments: pdfItems.map((item) => item.sourceDocument),
      settings: buildPdfToolSettings(activeTool.id, true, rotateDegrees),
      exportOptions: {
        fileName: getPdfExportFileName(activeTool.id),
        pageSize: "A4",
        orientation: "portrait",
        marginMm: 12
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

    const output = artifact.output;
    if (output && Array.isArray(output)) {
      output.forEach((file) => downloadBlob(file.blob, file.fileName));
      setExportSuccess(`Generated ${output.length} PDF file${output.length > 1 ? "s" : ""}.`);
    } else if (output) {
      downloadBlob(output.blob, output.fileName);
      setExportSuccess(`PDF generated: ${output.fileName}`);
    } else {
      setExportSuccess("PDF operation completed.");
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
          <PdfToolSelectionPanel tools={pdfTools} activeToolId={activeTool.id} onChange={handleSelectTool} />
          <PdfFileInputPanel
            disabled={exportLoading}
            hint={getPdfFileInputHint(activeTool.id)}
            multiple={activeTool.id === "merge-pdf"}
            onFilesSelected={handleFilesSelected}
          />
          <PdfFileListPanel items={pdfItems} />
          <PdfToolSettingsPanel
            toolId={activeTool.id}
            rotateDegrees={rotateDegrees}
            onRotateDegreesChange={setRotateDegrees}
          />
          <ExportPanel
            isLoading={exportLoading}
            disabledReason={getPdfExportDisabledReason({
              toolId: activeTool.id,
              files: pdfItems,
              previewLoading,
              previewError,
              exportLoading
            })}
            onExport={handleExport}
          />
        </div>
        <PdfPreviewPanel html={previewHtml} />
      </div>
    </>
  );
}

function buildPdfToolSettings(toolId: PdfToolId, generatePdf: boolean, rotateDegrees: 90 | 180 | 270) {
  if (toolId === "rotate-pdf") {
    return {
      generatePdf,
      degrees: rotateDegrees
    };
  }

  return {
    generatePdf
  };
}
