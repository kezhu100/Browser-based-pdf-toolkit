# Codex Development Chain

## Phase 1

Project skeleton and app shell.

## Phase 2

Core interfaces and shared types.

## Phase 3

Minimal end-to-end content conversion flow.

- markdown -> preview -> PDF
- txt -> preview -> PDF
- html -> preview -> PDF

## Phase 3.5

Review and refinement.

- extracted shared content tool runner
- reduced plugin duplication
- added browser guards to sanitizer and content PDF generator

## Phase 4

Minimal usable UI integration for content conversion tools.

### Result

Users can:

- select Markdown/TXT/HTML tools
- input content in the editor
- preview generated content
- export PDF directly from the browser

## Phase 5

Separated preview and export flows.

- preview updates automatically
- export remains explicit
- precomputed model reuse added

## Phase 6

Improved the content workspace with local file input and better preview responsiveness.

### Result

Users can:

- upload `.md`, `.txt`, or `.html` files
- automatically switch tools based on file type
- preview content with debounced updates
- export PDF from uploaded or edited content

## Phase 7

Public-facing UI improvements and export configuration.

- added branded header
- added export settings panel
- improved preview typography
- added drag-and-drop file support

## Phase 8

Release hardening.

- stronger empty-input validation
- safer export gating and status handling
- improved release documentation

## Phase 9

Image to PDF implementation.

### Result

- supports PNG/JPG/JPEG/WEBP image input
- supports single-image and multi-image PDF export
- preserves automatic preview + explicit export behavior

## Phase 9.1

Image flow stabilization patch.

- safer object URL lifecycle handling
- synchronized preview/export reuse state
- conservative large-image render protection

## Phase 9.5

Workspace routing cleanup and lazy loading.

### Result

- current markdown/txt/html and image workspace behavior is preserved
- workspace selection is routed through a dedicated resolver layer
- workspace entry rendering uses `React.lazy` + `Suspense`

## Phase 10.1

Minimal PDF manipulation workflow: Merge PDF.

### Scope

Add the smallest end-to-end PDF manipulation feature that fits the existing architecture.

### Architectural changes

- added a `pdf` workspace family alongside `content` and `image`
- added `PdfToolsWorkspace`
- replaced the `merge-pdf` placeholder plugin with a working implementation
- implemented browser-side merge through `UnifiedPdfEngine.merge()`
- added a `pdf-lib` based adapter under `src/pdf-engine/adapters`

### Result

Users can now:

- switch to the PDF tools workspace
- select the merge PDF tool
- upload multiple PDF files
- validate PDF input locally in the browser
- merge PDFs in browser
- download the merged PDF

### Limitations

- only `merge-pdf` is implemented for PDF manipulation
- no split/rotate/reorder/delete workflow yet
- no page thumbnails yet
- preview is currently a lightweight merge summary, not a page-level preview

## Phase 10.4

Minimal PDF manipulation workflow: Add Page Numbers.

### Scope

Add a small single-file PDF enhancement feature that fits the existing architecture.

### Architectural changes

- replaced the `page-numbers-pdf` placeholder plugin with a working implementation
- implemented browser-side page numbering through `UnifiedPdfEngine.pageNumbers()`
- reused the existing PDF workspace settings/apply flow for a minimal single-file tool
- kept the feature on the `pdf-engine` manipulation path with `pdf-lib`

### Result

Users can now:

- select the add page numbers tool
- upload one PDF
- choose start number, preset position, font size, margin, and optional prefix text
- preview the planned operation as a lightweight summary
- export the updated PDF in browser

### Limitations

- page-number placement uses fixed presets only
- no page thumbnails or freeform positioning
- uses a standard embedded PDF font for numbering

## Phase 10.5

Minimal PDF manipulation workflow: Add Watermark.

### Scope

Add a small single-file PDF watermark feature that fits the existing architecture.

### Architectural changes

- replaced the `watermark-pdf` placeholder plugin with a working implementation
- implemented browser-side text watermarking through `UnifiedPdfEngine.watermark()`
- reused the existing PDF workspace settings/apply flow for another minimal single-file tool
- kept the feature on the `pdf-engine` manipulation path with `pdf-lib`

### Result

Users can now:

- select the add watermark tool
- upload one PDF
- choose text, opacity, font size, rotation, position preset, and margin
- preview the planned operation as a lightweight summary
- export the updated PDF in browser

### Limitations

- text watermark only
- preset placement only
- no page thumbnails or freeform positioning
- uses a standard embedded PDF font for watermark text
