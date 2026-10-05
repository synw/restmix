# Documentation Decision Tree

> Quick guide: What to read based on your task

## I need to understand the project

- High-level overview → `.agents/documentation/project-overview.md`
- Full navigation map & architecture → `.agents/documentation/project-nav.md`
- Structured technical summary → `.agents/documentation/codebase-summary.md`

## I need to work on a specific module

| Module | Go To |
|--------|-------|
| `restmix` (core library) | `.agents/documentation/codebase-summary.md` → key files `src/api.ts`, `src/interfaces.ts` |
| `test/server` (mock server) | `test/server/src/index.ts` (+ `.agents/documentation/codebase-summary.md`) |
| `docsite` (docs website) | `docsite/src/` (Vue components, views, widgets) |

## I need to work on a specific file or feature

| File / Feature | Path |
|----------------|------|
| HTTP methods, SSE, CSRF, headers, hooks | `src/api.ts` |
| TypeScript types (`UseApiParams`, `ApiResponse<T>`, `OnResponseHook`) | `src/interfaces.ts` |
| Public re-exports / entry point | `src/main.ts` |
| Rollup build config (ESM + IIFE) | `rollup.config.js` |
| Jest test suite | `test/test.ts` |
| Express mock server routes | `test/server/src/index.ts` |
| Doc site router & config | `docsite/src/router.ts`, `docsite/src/conf.ts` |
| Doc site views (usage examples) | `docsite/src/views/` |

## Common Tasks (Quick Reference)

| Task | Go To |
|------|-------|
| Find the right documentation for any task | `.agents/documentation/decision-tree.md` (this file) |
| Get high-level context | `.agents/documentation/project-overview.md` |
| Modify HTTP methods or core logic | `src/api.ts` |
| Add or change types | `src/interfaces.ts` |
| Run tests (integration) | `npm test` — Jest against `test/server` on port 5714 |
| Build library | `npm run build` — Rollup → `dist/` |
| Generate API docs | `npm run docs` — TypeDoc → `docsite/public/apidoc/auto` |
| View docs site locally | `docsite/` — `npm run dev` (Vite) |
| Update documentation examples | `docsite/src/views/` |

## Conventions

- **Composable factory**: `useApi()` returns a client object, not a class instance.
- **Typed responses**: All methods use `<T>` generics; every response is an `ApiResponse<T>`.
- **Naming**: Composables use the `use` prefix (`useApi`); types are PascalCase.
- **Minimal deps**: Only `js-cookie` at runtime; CSRF defaults to cookie `csrftoken` / header `X-CSRFToken`.
- **Build**: Rollup emits ESM (`dist/main.js`) and minified IIFE (`dist/main.min.js`, global `$api`).

→ See `AGENTS.md` for the full conventions summary.
