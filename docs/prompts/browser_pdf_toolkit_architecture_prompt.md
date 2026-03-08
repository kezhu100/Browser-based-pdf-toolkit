# Project Architecture Prompt
## Project: Browser-based PDF Toolkit

You are a senior software architect and open-source project designer.

Your task is to design a complete architecture blueprint for a project called:

Browser-based PDF Toolkit

Do NOT generate implementation code.

Focus on designing a scalable and maintainable architecture.

---

# Project Vision

Browser-based PDF Toolkit is a fully frontend web application that allows users to create and manipulate PDF files directly inside the browser.

The system must operate entirely on the client side.

No backend services are allowed.

No server processing.

No paid APIs.

All document processing must happen locally in the browser.

---

# Key Constraints

The project must satisfy the following requirements:

1. Zero operational cost
2. Frontend-only architecture
3. Static site deployment
4. No cloud file processing
5. No backend services
6. No paid APIs
7. No user data upload
8. Privacy-friendly design

Deployment must work on:

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

---

# Product Scope

The toolkit should provide a set of browser-based PDF utilities.

Core tools include:

Markdown → PDF  
TXT → PDF  
HTML → PDF  
Image → PDF  

Additional PDF tools:

Merge PDF  
Split PDF  
Reorder pages  
Add watermark  
Add page numbers  

The system should support adding new tools in the future.

---

# Architecture Design Tasks

Please design the following aspects:

1. Overall system architecture
2. Modular tool architecture
3. Plugin-like tool system
4. Document conversion pipeline
5. Unified PDF engine
6. Preview rendering system
7. File input and processing system
8. Error handling strategy
9. Performance considerations
10. Security considerations

---

# Unified Document Pipeline

Design a unified processing pipeline such as:

Input Content
↓
Format Detection
↓
Content Parser
↓
Standard Document Model
↓
Preview Renderer
↓
PDF Engine
↓
Browser Download

Explain how different tools can reuse this pipeline.

---

# Technology Stack Recommendation

Recommend the best frontend technologies.

Consider:

Frontend framework  
Build tool  
Language choice  
UI framework  
PDF generation library  
PDF editing library  
Markdown parser  
HTML sanitizer  

The stack must prioritize:

- zero cost
- browser compatibility
- open-source ecosystem
- maintainability
- developer productivity

---

# UI Design

Design a user interface suitable for a public web tool.

Include:

Header  
Tool selection panel  
Editor / input area  
Preview panel  
PDF export controls  
Tool-specific settings  
Error/status messages  

Explain layout behavior for:

Desktop  
Mobile devices

---

# Project Folder Structure

Propose a scalable folder structure.

For example:

src/
tools/
pdf-engine/
preview-engine/
converters/
components/
utils/
hooks/
styles/

Explain the responsibility of each module.

---

# PDF Engine Design

Explain how the system should generate PDFs in the browser.

Discuss:

html2pdf.js  
html2canvas  
jsPDF  
pdf-lib  

Explain their roles in:

PDF generation  
PDF editing  
PDF manipulation

---

# Security Considerations

Discuss how to handle:

HTML input sanitization  
XSS risks  
Script injection  
Unsafe user content  

Recommend safe rendering strategies.

---

# Performance Strategy

Analyze performance issues such as:

Large documents  
Large images  
Complex HTML layouts  
Memory consumption  
Mobile browser limitations

Provide mitigation strategies.

---

# Extensibility

Design the architecture so new tools can be added easily.

Examples:

PDF watermark tool  
PDF rotate tool  
PDF crop tool  
Batch conversion  

Explain how the plugin-like tool system should work.

---

# Deliverables

Provide a detailed architecture analysis including:

1. System overview
2. Tool modular architecture
3. Document processing pipeline
4. Technology stack recommendation
5. UI design proposal
6. Project folder structure
7. PDF engine strategy
8. Security strategy
9. Performance strategy
10. Extensibility plan

Do not generate code.

Focus on system design and architecture.

For each proposed feature, clearly classify it as:

1. Fully feasible in a frontend-only architecture
2. Feasible with limitations
3. Not realistically feasible without backend support

For features that are difficult in a frontend-only system, propose the best browser-based alternative.