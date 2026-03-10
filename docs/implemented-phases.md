# Implemented Phases (Current)

## Phase 1 - Project Skeleton

- Created modular project structure under `src/`
- Added app shell, routing, tool registry
- Added shared types and engine interfaces
- Added placeholder tool modules

## Phase 2 - Type and Interface Refinement

- Refined document, tool, pipeline, preview, and PDF engine contracts
- Improved type safety and error/result modeling
- Kept tool logic as placeholders

## Phase 3 - First End-to-End Content Flow

- Implemented minimal pipeline orchestration for:
  - Markdown -> preview -> PDF
  - TXT -> preview -> PDF
  - HTML -> preview -> PDF
- Added format detection, parser adapters, sanitization, normalization
- Added minimal preview renderer and content PDF generation adapter

## Phase 4 - Minimal Usable UI

- Connected tool registry to workspace UI
- Added tool selection, editor, preview, and export action
- Added loading/error/success feedback

## Phase 5 - Preview/Export Separation

- Split auto-preview flow from explicit export flow
- Added safer model reuse between preview and export
- Reduced `ToolsPage` responsibility via workspace component extraction

## Phase 6 - Workspace Interaction Improvements

- Added local file input (`.md`, `.txt`, `.html`)
- Added automatic tool switching based on file type
- Added lightweight debounce for preview updates
- Improved status handling for file/preview/export

## Phase 7 - Public Usability and Presentation

- Improved app header and navigation presentation
- Added export settings panel (page size, orientation, margin)
- Enhanced preview document styling
- Added drag-and-drop support for file upload

## Phase 8 - Release Readiness Hardening

- Strengthened validation for empty input cases
- Added safer preview/export reuse with export settings in signature
- Added disabled states and better user feedback in workspace actions
- Improved README and phase documentation for public release readiness

## Phase 9 - Image to PDF

- Implemented `image-to-pdf` plugin and integrated it into the conversion workspace
- Added browser-only image input support for PNG/JPG/JPEG/WEBP
- Added single-image and multi-image export flow (one image per page)
- Added drag/drop + file picker path for image files
- Kept preview automatic and export explicit with existing export settings reuse

## Phase 9.1 - Image Flow Stabilization Patch

- Fixed image object URL cleanup timing to avoid unnecessary repeated revocation during normal state transitions
- Synced preview signature state after export to keep preview/export reuse checks consistent
- Added conservative image display constraint to reduce excessive render/canvas memory pressure on very large images

## Phase 9.5 - Workspace Routing and Lazy Loading Cleanup

- Extracted tool workspace selection into a dedicated workspace router layer
- Reduced `ToolsPage` coupling to specific workspace implementations
- Added lazy loading for workspace families with `Suspense`
- Preserved existing content/image plugin execution flow and browser-only behavior

## Phase 10.1 - PDF Workspace and Merge PDF

- Added a third workspace family: `pdf`
- Extended the workspace router to support `content`, `image`, and `pdf` families
- Added `PdfToolsWorkspace` with:
  - PDF tool selection
  - multiple PDF file input
  - file validation
  - lightweight preview summary
  - explicit merge/export action
- Replaced the `merge-pdf` placeholder plugin with a working browser-side implementation
- Implemented `UnifiedPdfEngine.merge()`
- Added a browser-safe PDF merge adapter using `pdf-lib`

### Current limitation after Phase 10.1

Implemented PDF manipulation tool:

- `merge-pdf`

Still not implemented:

- `split-pdf`
- `reorder-pdf`
- `rotate-pdf`
- `watermark-pdf`
- `page-numbers-pdf`
- `crop-pdf`
