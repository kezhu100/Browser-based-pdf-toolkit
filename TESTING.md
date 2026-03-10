# Manual Testing Guide

This document describes how to manually verify the current functionality of the Browser-based PDF Toolkit.

All processing runs locally in the browser.

- no backend
- no server file upload
- no paid API

## 1. Testing Environment

Recommended environment:

- Node.js >= 18
- Chrome latest
- Edge latest
- Firefox latest

Optional:

- Safari

## 2. Setup and Run

From the project root:

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Verify:

- home page loads
- tools page opens
- no obvious browser console errors

## 3. Implemented Tool Coverage

The current repository supports:

- `markdown-to-pdf`
- `txt-to-pdf`
- `html-to-pdf`
- `image-to-pdf`
- `merge-pdf`

The current repository does not yet implement:

- `split-pdf`
- `reorder-pdf`
- `rotate-pdf`
- `watermark-pdf`
- `page-numbers-pdf`
- `crop-pdf`

## 4. Content Tool Tests

### 4.1 Markdown -> PDF

Steps:

1. Open the Tools page.
2. Select the Content workspace.
3. Select `Markdown to PDF`.
4. Enter:

```markdown
# Hello Markdown

This is **bold** text.

- Item A
- Item B
```

5. Wait for preview update.
6. Click `Export PDF`.

Expected result:

- preview shows heading, bold text, and list
- PDF downloads successfully

### 4.2 TXT -> PDF

Steps:

1. Select `TXT to PDF`.
2. Enter:

```text
Hello TXT

This is line one.
This is line two.
```

3. Wait for preview update.
4. Click `Export PDF`.

Expected result:

- preview shows plain text
- PDF downloads successfully

### 4.3 HTML -> PDF

Steps:

1. Select `HTML to PDF`.
2. Enter:

```html
<h1>Hello HTML</h1>
<p>This is a paragraph.</p>
<ul>
  <li>Apple</li>
  <li>Banana</li>
</ul>
```

3. Wait for preview update.
4. Click `Export PDF`.

Expected result:

- preview renders HTML elements
- PDF downloads successfully

## 5. Content File Upload Tests

### 5.1 Markdown file upload

Create `test.md`:

```markdown
# Markdown File Test
This is a markdown file.
```

Upload with file selector or drag and drop.

Expected result:

- tool switches to Markdown
- editor content updates
- preview updates
- export works

### 5.2 TXT file upload

Create `test.txt`:

```text
TXT test file
Second line
```

Expected result:

- tool switches to TXT
- preview updates
- export works

### 5.3 HTML file upload

Create `test.html`:

```html
<h2>HTML Test</h2>
<p>Hello toolkit</p>
```

Expected result:

- tool switches to HTML
- preview renders HTML
- export works

## 6. Image Tool Tests

### 6.1 Single image export

Steps:

1. Switch to the Images workspace.
2. Select one PNG/JPG/JPEG/WEBP file.
3. Wait for preview update.
4. Click `Export PDF`.

Expected result:

- image preview appears
- a single-page PDF downloads successfully

### 6.2 Multi-image export

Steps:

1. Stay in the Images workspace.
2. Select multiple supported image files.
3. Wait for preview update.
4. Click `Export PDF`.

Expected result:

- file list updates
- preview updates
- a multi-page PDF downloads successfully

## 7. PDF Workspace Tests

### 7.1 Merge PDF happy path

Steps:

1. Switch to the `PDF Tools` workspace.
2. Confirm the tool is `Merge PDF`.
3. Select two or more PDF files.
4. Wait for preview update.
5. Click `Export PDF`.

Expected result:

- file status reports loaded PDF files
- preview shows a merge summary with the selected file names
- merged PDF downloads successfully

### 7.2 Merge PDF validation: single file

Steps:

1. Switch to the `PDF Tools` workspace.
2. Select exactly one PDF file.

Expected result:

- preview may validate input, but export remains disabled
- UI indicates that at least two PDF files are required

### 7.3 Merge PDF validation: unsupported file

Steps:

1. Switch to the `PDF Tools` workspace.
2. Try selecting a non-PDF file.

Expected result:

- file error is shown
- merge does not run

## 8. Validation and UI State Tests

### 8.1 Empty content validation

Steps:

1. Switch to the Content workspace.
2. Clear all editor content.

Expected result:

- preview error appears
- export is disabled

### 8.2 Unsupported content file validation

Steps:

1. In the Content workspace, upload `test.pdf`.

Expected result:

- unsupported file type message appears

### 8.3 Export disabled during preview

Steps:

1. In the Content workspace, edit content quickly.

Expected result:

- export is temporarily disabled while preview updates

## 9. Build Test

Run:

```bash
npm run build
```

Expected result:

- build completes successfully
- no blocking TypeScript or Vite errors

## 10. Production Preview Test

Run:

```bash
npm run preview
```

Open:

```text
http://localhost:4173
```

Verify:

- Content workspace works
- Images workspace works
- PDF Tools workspace works
- export/download flows still work

## 11. Browser Console Check

Open developer tools and verify:

- no obvious runtime errors
- no unhandled exceptions during normal flows

## 12. Final Checklist

```text
[ P ] Dev server runs
[ P ] Markdown preview works
[ P ] Markdown export works
[ P ] TXT export works
[ P ] HTML export works
[ P ] Content file upload works
[ P ] Drag-and-drop works for content/image flows
[ P ] Single-image export works
[ P ] Multi-image export works
[ P ] Merge PDF works
[ P ] Merge PDF single-file validation works
[ P ] Merge PDF unsupported-file validation works
[ P ] Empty content validation works
[ P ] Export settings affect content/image PDF output
[ P ] Build succeeds
[ P ] Production preview works
[ P ] Browser console check
```

## 13. Issue Reporting

If a test fails, record:

- test name
- browser
- error message
- console output
- steps to reproduce

Example:

```text
Test: Merge PDF
Browser: Chrome
Error: Failed to merge PDF files in the browser
Console: <error output>
```

## 14. Version Tested

Version: Phase 10.1

Implemented tools:

- `markdown-to-pdf`
- `txt-to-pdf`
- `html-to-pdf`
- `image-to-pdf`
- `merge-pdf`
