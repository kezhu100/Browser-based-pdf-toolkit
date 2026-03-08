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

## Next Recommended Phase
- Implement image-to-pdf in the same plugin + pipeline pattern
- Add test coverage for content-flow validation and signature reuse safety
- Start manipulation tools as separate scoped phases without mixing UI concerns
