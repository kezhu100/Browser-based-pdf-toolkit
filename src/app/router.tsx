import { createHashRouter } from "react-router-dom";
import { AppShell } from "./AppShell";
import { HomePage } from "./pages/HomePage";
import { ToolsPage } from "./pages/ToolsPage";

export const appRouter = createHashRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "tools", element: <ToolsPage /> }
    ]
  }
]);
