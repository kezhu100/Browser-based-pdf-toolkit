# Browser-based PDF Toolkit — Project Context

## 1. Project Overview

Browser-based PDF Toolkit 是一个 **完全浏览器本地运行的 PDF 工具网站**。

核心特点：

* 所有处理 **在浏览器本地完成**
* **无服务器 / 无文件上传**
* **零运行成本**
* 支持常见文档格式转 PDF
* 采用 **插件式架构**

技术栈：

* React
* Vite
* TypeScript
* html2pdf.js
* html2canvas
* jsPDF

项目目标：

构建一个 **隐私友好 + 零成本 + 浏览器工具箱式 PDF Toolkit**。

---

# 2. Current Implemented Features

目前已经实现：

### Content → PDF

支持：

* Markdown → PDF
* TXT → PDF
* HTML → PDF

核心能力：

* 实时 Preview
* 本地文件上传
* 导出 PDF
* PDF 页面设置

可调参数：

* Page Size (A4 / Letter)
* Orientation (Portrait / Landscape)
* Margin (mm)

---

# 3. Project Architecture

项目采用 **Plugin-based architecture**。

整体流程：

```
User Input
     │
     ▼
Tool Plugin
     │
     ▼
Pipeline
     │
     ▼
Preview Engine
     │
     ▼
PDF Engine
     │
     ▼
Browser Download
```

---

# 4. Directory Structure

```
src/
  app/
    AppShell.tsx

  components/
    content-tools/
      ContentToolsWorkspace.tsx
      EditorPanel.tsx
      PreviewPanel.tsx
      FileInputPanel.tsx
      ExportPanel.tsx
      ExportSettingsPanel.tsx
      StatusPanel.tsx

  pipeline/
    interfaces.ts

  preview-engine/
    interfaces.ts

  pdf-engine/
    adapters/
      contentPdfGenerator.ts

  tools/
    plugins/
      markdownToPdfTool.ts
      txtToPdfTool.ts
      htmlToPdfTool.ts
      contentToolRunner.ts

    registry.ts

  styles/
    global.css
```

---

# 5. Plugin Architecture

每个工具是一个 **ToolPlugin**：

```ts
ToolPlugin {
  id
  name
  description
  run()
  previewAdapter()
}
```

目前实现：

```
markdown-to-pdf
txt-to-pdf
html-to-pdf
```

工具执行流程：

```
tool.run()
  ↓
pipeline.run()
  ↓
previewEngine.render()
  ↓
pdfEngine.generateFromModel()
```

---

# 6. Major Problems Encountered & Fixes

## Problem 1 — PDF 导出空白

现象：

* Preview 正常
* 下载 PDF 空白

原因：

html2canvas 在 **极端 off-screen DOM 节点**（如 left:-100000px）时无法正确渲染。

解决：

使用 **renderable hidden host**：

```
position: fixed
pointer-events: none
z-index: -1
```

并等待 layout：

```
requestAnimationFrame
```

---

## Problem 2 — 大 Margin 内容被裁剪

现象：

* Margin 较大时
* Preview 或 PDF 内容被裁剪

原因：

旧实现：

```
host height = 1px
overflow hidden
```

解决：

引入 **Page Box + Content Box 模型**

```
pageBox
   padding = margin

contentBox
   width = pageWidth - 2*margin
```

---

## Problem 3 — Preview 与 PDF 导出不一致

现象：

* Preview 居中
* PDF 内容贴左

原因：

导出只截取：

```
mount (content)
```

而不是：

```
pageBox
```

解决：

```
html2pdf().from(pageBox)
```

---

## Problem 4 — TypeScript build error

现象：

```
activeTool possibly undefined
ToolId not assignable to ContentToolId
```

解决：

* 使用 `contentTools.find()` 获取 tool
* narrowing tool type
* ContentToolRunSettings extends Record<string, unknown>

---

# 7. Testing

手动测试文档：

```
TESTING.md
```

测试内容：

* Markdown → PDF
* TXT → PDF
* HTML → PDF
* Margin extremes
* Orientation changes
* File upload
* Long content
* Export correctness

---

# 8. Codex Prompt Strategy

开发过程中使用 **结构化提示词**驱动 Codex：

提示词格式：

```
Follow docs/architecture.md and AGENTS.md strictly.

Problem:
<describe bug>

Constraints:
- frontend only
- no backend
- keep plugin architecture
- keep pipeline flow

Tasks:
1. identify root cause
2. implement fix

Output:
1. root cause summary
2. updated file tree
3. full code
4. explanation
5. verification steps
```

---

# 9. Development Phases

当前完成：

```
Phase 1 — Project skeleton
Phase 2 — Types and contracts
Phase 3 — First pipeline flow
Phase 4 — Basic UI
Phase 5 — Preview/export separation
Phase 6 — File input + debounce
Phase 7 — UI polish
Phase 8 — Validation + stability
```

---

# 10. Next Development Roadmap

## Phase 9

新增：

```
Image → PDF
```

支持：

* PNG
* JPG
* WebP

---

## Phase 10

PDF manipulation：

```
PDF Merge
PDF Split
```

---

## Phase 11

PDF editing：

```
Page reorder
Page delete
```

---

## Phase 12

Document enhancement：

```
Watermark
Page number
```

---

## Phase 13

Advanced tools：

```
Compress PDF
Rotate pages
Extract pages
```

---

# 11. Future Architecture Rules

保持：

```
Plugin architecture
pipeline → preview → pdf engine
frontend-only processing
```

禁止：

```
server upload
backend dependency
```

---

# 12. Deployment Plan

未来部署：

```
GitHub Pages
Vercel
Cloudflare Pages
```

目标：

```
完全免费部署
```

---
