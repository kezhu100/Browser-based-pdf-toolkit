# Browser-based PDF Toolkit

A browser-only PDF conversion tool focused on privacy, zero backend cost, and simple usability.

一个纯浏览器端 PDF 转换工具，强调隐私保护、零后端成本与易用性。

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
