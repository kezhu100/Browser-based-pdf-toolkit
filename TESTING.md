# Manual Testing Guide / 手工测试指南

This document describes how to manually verify the functionality of the **Browser-based PDF Toolkit**.

本文档用于指导开发者或贡献者 **手动测试 Browser-based PDF Toolkit 当前版本的功能是否正常**。

The current version supports the following tools:

当前版本支持以下工具：

- Markdown → PDF
- TXT → PDF
- HTML → PDF

All processing runs **locally in the browser**.

所有处理 **完全在浏览器本地执行**：

- no backend / 无后端
- no file upload / 不上传文件
- no paid API / 无付费 API

---

# 1. Testing Environment / 测试环境

Recommended environment:

推荐测试环境：

Node.js >= 18  
Chrome (latest)  
Edge (latest)  
Firefox (latest)

Optional browser:

可选浏览器测试：

Safari

---

# 2. Setup and Run / 启动项目

From the project root directory:

在项目根目录运行：

## Install dependencies / 安装依赖

```bash
npm install
```

## Start development server / 启动开发服务器

```bash
npm run dev
```

Open the browser:

打开浏览器：

```
http://localhost:5173
```

Verify:

确认以下情况：

- Homepage loads correctly  
  首页能正常加载
- Tools page can be opened  
  Tools 页面可以进入
- No errors in browser console  
  浏览器控制台没有错误

---

# 3. Core Feature Tests / 核心功能测试

These tests verify the main functionality of the toolkit.

这些测试用于验证核心功能是否正常。

---

# 3.1 Markdown → PDF

## Steps / 测试步骤

1. Open **Tools** page  
   打开 Tools 页面

2. Select **Markdown to PDF**  
   选择 Markdown to PDF

3. Enter the following content in the editor  
   在编辑器输入以下内容

```markdown
# Hello Markdown

This is **bold** text.

- Item A
- Item B
```

4. Wait for preview update  
   等待预览更新

5. Click **Export PDF**  
   点击 Export PDF

## Expected Result / 预期结果

Preview shows:

预览显示：

- Heading
- Bold text
- Bullet list

PDF should:

PDF 应该：

- download automatically  
  自动下载
- contain the formatted content  
  包含正确格式内容

Result:

PASS / FAIL

---

# 3.2 TXT → PDF

## Steps / 测试步骤

Switch tool to **TXT to PDF**.

切换工具为 TXT to PDF。

Enter:

输入：

```
Hello TXT

This is line one.
This is line two.
```

Wait for preview update.

等待预览更新。

Click **Export PDF**.

点击 Export PDF。

## Expected Result / 预期结果

Preview shows plain text.

预览显示纯文本。

PDF downloads correctly.

PDF 成功下载。

Result:

PASS / FAIL

---

# 3.3 HTML → PDF

## Steps / 测试步骤

Switch tool to **HTML to PDF**.

切换工具为 HTML to PDF。

Enter:

输入：

```html
<h1>Hello HTML</h1>
<p>This is a paragraph.</p>
<ul>
<li>Apple</li>
<li>Banana</li>
</ul>
```

Wait for preview update.

等待预览更新。

Click **Export PDF**.

点击 Export PDF。

## Expected Result / 预期结果

Preview renders HTML elements correctly.

预览正确渲染 HTML：

- heading
- paragraph
- list

PDF export works.

PDF 导出成功。

Result:

PASS / FAIL

---

# 4. File Upload Tests / 文件上传测试

These tests verify local file input.

用于验证本地文件上传功能。

---

# 4.1 Upload Markdown File / 上传 Markdown 文件

Create file:

创建文件：

test.md

Content:

```markdown
# Markdown File Test
This is a markdown file.
```

Upload the file using:

上传文件方式：

- Drag & Drop
- File selector

## Expected Result / 预期结果

- Tool switches to Markdown tool  
  自动切换到 Markdown 工具
- Editor content updates  
  编辑器内容更新
- Preview renders correctly  
  预览正常
- Export works  
  导出成功

Result:

PASS / FAIL

---

# 4.2 Upload TXT File / 上传 TXT 文件

Create file:

test.txt

Content:

```
TXT test file
Second line
```

Expected result:

预期结果：

- Tool switches to TXT
- Preview works
- Export works

Result:

