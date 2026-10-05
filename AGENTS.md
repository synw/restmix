# Restmix

## Mission
A lightweight TypeScript HTTP client library that wraps native `fetch` with typed responses, CSRF management, SSE streaming, custom headers, and response hooks for REST APIs.

## Repositories

| Repo | Path | Purpose |
|------|------|---------|
| `restmix` | `</workspace/src/>` | Core library: `useApi()` composable HTTP client |
| `test/server` | `</workspace/test/server/>` | Express.js mock server for integration tests (port 5714) |
| `docsite` | `</workspace/docsite/>` | Vite + Vue.js documentation website source |

## Conventions (for AI Agents)

- **Composable factory**: `useApi()` returns a client object with bound HTTP methods, not a class instance. Composables use the `use` prefix; types are PascalCase.
- **Typed responses**: All HTTP methods use `<T>` generics; every response is an `ApiResponse<T>` (`ok`, `url`, `headers`, `status`, `statusText`, typed `data`, raw `text`).
- **Response hooks**: `onResponse(hook)` intercepts and can transform responses before they are returned.
- **Minimal runtime deps**: Only `js-cookie` at runtime (CSRF cookie access). CSRF defaults to cookie `csrftoken` / header `X-CSRFToken` — configurable via `UseApiParams`.
- **Build & test**: Rollup emits dual output — ESM (`dist/main.js`) and minified IIFE (`dist/main.min.js`, global `$api`). Jest + ts-jest runs integration tests against the Express mock server on port 5714.

## Quick Start for AI Agents

1. Read `.agents/documentation/decision-tree.md` to find the right doc for your task
2. Read `.agents/documentation/project-overview.md` for high-level context
3. Read `.agents/documentation/project-nav.md` for detailed navigation and dependency graph
4. Navigate to the relevant module and read its `.agents/documentation/codebase-summary.md`

## Documentation

- `.agents/documentation/decision-tree.md` — Quick guide: find the right doc for your task
- `.agents/documentation/project-overview.md` — Concise project overview (~1 page)
- `.agents/documentation/codebase-summary.md` — Top-level codebase summary (structured, machine-readable)
- `.agents/documentation/project-nav.md` — Detailed navigation map with dependency graph

Each module directory has an `.agents/documentation/codebase-summary.md`. Use them to navigate the codebase easily.
