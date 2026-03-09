# Browser-based PDF Toolkit

A browser-only PDF conversion tool focused on privacy, zero backend cost, and simple usability.(Fully developed by AI, I have zero experience in front-end development and no any manual code.)

一个纯浏览器端 PDF 转换工具，强调隐私保护、零后端成本与易用性。(纯ai打造，本人零前端经验，无任何手工代码)

## Live Demo

https://kezhu100.github.io/Browser-based-pdf-toolkit/#/

## Screenshot

![Browser-based PDF Toolkit Screenshot](docs/screenshot.png)

## Features / 功能

English:
- Markdown -> PDF
- TXT -> PDF
- HTML -> PDF
- Live preview
- Browser-only processing (privacy-friendly)

中文：
- Markdown 转 PDF
- TXT 转 PDF
- HTML 转 PDF
- 实时预览
- 浏览器本地处理（保护隐私）

## Tech Stack / 技术栈

- React
- TypeScript
- Vite

## Local Development / 本地开发

English:
```bash
npm install
npm run dev
```

中文：
安装依赖并启动开发服务器。

## Build / 构建

```bash
npm run build
```

## Deploy / 部署

Deployment is automated with GitHub Actions.  
Every push to the `main` branch triggers build and deploy to GitHub Pages.

项目通过 GitHub Actions 自动部署。  
每次推送到 `main` 分支后会自动构建并发布到 GitHub Pages。

## Roadmap / 未来计划

- Image -> PDF
- Merge / Split PDF
- Page reordering
- Watermark / page numbers

## Latest Capabilities / 最新能力

English:
- Supported tools:
  - Markdown -> PDF
  - TXT -> PDF
  - HTML -> PDF
  - Image -> PDF
- Image tool:
  - PNG / JPG / JPEG / WEBP support
  - single image -> single-page PDF
  - multiple images -> multi-page PDF
  - drag and drop upload
  - local browser processing (no server upload)
- Architecture update (Phase 9.5):
  - workspace router layer for workspace-family resolution
  - lazy loading for content/image workspaces via `React.lazy` + `Suspense`

中文：
- 已支持工具：
  - Markdown -> PDF
  - TXT -> PDF
  - HTML -> PDF
  - Image -> PDF
- 图片工具能力：
  - 支持 PNG / JPG / JPEG / WEBP
  - 单图 -> 单页 PDF
  - 多图 -> 多页 PDF
  - 支持拖拽上传
  - 全流程浏览器本地处理（不上传服务器）
- 架构更新（Phase 9.5）：
  - 新增 workspace router 层用于工作区家族路由
  - content/image 工作区采用 `React.lazy` + `Suspense` 懒加载