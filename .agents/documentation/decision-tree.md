# Documentation Decision Tree

> Quick guide: What to read based on your task.
> For most tasks this file alone is enough — follow the path and open the source file directly.

## I need to understand the project

- High-level overview → `.agents/documentation/project-overview.md`
- Full navigation map & deep reference → `.agents/documentation/project-nav.md`
- Structured technical summary → `.agents/documentation/codebase-summary.md`

## I need to work on a specific area

| Area | Go To |
|------|-------|
| Public API / exports (barrel) | `src/main.ts` |
| Core composable `useApi()` + HTTP methods | `src/api.ts` |
| Public types (`ApiResponse`, `UseApiParams`, hooks) | `src/interfaces.ts` |
| Jest tests + express test server | `test/test.ts`, `test/server/src/index.ts` |
| Build (rollup → `dist/`) | `rollup.config.js`, `tsconfig.json` |
| Documentation site (Vite/Vue) | `docsite/` |

Open the file to work on an area.

## Common Tasks (Quick Reference)

| Task | Go To |
|------|-------|
| Add or change an HTTP method (get/post/put/patch/del) | `src/api.ts` (`get`, `post`, `put`, `patch`, `del`) |
| Add per-request / extra headers | `src/api.ts` (`addHeader`, `removeHeader`, `_getBaseHeaders`) |
| Configure CSRF handling | `src/api.ts` (`setCsrfToken`, `setCsrfTokenFromCookie`, `hasCsrfCookie`) + `src/interfaces.ts` (`UseApiParams`) |
| Add an on-response transform hook | `src/api.ts` (`onResponse`) + `src/interfaces.ts` (`OnResponseHook`) |
| Stream a Server-Sent Events response | `src/api.ts` (`postSse`) |
| Change build output / bundle format | `rollup.config.js` (ESM + IIFE) |
| Run the test suite | `npm test` (starts `test/server`, runs jest) |
| Add or change a test | `test/test.ts` (+ express route in `test/server/src/index.ts`) |

→ Conventions & patterns: `.agents/documentation/project-nav.md` § Key Conventions & Patterns.
