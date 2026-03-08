# Codex Development Chain

## Phase 1
Project skeleton and app shell

## Phase 2
Core interfaces and shared types

## Phase 3
Minimal end-to-end content conversion flow
- markdown -> preview -> PDF
- txt -> preview -> PDF
- html -> preview -> PDF

## Phase 3.5
Review and refinement
- extracted shared content tool runner
- reduced plugin duplication
- added browser guards to sanitizer and content PDF generator

## Phase 4
Minimal usable UI integration for content conversion tools.

### Goals
Connect the plugin-based conversion pipeline to a basic user interface so users can interact with the system.

### Scope
Content tools only:
- markdown-to-pdf
- txt-to-pdf
- html-to-pdf

### Key changes
- Introduced UI components for the content tool workspace:
  - `ToolSelectionPanel`
  - `EditorPanel`
  - `PreviewPanel`
  - `ExportPanel`
  - `StatusPanel`
- Implemented a page-level integration (`ToolsPage`) connecting:
  - tool registry
  - editor input
  - preview rendering
  - PDF export flow
- Added basic workspace layout with editor on the left and preview on the right.
- Implemented simple export workflow:
  - create `SourceDocument` from editor content
  - call plugin `run()` method
  - render preview HTML
  - generate PDF and trigger browser download
- Added browser-side download helper (`downloadBlob`).

### Result
Users can now:
- select Markdown/TXT/HTML tools
- input content in the editor
- preview generated content
- export PDF directly from the browser

This phase established the first interactive UI connected to the plugin-based architecture.

### Limitations
- Preview and export were initially coupled (preview generated during export).
- No file upload support yet.
- No debounce for preview updates.
- Manipulation tools (merge/split/etc.) remain unimplemented.

## Phase 5
Separated preview and export flows
- preview updates automatically
- export remains explicit
- precomputed model reuse added

## Phase 6
Improve the content tool workspace with local file input and better preview responsiveness.

### Prompt used for Codex

Follow `docs/architecture.md` and `AGENTS.md` strictly.

Continue implementing the project in phases.

Phase 6 goal:
Improve the usability of the content conversion workspace without expanding the scope to PDF manipulation tools.

Scope:
Content tools only:
- markdown-to-pdf
- txt-to-pdf
- html-to-pdf

Tasks:

1. Add local file input support
   - Create a `FileInputPanel` component
   - Allow uploading `.md`, `.txt`, `.html` files
   - Use `File.text()` to read content in browser

2. Automatically select tool based on uploaded file
   - Implement a resolver like `resolveToolIdFromFile(file)`
   - Switch active tool when file type differs

3. Inject file content into the existing editor state
   - Reuse the editor workflow
   - Do not bypass the current pipeline

4. Add a debounce mechanism for preview updates
   - Create a reusable hook such as `useDebouncedValue`
   - Delay preview execution ~200–300ms after typing

5. Improve workspace status reporting
   - Add file status messages
   - Keep preview status
   - Keep export status

6. Maintain separation of flows
   - preview flow runs automatically
   - export flow runs only on explicit action

7. Optimize export execution
   - reuse preview model when input signature matches
   - avoid rerunning the pipeline unnecessarily

Constraints:

- Do not modify core pipeline architecture
- Do not implement PDF manipulation tools yet
- Keep the system browser-only
- No backend services
- No cloud processing

Output required:

1. review summary
2. updated file tree
3. full code for affected files
4. explanation of how file input integrates with workspace flow

### Result

Users can now:

- upload `.md`, `.txt`, or `.html` files
- automatically switch tools based on file type
- preview content with debounced updates
- export PDF from uploaded or edited content

This phase significantly improved the workspace usability.


## Phase 7
Public-facing UI improvements and export configuration.
- added branded header
- added ExportSettingsPanel
- improved preview typography
- added drag-and-drop file support