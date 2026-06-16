# restmix

## Summary
A lightweight TypeScript HTTP client library that wraps `fetch` with typed responses, CSRF management, SSE streaming, and response hooks.

## Dependencies
- Internal: none
- External: `js-cookie` (CSRF cookie access)
- Dev: TypeScript, Rollup, Jest, TypeDoc

## Used By
- `docsite` — consumes built library for documentation examples
- `test/server` — tested against via integration tests

## Entry Point
- `src/main.ts` — re-exports `useApi`, `UseApiParams`, `ApiResponse`, `OnResponseHook`
- `dist/main.js` — ESM bundle (published to npm)
- `dist/main.min.js` — minified IIFE bundle (exposed as `$api`)

## Key Files
| File | Purpose |
|------|---------|
| `src/api.ts` | Core `useApi()` composable: HTTP methods, SSE, CSRF, headers, hooks |
| `src/interfaces.ts` | TypeScript types: `UseApiParams`, `ApiResponse<T>`, `OnResponseHook` |
| `src/main.ts` | Entry point: re-exports all public API and types |
| `rollup.config.js` | Build config: ESM + minified IIFE outputs |
| `jest.config.ts` | Jest test runner config with ts-jest |
| `test/test.ts` | Integration test suite for HTTP methods and features |
| `test/server/src/index.ts` | Express mock server for integration tests |

## Architecture
- **Composable factory**: `useApi()` returns a client object with bound HTTP methods, configured via params (serverUrl, CSRF settings, credentials).
- **Generic typed responses**: All HTTP methods use `<T>` generics; `ApiResponse<T>` carries status, headers, and parsed data.
- **Response hook middleware**: `onResponse(hook)` intercepts responses before return, enabling transformation or side effects.
- **Dual output build**: Rollup emits ESM (`dist/main.js`) for bundlers and IIFE (`dist/main.min.js`) for direct browser use.

## Related
- See `test/server` — Express server providing mock REST endpoints for integration tests
- See `docsite` — Vite-based documentation site showcasing library usage

## Documentation
| Resource | Path |
|----------|------|
| npm package | https://www.npmjs.com/package/restmix |
| GitHub repo | https://github.com/synw/restmix |
| Doc site source | `docsite/` |
| TypeDoc config | `tsconfig.json` (typedocOptions section) |
