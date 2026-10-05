# Restmix — Project Navigation Map

> Purpose: Single-reference map for AI coding agents to understand, navigate, and modify the Restmix codebase.

---

## 1. Project Overview

Single-repo TypeScript library (`restmix`) that wraps `fetch` and delivers typed REST responses via a composable `useApi()`. Source lives in `src/`; tests + express mock server in `test/`; build via rollup to `dist/`; documentation site in `docsite/`.

| Path | Purpose |
|------|---------|
| `src/main.ts` | Barrel export of the public API surface. |
| `src/api.ts` | Core `useApi()` composable and HTTP methods. |
| `src/interfaces.ts` | Public types (`ApiResponse`, `UseApiParams`, hooks). |
| `test/test.ts` | Jest integration suite. |
| `test/server/src/index.ts` | Express mock server for tests (port 5714). |
| `rollup.config.js` | Rollup build config (ESM + IIFE). |
| `docsite/` | Vite/Vue documentation site (separate package). |

---

## 2. Architecture Principles

The canonical "why" layer lives in the knowledge graph — do not restate it here:

- Mental model (composable factory, closure state, request pipeline) → `lat.md/architecture.md`
- Rationale & trade-offs (factory vs class, fetch wrapper, CSRF scheme) → `lat.md/design-decisions.md`
- Find the right section with `lat search "<task>"`.

File-level summary: all runtime logic (`useApi`, HTTP methods, `_processResponse`, `_getBaseHeaders`) lives in `src/api.ts`; public types live in `src/interfaces.ts`; the barrel `src/main.ts` re-exports both.

---

## 3. Dependency Graph

```
                        ┌──────────────────────┐
                        │       src/main.ts     │  (barrel export)
                        └────────────┬───────────┘
                                     │ re-exports
                          ┌──────────┴───────────┐
                          ▼                      ▼
                   ┌──────────────┐       ┌──────────────────┐
                   │    src/api.ts│       │  src/interfaces.ts │
                   └──────┬───────┘       └──────────────────┘
                          │ uses fetch + js-cookie
                          ▼
                external: window.fetch, js-cookie (cookies)
```

Prose: `main.ts` re-exports the public surface from `api.ts` (runtime) and `interfaces.ts` (types). `api.ts` depends on `js-cookie` for CSRF cookie reads and on the platform `fetch`. `interfaces.ts` has no internal dependencies.

---

## 4. Packages / Modules

### `src` — library core
- **Purpose**: The `restmix` package entry; ships ESM + IIFE bundles to `dist/`.
- **Key files**: `main.ts`, `api.ts`, `interfaces.ts`.
- **Key types**: `ApiResponse<T>`, `UseApiParams`, `OnResponseHook`, `RequestCredentials`, `RequestMode`.
- **Key functions**: `useApi()`; methods `get`, `post`, `put`, `patch`, `del`, `postSse`; helpers `addHeader`, `removeHeader`, `onResponse`, `setCsrfToken`, `setCsrfTokenFromCookie`, `hasCsrfCookie`, `csrfToken`.

### `test` — integration suite
- **Purpose**: Jest tests backed by an express mock server.
- **Key files**: `test/test.ts` (26 cases), `test/server/src/index.ts` (mock server).
- **Notes**: Test server listens on port 5714; `npm test` starts it via `start-server-and-test`.

### `docsite` — documentation site
- **Purpose**: Vite/Vue site rendering the public docs; consumes published `restmix`.
- **Key files**: `docsite/package.json`, `docsite/vite.config.ts`.
- **Notes**: Separate package with its own deps; not consumed by the library build.

### `docs/apidoc` — generated API reference
- **Purpose**: typedoc-generated API docs (`install.md`, `how.md`, `options.md`, `response.md`).
- **Notes**: Regenerate with `npm run docs`.

---

## 5. Test Server Routes (`test/server/src/index.ts`)

| Method | Route | Response |
|--------|-------|----------|
| GET | `/` | `{ "response": "ok" }` |
| GET | `/text` | plain text (Content-Type: text/plain) |
| GET | `/invalid-json` | malformed JSON with 200 status |
| GET | `/204` | 204 no content |
| GET | `/401` | 401 |
| GET | `/403` | `{ "ok": false }` |
| POST | `/post` | `{ "response": "ok" }` |
| PUT | `/put` | `{ "response": "ok" }` |
| PATCH | `/patch` | `{ "response": "ok" }` |
| DELETE | `/del` | `{ "response": "ok" }` |
| DELETE | `/del/404` | 404 `{ "error": "not found" }` |
| GET | `/csrf-set` | sets `csrftoken` cookie, returns `{ "csrf": "test-token" }` |
| GET | `/headers` | echoes request headers |

---

## 6. Code Snippets

### Basic typed GET
```ts
import { useApi, ApiResponse } from 'restmix';

const api = useApi();

const res: ApiResponse<TodoItemContract> = await api.get<TodoItemContract>(
  "https://jsonplaceholder.typicode.com/todos/1",
);
if (res.ok) {
  const data: TodoItemContract = res.data; // parsed + typed
} else {
  const status: number = res.status;
  throw new Error(res.statusText);
}
```

### Config, custom headers, and onResponse hook
```ts
const api = useApi({
  serverUrl: "https://api.example.com",
  csrfCookieName: "csrftoken",
  csrfHeaderKey: "X-CSRFToken",
  credentials: "include",
  mode: "cors",
});

api.setCsrfTokenFromCookie();          // read CSRF token from cookie
api.addHeader("X-Custom", "value");    // per-request extra header

api.onResponse(async (res) => {        // transform before returning
  res.data = { ...res.data, modified: true };
  return res;
});
```

### Server-Sent Events streaming
```ts
const controller = new AbortController();
await api.postSse<TodoItemContract>(
  "/stream",
  { id: 1 },
  (chunk) => console.log("chunk:", chunk),
  controller,
);
```

---

## 7. Documentation Links

| Resource | URL |
|----------|-----|
| npm package | https://www.npmjs.com/package/restmix |
| GitHub repository | https://github.com/synw/restmix |
| Live documentation site | https://synw.github.io/restmix |
| Local generated API reference | `docs/apidoc/` (run `npm run docs`) |

---

## 8. Key Conventions & Patterns

| Convention | Detail |
|------------|--------|
| ESM + `.js` import extensions | Source uses TS with ESM; imports reference `.js` extensions even from `.ts` files (e.g. `import { useApi } from "./api.js"`). |
| Types separated from values | Public types live in `interfaces.ts`; runtime logic in `api.ts`; barrel re-exports both from `main.ts`. |
| Composable closure config | `useApi(params)` captures config via closure defaults; params override sensible defaults (CSRF cookie `csrftoken`, header `X-CSRFToken`, credentials `include`). |
| Single response pipeline | Every method calls `_processResponse`, which normalizes headers, parses JSON vs. text, skips body for `204`, and applies the onResponse hook. |
| Header merging | `_getBaseHeaders` injects the CSRF token (when set) then any extra headers added via `addHeader`. |
| Verbose logging | HTTP methods accept a `verbose` flag that logs method + URL + options; jest spies on `console` to assert it. |
| JSON-by-default bodies | POST/PUT/PATCH send `Content-Type: application/json`; pass `multipart=true` to send `FormData`. |
| Test contract via express | `test/server` exposes one route per documented behavior on port 5714; jest integration suite (`test/test.ts`) drives the real methods against it. |
| Typedoc for API docs | `tsconfig.json` carries `typedocOptions`; `npm run docs` generates `docs/apidoc/`. |
