---
name: use-relative-paths
description: Instructs LLM agents to always use relative file paths instead of absolute file URIs within the problem2 directory.
---

# Relative Paths Constraint

When referencing or linking to files within the `src/problem2` codebase:
1. **Never use absolute file URIs or absolute Windows paths** (e.g., `file:///c:/Users/...` or `c:\Users\...`).
2. **Always use clean relative paths** (e.g., `server/src/index.ts`, `client/src/App.tsx`, `README.md`, `REPORT.md`).
3. Markdown file links should be formatted using relative paths, such as `[index.ts](server/src/index.ts#L1-L50)`.
