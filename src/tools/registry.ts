import type { AnyToolPlugin, ToolId } from "../types/tool";
import { cropPdfTool } from "./plugins/cropPdfTool";
import { htmlToPdfTool } from "./plugins/htmlToPdfTool";
import { imageToPdfTool } from "./plugins/imageToPdfTool";
import { markdownToPdfTool } from "./plugins/markdownToPdfTool";
import { mergePdfTool } from "./plugins/mergePdfTool";
import { pageNumbersPdfTool } from "./plugins/pageNumbersPdfTool";
import { reorderPdfTool } from "./plugins/reorderPdfTool";
import { rotatePdfTool } from "./plugins/rotatePdfTool";
import { splitPdfTool } from "./plugins/splitPdfTool";
import { txtToPdfTool } from "./plugins/txtToPdfTool";
import { watermarkPdfTool } from "./plugins/watermarkPdfTool";

export const toolRegistry: ReadonlyArray<AnyToolPlugin> = [
  markdownToPdfTool,
  txtToPdfTool,
  htmlToPdfTool,
  imageToPdfTool,
  mergePdfTool,
  splitPdfTool,
  reorderPdfTool,
  watermarkPdfTool,
  pageNumbersPdfTool,
  rotatePdfTool,
  cropPdfTool
];

export const toolRegistryById = toolRegistry.reduce<Partial<Record<ToolId, AnyToolPlugin>>>(
  (acc, tool) => {
    acc[tool.id] = tool;
    return acc;
  },
  {}
);
