# Browser-based PDF Toolkit

Browser-based PDF Toolkit is a privacy-first, zero-cost web tool for local document conversion.

All processing runs in the browser:
- no backend
- no upload
- no paid API

## Current Feature Scope

Implemented content conversion tools:
- Markdown -> PDF
- TXT -> PDF
- HTML -> PDF

Current workspace capabilities:
- tool switching across Markdown/TXT/HTML
- local file input (`.md`, `.txt`, `.html`) with drag-and-drop
- debounced live preview
- configurable export settings (page size, orientation, margin)
- explicit export action with browser download
- status feedback for file, preview, and export states

Not yet implemented:
- image-to-pdf
- merge/split/reorder/watermark/page-number tools

## Architecture

The project follows the modular architecture documented in:
- [`docs/architecture.md`](./docs/architecture.md)

High-level structure:
- `src/tools`: plugin modules and tool registry
- `src/pipeline`: content detection, parsing, sanitization, normalization
- `src/preview-engine`: preview rendering interfaces/adapters
- `src/pdf-engine`: PDF generation/editing interfaces/adapters
- `src/components/content-tools`: current content workspace UI

## Development

Requirements:
- Node.js 18+

Install and run:
```bash
npm install
npm run dev
```

Build:
```bash
npm run build
```

Preview build:
```bash
npm run preview
```

## Documentation

- Architecture baseline: [`docs/architecture.md`](./docs/architecture.md)
- Implemented phase summary: [`docs/implemented-phases.md`](./docs/implemented-phases.md)
