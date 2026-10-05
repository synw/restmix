# restmix

## Summary
TypeScript-friendly `fetch` wrapper that parses responses and delivers typed data through a composable `useApi()`.

## Dependencies
- `js-cookie` — read the CSRF token cookie (browser/Node).
- Build: rollup + `@rollup/plugin-typescript` (ESM + minified IIFE bundles), TypeScript (type declarations).
- Test: jest + ts-jest, `start-server-and-test`, express (mock test server).

## Used By
- `docsite/` — documentation site imports the published `restmix` package to render examples.
- `examples/nodejs.js` — Node usage example imports the built bundle.

## Entry Point
- `src/main.ts` — barrel export of the public API: `useApi`, `UseApiParams`, `ApiResponse`, `OnResponseHook`.

## Key Files
| File | Purpose |
|------|---------|
| `src/api.ts` | Core composable: `useApi()` and HTTP methods, header/CSRF/hook logic, SSE streaming. |
| `src/interfaces.ts` | Public types: `ApiResponse<T>`, `UseApiParams`, `OnResponseHook`, `RequestCredentials`, `RequestMode`. |
| `src/main.ts` | Barrel re-export of the public API surface. |
| `test/test.ts` | Jest integration cases for all methods and helpers. |
| `test/server/src/index.ts` | Express mock server backing the jest suite (port 5714). |
| `rollup.config.js` | Rollup build → `dist/main.js` (esm) + `dist/main.min.js` (iife). |

## Architecture
- `useApi(params)` closure captures config; returns a bound method object.
- All HTTP methods funnel through `_processResponse` for response normalization.
- Headers assembled centrally in `_getBaseHeaders` (CSRF token + extra headers).
- Public surface re-exported via barrel `src/main.ts`.

## Related
- See `AGENTS.md` — project router and doc map.
- See `project-nav.md` — conventions, snippets, dependency graph, module maps.
- Semantic search over design intent → `lat search` (knowledge graph in `lat.md/`).
