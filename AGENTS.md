# Instructions for AI agents working on this repository

Follow the architecture described in:

docs/architecture.md

Do not invent a different structure.

Key rules:

1. Follow the architecture document strictly
2. Do not modify the project structure without explanation
3. Keep tools modular under src/tools
4. Reuse shared engines under src/pdf-engine and src/pipeline
5. Implement features in phases rather than generating the whole app at once
6. Prefer small focused modules over large files

When implementing code, always check docs/architecture.md first.
Before implementing any code, summarize the architecture from docs/architecture.md.