import { useEffect, useMemo, useRef, useState } from "react";
import { createRuntimeServices } from "../../app/runtimeServices";
import { useAppStore } from "../../state/useAppStore";
import { toolRegistryById } from "../../tools/registry";
import { downloadBlob } from "../../utils/download";
import { ExportPanel } from "../content-tools/ExportPanel";
import { ExportSettingsPanel } from "../content-tools/ExportSettingsPanel";
import { PreviewPanel } from "../content-tools/PreviewPanel";
import { StatusPanel } from "../content-tools/StatusPanel";
import {
  buildImagePreviewSignature,
  getImageExportDisabledReason,
  getUnsupportedImageFiles,
  revokeImageFileItems,
  toImageFileItems
} from "./config";
import { ImageFileInputPanel } from "./ImageFileInputPanel";
import { ImageFileListPanel } from "./ImageFileListPanel";
import type { ImageFileItem, ImageToolPlugin } from "./types";
import type { StandardDocumentModel } from "../../types/document";
import type { PdfExportOptions } from "../../types/pdf-engine";

function isImageToolPlugin(tool: unknown): tool is ImageToolPlugin {
  if (!tool || typeof tool !== "object") {
    return false;
  }
  const candidate = tool as { id?: string };
  return candidate.id === "image-to-pdf";
}

export function ImageToolsWorkspace() {
  const setActiveTool = useAppStore((state) => state.setActiveTool);
  const runtimeServices = useMemo(() => createRuntimeServices(), []);

  const imageToolCandidate = toolRegistryById["image-to-pdf"];
  if (!isImageToolPlugin(imageToolCandidate)) {
    return <p>Image tool registry is not configured correctly.</p>;
  }
  const imageTool: ImageToolPlugin = imageToolCandidate;

  const [imageItems, setImageItems] = useState<ImageFileItem[]>([]);
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
  const imageItemsRef = useRef<ImageFileItem[]>([]);
  const [exportOptions, setExportOptions] = useState<PdfExportOptions>({
    fileName: "images.pdf",
    pageSize: "A4",
    orientation: "portrait",
    marginMm: 12
  });

  useEffect(() => {
    setActiveTool("image-to-pdf");
  }, [setActiveTool]);

  useEffect(() => {
    imageItemsRef.current = imageItems;
  }, [imageItems]);

  useEffect(() => {
    return () => {
      revokeImageFileItems(imageItemsRef.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function executePreview() {
      setPreviewLoading(true);
      setPreviewError(null);

      if (imageItems.length === 0) {
        setPreviewLoading(false);
        setPreviewHtml("");
        setPreviewModel(null);
        setPreviewSignature(null);
        return;
      }

      const result = await imageTool.run({
        sourceDocuments: imageItems.map((item) => item.sourceDocument),
        settings: {
          generatePdf: false
        },
        exportOptions: {
          ...exportOptions,
          fileName: "image-preview.pdf"
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
        setPreviewSignature(null);
        return;
      }

      const artifact = result.data;
      const preview = imageTool.previewAdapter?.(artifact) ?? artifact.previewHtml ?? "";
      setPreviewHtml(preview);
      setPreviewModel(artifact.model ?? null);
      setPreviewSignature(buildImagePreviewSignature(imageTool.id, imageItems, exportOptions));
      setPreviewLoading(false);
    }

    executePreview();

    return () => {
      cancelled = true;
    };
  }, [exportOptions, imageItems, imageTool, runtimeServices]);

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

    const unsupported = getUnsupportedImageFiles(files);
    if (unsupported.length > 0) {
      setFileError(`Unsupported file type: ${unsupported.map((file) => file.name).join(", ")}. Please use PNG/JPG/JPEG/WEBP only.`);
      setFileLoading(false);
      return;
    }

    const nextItems = toImageFileItems(files);

    setImageItems((previous) => {
      revokeImageFileItems(previous);
      return nextItems;
    });

    setFileStatus(`Loaded ${nextItems.length} image file${nextItems.length > 1 ? "s" : ""}.`);
    setFileLoading(false);
  }

  async function handleExport() {
    setExportLoading(true);
    setExportError(null);
    setExportSuccess(null);

    if (imageItems.length === 0) {
      setExportLoading(false);
      setExportError("Cannot export without image files.");
      return;
    }

    const currentSignature = buildImagePreviewSignature(imageTool.id, imageItems, exportOptions);
    const canReusePreviewModel = previewModel !== null && previewSignature === currentSignature;

    const result = await imageTool.run({
      sourceDocuments: imageItems.map((item) => item.sourceDocument),
      settings: {
        generatePdf: true,
        precomputedModel: canReusePreviewModel ? previewModel : undefined
      },
      exportOptions: {
        ...exportOptions,
        fileName: `image-to-pdf-${Date.now()}.pdf`
      },
      services: runtimeServices
    });

    if (!result.ok) {
      setExportLoading(false);
      setExportError(result.error.message);
      return;
    }

    const artifact = result.data;
    const preview = imageTool.previewAdapter?.(artifact) ?? artifact.previewHtml ?? "";
    setPreviewHtml(preview);
    setPreviewModel(artifact.model ?? previewModel);
    setPreviewSignature(currentSignature);

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
          <ImageFileInputPanel disabled={exportLoading} onFilesSelected={handleFilesSelected} />
          <ImageFileListPanel items={imageItems} />
          <ExportSettingsPanel options={exportOptions} onChange={setExportOptions} />
          <ExportPanel
            isLoading={exportLoading}
            disabledReason={getImageExportDisabledReason({
              imageItems,
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