PASS / FAIL

---

# 4.3 Upload HTML File / 上传 HTML 文件

Create file:

test.html

Content:

```html
<h2>HTML Test</h2>
<p>Hello toolkit</p>
```

Expected result:

预期结果：

- Tool switches to HTML
- Preview renders HTML
- Export works

Result:

PASS / FAIL

---

# 5. Drag and Drop Test / 拖拽上传测试

## Steps / 步骤

Drag a `.md`, `.txt`, or `.html` file into the dropzone.

将 `.md` `.txt` `.html` 文件拖入拖拽区域。

## Expected Result / 预期结果

- File loads successfully  
  文件成功加载
- Editor content updates  
  编辑器内容更新
- Preview updates  
  预览更新

Result:

PASS / FAIL

---

# 6. Validation Tests / 输入校验测试

These tests verify validation logic.

用于验证输入校验逻辑。

---

# 6.1 Empty Editor Content / 编辑器为空

## Steps

Clear all editor content.

清空编辑器内容。

## Expected Result

Preview error appears:

预览提示错误：

Preview requires non-empty content

Export button disabled.

Export 按钮被禁用。

Result:

PASS / FAIL

---

# 6.2 Empty File Upload / 空文件上传

Create empty file:

empty.txt

Upload the file.

上传文件。

Expected result:

The selected file is empty

Result:

PASS / FAIL

---

# 6.3 Unsupported File Type / 不支持文件类型

Upload:

test.pdf

Expected result:

Unsupported file type

Result:

PASS / FAIL

---

# 7. Export Settings Tests / 导出设置测试

Test settings panel.

测试导出设置面板。

---

# 7.1 Page Size / 页面尺寸

Test both options:

A4  
Letter

Expected result:

PDF layout changes accordingly.

PDF 页面尺寸发生变化。

Result:

PASS / FAIL

---

# 7.2 Orientation / 页面方向

Test:

Portrait  
Landscape

Expected result:

PDF orientation updates correctly.

PDF 页面方向变化正确。

Result:

PASS / FAIL

---

# 7.3 Margin / 页面边距

Test margin values:

0  
12  
40

Expected result:

PDF margin changes.

PDF 边距变化。

Result:

PASS / FAIL

---

# 8. UI State Tests / UI 状态测试

Verify disabled states.

验证 UI 禁用状态。

---

# 8.1 Export Disabled During Preview

Edit content quickly.

快速编辑内容。

Expected message:

Wait for preview update before exporting

Result:

PASS / FAIL

---

# 8.2 Export Disabled When Empty

Clear editor content.

清空编辑器。

Expected message:

Add content before exporting

Result:

PASS / FAIL

---

# 9. Build Test / 构建测试

Run:

```bash
npm run build
```

Expected:

- Build completes successfully  
- No errors

Result:

PASS / FAIL

---

# 10. Production Preview Test / 生产环境预览测试

Run:

```bash
npm run preview
```

Open:

http://localhost:4173

Verify:

- Tools page works
- Preview works
- Export works

Result:

PASS / FAIL

---

# 11. Browser Console Check / 浏览器控制台检查

Open developer tools:

F12 → Console

Verify:

- No runtime errors
- No unhandled exceptions

Result:

PASS / FAIL

---

# 12. Final Test Checklist / 最终测试清单

```
[ P ] Dev server runs
[ P ] Markdown preview works
[ P ] Markdown export works
[ P ] TXT export works
[ P ] HTML export works
[ P ] Markdown file upload works
[ P ] TXT file upload works
[ P ] HTML file upload works
[ P ] Drag-and-drop works
[ P ] Empty content validation works
[ P ] Empty file validation works
[ P ] Unsupported file validation works
[ P ] Export settings affect PDF
[ P ] Build succeeds
[ P ] Production preview works
[ P ] Browser console check
```

---

# 13. Issue Reporting / 问题报告

If a test fails, record:

如果测试失败，请记录：

Test name  
Browser  
Error message  
Console output  
Steps to reproduce

Example:

Test: HTML Export  
Browser: Chrome  
Error: Preview not rendered  
Console: DOMPurify error

---

# 14. Version Tested / 当前测试版本

Version: Phase 8

Tools implemented:

- markdown-to-pdf
- txt-to-pdf
- html-to-pdf