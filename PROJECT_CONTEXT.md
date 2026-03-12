# Browser-based PDF Toolkit - Project Context

This file is the primary context for AI assistants working on this repository.

AI agents should also read:

- `AGENTS.md`
- `docs/architecture.md`
- `docs/implemented-phases.md`
- `docs/codex_prompt_chain.md`

## 1. Project Overview

Browser-based PDF Toolkit is a browser-only PDF toolkit website.

Core goals:

- no server upload
- no backend services
- all processing runs locally in the browser
- privacy-friendly behavior
- static hosting with zero operational backend cost

Live demo:

- https://kezhu100.github.io/Browser-based-pdf-toolkit/#/

Deployment target:

- GitHub Pages

## 2. Tech Stack

Frontend stack:

- React
- TypeScript
- Vite
- React Router
- html2canvas / html2pdf.js
- pdf-lib

Deployment:

- GitHub Pages
- GitHub Actions

Local development:

- Node.js
- npm
- Vite dev server

## 3. Project Architecture

The project uses a Tool Plugin Architecture.

Main structure:

```text
src/
  app/
  components/
    content-tools/
    image-tools/
    pdf-tools/
    workspaces/
  pdf-engine/
    adapters/
  pipeline/
  preview-engine/
  tools/
    plugins/
    registry.ts
  state/
  types/
  utils/
```

Primary flows:

Content/image conversion flow:

```text
Input Document
  -> Document Pipeline
  -> Standard Document Model
  -> Preview Engine
  -> PDF Engine
  -> Browser Download
```

PDF manipulation flow:

```text
PDF Source Files
  -> ToolPlugin.run()
  -> UnifiedPdfEngine manipulation method
  -> Browser Download
```

Important rule:

- content and image tools use the existing `DocumentPipeline`
- PDF manipulation tools extend the `pdf-engine` path instead of forcing PDF binaries into `DocumentPipeline`

## 4. Tool Plugin System

Each tool is a `ToolPlugin`.

Current implemented examples:

- `markdown-to-pdf`
- `txt-to-pdf`
- `html-to-pdf`
- `image-to-pdf`
- `merge-pdf`
- `split-pdf`
- `reorder-pdf`
- `rotate-pdf`

Tool registry:

- `src/tools/registry.ts`

Tool execution pattern:

```text
ToolPlugin.run()
  -> runtime services
  -> preview and/or PDF engine work
  -> artifact/output for browser download
```

## 5. Current Implemented Features

Implemented:

- Content -> PDF
  - Markdown -> PDF
  - TXT -> PDF
  - HTML -> PDF
- Image -> PDF
  - PNG
  - JPG
  - JPEG
  - WEBP
- PDF tools workspace
  - Merge PDF
  - Split PDF
  - Reorder PDF pages
  - Add Page Numbers
  - Rotate PDF

Current UI/workspace behavior:

- content workspace
- image workspace
- pdf workspace
- auto preview
- explicit export/apply action
- local file input
- browser download

Important limitation:

- `merge-pdf`, `split-pdf`, `reorder-pdf`, `page-numbers-pdf`, and `rotate-pdf` are implemented
- `watermark-pdf` and `crop-pdf` remain unimplemented placeholders

## 6. Deployment Architecture

Site deployment:

- GitHub Pages

Routing strategy:

- `HashRouter`

Example:

- `#/tools`

Reason:

- GitHub Pages is static hosting
- `BrowserRouter` would require server fallback handling
- `HashRouter` is compatible with static deployment

## 7. Build and Deployment

Local development:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Auto deployment:

```text
git push
  -> GitHub Actions
  -> npm install
  -> npm run build
  -> deploy to GitHub Pages
```

Workflow:

- `.github/workflows/deploy-pages.yml`

## 8. Key Problems Encountered

Problem 1:

- TypeScript build errors from plugin generic typing and registry typing

Resolution:

- introduced `AnyToolPlugin`
- narrowed tool-specific plugin types where needed

Problem 2:

- Vite build succeeded but GitHub Pages failed

Resolution:

- fixed Vite base path
- corrected repo-name path usage

Problem 3:

- React Router 404 on GitHub Pages

Resolution:

- switched to `HashRouter`

Problem 4:

- blank page after deploy due to asset path mismatch

Resolution:

- corrected base path and rebuilt

Problem 5:

- browser-side PDF merge required a real manipulation library

Resolution:

- integrated `pdf-lib` through the `pdf-engine` layer for Phase 10.1 merge support

## 9. Current Status

Current status:

- local dev working
- production build working
- GitHub Pages deployed
- `HashRouter` working
- auto deploy enabled
- content/image workspaces working
- pdf workspace added
- merge-pdf working in browser
- split-pdf working in browser
- reorder-pdf working in browser
- page-numbers-pdf working in browser
- rotate-pdf working in browser
- Phase 10.2 polish pass applied for workspace UX wording, single-file tool switching, and small PDF adapter memory cleanup
- Phase 10.3 added a minimal single-file page-order editor with browser-side reorder/delete export

Online demo:

- https://kezhu100.github.io/Browser-based-pdf-toolkit/#/

## 10. Roadmap

Completed:

- Phase 1 - project skeleton
- Phase 2 - shared types and interfaces
- Phase 3 - content conversion pipeline
- Phase 4 - UI integration
- Phase 5 - preview/export separation
- Phase 6 - file upload and debounce improvements
- Phase 7 - UX and export settings improvements
- Phase 8 - release hardening
- Phase 9 - image to PDF
- Phase 9.1 - image flow stabilization
- Phase 9.5 - workspace router + lazy loading cleanup
- Phase 10.1 - merge PDF
- Phase 10.2 - split PDF + rotate PDF
- Phase 10.3 - reorder PDF pages + page removal
- Phase 10.4 - page numbers

Next likely steps:

- later document enhancement
  - watermark
  - crop

## 11. Codex Prompt Template

Recommended prompt structure:

```text
You are modifying an existing Vite + React + TypeScript repository.

Constraints:
1. Do not refactor unrelated architecture
2. Keep the ToolPlugin system
3. Keep browser-only processing
4. Keep GitHub Pages compatibility
5. Extend the existing pdf-engine path for PDF manipulation tools

Tasks:
1. implement feature X
2. modify file Y

Output:
Show changed files only
Explain changes briefly
```

## 12. Deployment Constraints

The project must remain:

- browser-only
- no backend
- no file upload to server
- GitHub Pages compatible

Reasons:

- privacy
- zero-cost hosting
- static-site compatibility

## 13. Important Config

Vite:

- `vite.config.ts`
- `base: "/Browser-based-pdf-toolkit/"`

Router:

- `HashRouter`

Deploy:

- GitHub Actions

## 14. Project Goal

Final goal:

- build a browser-only PDF toolkit
- similar in product direction to ilovepdf / smallpdf
- but without backend processing
- privacy-friendly
- open source

## 15. How to Continue Development

When adding a new feature:

1. add or extend a `ToolPlugin` under `src/tools/plugins`
2. register the tool in `src/tools/registry.ts`
3. integrate it through the appropriate workspace
4. reuse `src/pdf-engine` and `src/pipeline` instead of bypassing them

## 16. Notes for Future AI Sessions

Future AI sessions must keep in mind:

- ToolPlugin architecture is the core contract
- browser-only is a hard constraint
- `HashRouter` is required for GitHub Pages
- content/image tools use `DocumentPipeline`
- PDF manipulation tools should extend the `pdf-engine` path
- `merge-pdf`, `split-pdf`, `reorder-pdf`, `page-numbers-pdf`, and `rotate-pdf` are implemented for PDF manipulation at the current state
