# Browser-based PDF Toolkit — Project Context

This file is the primary context for AI assistants working on this repository.

AI agents should also read:

- AGENTS.md
- docs/architecture.md
- docs/implemented-phases.md
- docs/codex_prompt_chain.md

1 Project Overview

Browser-based PDF Toolkit 是一个 纯浏览器端 PDF 工具网站。

核心目标：

不上传文件

不需要服务器

所有处理在浏览器完成

保护用户隐私

零后端成本部署

当前在线版本：

https://kezhu100.github.io/Browser-based-pdf-toolkit/#/

部署平台：

GitHub Pages
2 Tech Stack

前端技术栈：

React
TypeScript
Vite
React Router
html2canvas

部署：

GitHub Pages
GitHub Actions (auto deploy)

开发环境：

Node.js
npm
Vite dev server
3 Project Architecture

项目采用 插件式工具架构 (Tool Plugin Architecture)。

整体结构：

src
│
├─ app
│   ├─ router.tsx
│   ├─ AppShell.tsx
│   └─ pages
│
├─ components
│   └─ content-tools
│
├─ pipeline
│
├─ pdf-engine
│
├─ preview-engine
│
├─ tools
│   ├─ plugins
│   └─ registry.ts
│
├─ state
│
├─ types
│
└─ utils

架构流程：

Input Document
     ↓
Document Pipeline
     ↓
Document Model
     ↓
Preview Engine
     ↓
PDF Engine
     ↓
Download
4 Tool Plugin System

每个工具是一个 ToolPlugin：

示例：

markdownToPdfTool
txtToPdfTool
htmlToPdfTool

注册位置：

src/tools/registry.ts

工具执行流程：

ToolPlugin.run()
      ↓
DocumentPipeline
      ↓
PreviewRenderer
      ↓
UnifiedPdfEngine
5 Current Features (MVP)

已完成：

Content → PDF
Markdown → PDF
TXT → PDF
HTML → PDF
UI
Editor
Preview
Export
File Upload
Tool Selection
PDF Export
Page size
Orientation
Margin
Download
Preview
Live preview
HTML rendering
6 Deployment Architecture

网站部署方式：

GitHub Pages

路由方案：

HashRouter

示例：

#/tools

原因：

GitHub Pages 是静态托管
BrowserRouter 会导致刷新404
HashRouter 更稳定
7 Build & Deployment

本地开发：

npm install
npm run dev

构建：

npm run build

自动部署：

git push
↓
GitHub Actions
↓
npm install
npm run build
↓
deploy to GitHub Pages

Workflow：

.github/workflows/deploy-pages.yml
8 Key Problems Encountered
Problem 1

TypeScript build errors

原因：

ToolPlugin generic types mismatch
registry typing mismatch

解决：

introduce AnyToolPlugin
narrow ContentToolPlugin
Problem 2

Vite build succeeded but GitHub Pages failed

原因：

base path mismatch
repo name case mismatch

解决：

vite.config.ts base fix
Problem 3

React Router 404 on GitHub Pages

原因：

BrowserRouter requires server fallback
GitHub Pages is static

解决：

switch to HashRouter
Problem 4

Blank page after deploy

原因：

assets path mismatch

解决：

correct base path
rebuild and redeploy
9 Current Status

当前项目已经：

Local dev working
Build successful
GitHub Pages deployed
HashRouter working
Auto deploy enabled
README bilingual

在线 Demo：

https://kezhu100.github.io/Browser-based-pdf-toolkit/#/
10 Future Roadmap
Phase 1 (Completed)

Content → PDF

Markdown
TXT
HTML
Phase 2

Image → PDF

PNG
JPG
Phase 3

PDF Operations

Merge PDF
Split PDF
Phase 4

Page Operations

Reorder pages
Delete pages
Rotate pages
Phase 5

Document Enhancement

Watermark
Page numbers
Phase 6

Optimization

Bundle splitting
Dynamic imports
Reduce JS size
Phase 7

UX Improvements

Drag & Drop
Better preview
Tooltips
11 Codex Prompt Template

推荐给 Codex 的 Prompt 模板：

You are modifying a Vite + React + TypeScript project.

Repository:
<repo-url>

Goals:
<task description>

Constraints:

1. Do not refactor unrelated architecture
2. Keep existing ToolPlugin system
3. Keep browser-only processing
4. Do not introduce backend services

Tasks:

1. implement feature X
2. modify file Y

Output:

Show updated files only
Explain changes briefly
12 Deployment Constraints

项目必须保持：

Browser-only
No backend
No file upload to server

原因：

privacy
zero cost hosting
GitHub Pages compatibility
13 Important Config
vite.config.ts
base: "/Browser-based-pdf-toolkit/"
Router
createHashRouter
Deploy
GitHub Actions
14 Project Goal

最终目标：

构建一个：

browser-only PDF toolkit

类似：

ilovepdf
smallpdf

但：

no backend
privacy friendly
open source
15 How to Continue Development

开发新功能时：

1 新建 ToolPlugin

src/tools/plugins

2 注册工具

registry.ts

3 UI integration

ToolSelectionPanel
ContentToolsWorkspace
16 Notes for Future AI Sessions

新 AI / Codex 必须知道：

ToolPlugin architecture
Browser-only constraint
HashRouter for GitHub Pages
GitHub Actions deploy