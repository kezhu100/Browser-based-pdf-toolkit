import { useEffect, useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
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
  const [pageNumberStart, setPageNumberStart] = useState<number>(1);
  const [pageNumberPosition, setPageNumberPosition] = useState<"bottom-center" | "bottom-right" | "top-center" | "top-right">(
    "bottom-center"
  );
  const [pageNumberFontSize, setPageNumberFontSize] = useState<number>(12);
  const [pageNumberMargin, setPageNumberMargin] = useState<number>(24);
  const [pageNumberPrefix, setPageNumberPrefix] = useState<string>("Page ");
  const [reorderPageCount, setReorderPageCount] = useState<number | null>(null);
  const [reorderPageOrder, setReorderPageOrder] = useState<number[]>([]);
  const [reorderLoading, setReorderLoading] = useState<boolean>(false);
  const [reorderError, setReorderError] = useState<string | null>(null);

  useEffect(() => {
    if (activeToolIdInStore !== activeToolId) {
      setActiveTool(activeToolId);
    }
  }, [activeToolId, activeToolIdInStore, setActiveTool]);

  useEffect(() => {
    let cancelled = false;

    async function analyzeReorderFile() {
      if (activeTool.id !== "reorder-pdf" || pdfItems.length !== 1) {
        setReorderLoading(false);
        setReorderError(null);
        setReorderPageCount(null);
        setReorderPageOrder([]);
        return;
      }

      const content = pdfItems[0].sourceDocument.content;
      const bytes = toUint8Array(content);

      setReorderLoading(true);
      setReorderError(null);

      try {
        const document = await PDFDocument.load(bytes);
        const pageCount = document.getPageCount();

        if (cancelled) {
          return;
        }

        setReorderPageCount(pageCount);
        setReorderPageOrder((current) => {
          const nextDefaultOrder = createSequentialPageOrder(pageCount);
          return isValidReorderState(current, pageCount) ? current : nextDefaultOrder;
        });
        setReorderLoading(false);
      } catch {
        if (cancelled) {
          return;
        }

        setReorderPageCount(null);
        setReorderPageOrder([]);
        setReorderError("Failed to read pages from the selected PDF.");
        setReorderLoading(false);
      }
    }

    analyzeReorderFile();

    return () => {
      cancelled = true;
    };
  }, [activeTool.id, pdfItems]);

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

      if (activeTool.id === "reorder-pdf") {
        if (reorderLoading) {
          setPreviewLoading(false);
          return;
        }

        if (reorderError) {
          setPreviewError(reorderError);
          setPreviewHtml("");
          setPreviewLoading(false);
          return;
        }

        if (reorderPageCount === null) {
          setPreviewHtml("");
          setPreviewLoading(false);
          return;
        }
      }

      const result = await activeTool.run({
        sourceDocuments: pdfItems.map((item) => item.sourceDocument),
        settings: buildPdfToolSettings(
          activeTool.id,
          false,
          rotateDegrees,
          reorderPageOrder,
          pageNumberStart,
          pageNumberPosition,
          pageNumberFontSize,
          pageNumberMargin,
          pageNumberPrefix
        ),
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
  }, [
    activeTool,
    pdfItems,
    reorderError,
    reorderLoading,
    reorderPageCount,
    reorderPageOrder,
    rotateDegrees,
    pageNumberStart,
    pageNumberPosition,
    pageNumberFontSize,
    pageNumberMargin,
    pageNumberPrefix,
    runtimeServices
  ]);

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
    const nextItems =
      toolId === "merge-pdf" || pdfItems.length <= 1
        ? pdfItems
        : [pdfItems[0]];

    setActiveTool(toolId);
    setPdfItems(nextItems);
    setPreviewHtml("");
    setPreviewError(null);
    setExportError(null);
    setExportSuccess(null);
    setFileError(null);
    setFileStatus(
      toolId !== "merge-pdf" && pdfItems.length > 1
        ? `Kept the first PDF file for ${
            toolId === "split-pdf"
              ? "split"
              : toolId === "reorder-pdf"
                ? "reorder"
                : toolId === "page-numbers-pdf"
                  ? "page numbers"
                  : "rotate"
          }.`
        : null
    );
  }

  async function handleExport() {
    setExportLoading(true);
    setExportError(null);
    setExportSuccess(null);

    const result = await activeTool.run({
      sourceDocuments: pdfItems.map((item) => item.sourceDocument),
      settings: buildPdfToolSettings(
        activeTool.id,
        true,
        rotateDegrees,
        reorderPageOrder,
        pageNumberStart,
        pageNumberPosition,
        pageNumberFontSize,
        pageNumberMargin,
        pageNumberPrefix
      ),
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
            pageNumberStart={pageNumberStart}
            pageNumberPosition={pageNumberPosition}
            pageNumberFontSize={pageNumberFontSize}
            pageNumberMargin={pageNumberMargin}
            pageNumberPrefix={pageNumberPrefix}
            reorderPageCount={reorderPageCount}
            reorderPageOrder={reorderPageOrder}
            reorderLoading={reorderLoading}
            reorderError={reorderError}
            onRotateDegreesChange={setRotateDegrees}
            onPageNumberStartChange={(value) => setPageNumberStart(normalizeInteger(value, 1, 1, 999999))}
            onPageNumberPositionChange={setPageNumberPosition}
            onPageNumberFontSizeChange={(value) => setPageNumberFontSize(normalizeInteger(value, 12, 6, 72))}
            onPageNumberMarginChange={(value) => setPageNumberMargin(normalizeInteger(value, 24, 0, 200))}
            onPageNumberPrefixChange={(value) => setPageNumberPrefix(value.slice(0, 40))}
            onMoveReorderPage={handleMoveReorderPage}
            onRemoveReorderPage={handleRemoveReorderPage}
            onRestoreReorderPage={handleRestoreReorderPage}
            onResetReorderPages={handleResetReorderPages}
          />
          <ExportPanel
            isLoading={exportLoading}
            disabledReason={getPdfExportDisabledReason({
              toolId: activeTool.id,
              files: pdfItems,
              reorderPageOrder,
              reorderReady: activeTool.id !== "reorder-pdf" || (!!reorderPageCount && !reorderLoading && !reorderError),
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

  function handleMoveReorderPage(position: number, direction: "up" | "down") {
    setReorderPageOrder((current) => {
      const target = direction === "up" ? position - 1 : position + 1;
      if (position < 0 || position >= current.length || target < 0 || target >= current.length) {
        return current;
      }

      const next = [...current];
      [next[position], next[target]] = [next[target], next[position]];
      return next;
    });
  }

  function handleRemoveReorderPage(pageIndex: number) {
    setReorderPageOrder((current) => current.filter((value) => value !== pageIndex));
  }

  function handleRestoreReorderPage(pageIndex: number) {
    setReorderPageOrder((current) => {
      if (current.includes(pageIndex)) {
        return current;
      }

      return [...current, pageIndex].sort((left, right) => left - right);
    });
  }

  function handleResetReorderPages() {
    if (reorderPageCount === null) {
      return;
    }

    setReorderPageOrder(createSequentialPageOrder(reorderPageCount));
  }
}

function buildPdfToolSettings(
  toolId: PdfToolId,
  generatePdf: boolean,
  rotateDegrees: 90 | 180 | 270,
  reorderPageOrder: number[],
  pageNumberStart: number,
  pageNumberPosition: "bottom-center" | "bottom-right" | "top-center" | "top-right",
  pageNumberFontSize: number,
  pageNumberMargin: number,
  pageNumberPrefix: string
) {
  if (toolId === "reorder-pdf") {
    return {
      generatePdf,
      pageOrder: reorderPageOrder
    };
  }

  if (toolId === "rotate-pdf") {
    return {
      generatePdf,
      degrees: rotateDegrees
    };
  }

  if (toolId === "page-numbers-pdf") {
    return {
      generatePdf,
      startNumber: pageNumberStart,
      position: pageNumberPosition,
      fontSize: pageNumberFontSize,
      margin: pageNumberMargin,
      prefix: pageNumberPrefix
    };
  }

  return {
    generatePdf
  };
}

function createSequentialPageOrder(pageCount: number): number[] {
  return Array.from({ length: pageCount }, (_, index) => index);
}

function isValidReorderState(pageOrder: number[], pageCount: number): boolean {
  if (pageOrder.length === 0) {
    return false;
  }

  const seen = new Set<number>();
  for (const pageIndex of pageOrder) {
    if (pageIndex < 0 || pageIndex >= pageCount || seen.has(pageIndex)) {
      return false;
    }
    seen.add(pageIndex);
  }

  return true;
}

function toUint8Array(content: string | ArrayBuffer | Uint8Array): Uint8Array {
  if (content instanceof Uint8Array) {
    return content;
  }
  if (content instanceof ArrayBuffer) {
    return new Uint8Array(content);
  }

  return new TextEncoder().encode(content);
}

function normalizeInteger(value: number, fallback: number, min: number, max: number): number {
  const next = Number.isFinite(value) ? Math.trunc(value) : fallback;
  return Math.min(max, Math.max(min, next));
}
