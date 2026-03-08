import { create } from "zustand";
import type { ToolId } from "../types/tool";

interface AppState {
  activeToolId: ToolId | null;
  setActiveTool: (toolId: ToolId) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeToolId: null,
  setActiveTool: (toolId) => set({ activeToolId: toolId })
}));

