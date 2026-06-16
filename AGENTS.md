# Restmix

## Reading Order for AI Agents

1. **Start here** → This file is your index
2. **Comprehensive reference** → `.agents/documentation/project-nav.md` — Full project map
3. **Technical summary** → `.agents/documentation/codebase-summary.md` — Dependencies, entry points, key files
4. **Per-repo navigation** → Each repo has its own `AGENTS.md` and `.agents/documentation/codebase-summary.md`

---

This is a TypeScript (ESM) project for making typed HTTP requests to REST APIs. It wraps the native `fetch` API with automatic JSON parsing, CSRF token management, SSE streaming, and response hooks.

- `restmix` — Core library: lightweight HTTP client composable (`useApi`)
- `test/server` — Express.js mock server for integration tests
- `docsite` — Vite-built documentation website source

Documentation:

- `.agents/documentation/codebase-summary.md`: top-level codebase summary
- `.agents/documentation/project-nav.md`: navigation map
- `test/server/.agents/documentation/codebase-summary.md`: per-repo summaries (if present)
