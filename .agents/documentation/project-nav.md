> **Primary reference** — Comprehensive navigation map for the project.

# Restmix — Project Navigation Map

## 1. Project Overview

Restmix is a lightweight, TypeScript-friendly HTTP client library for REST APIs. It wraps the native `fetch` API to provide typed responses with automatic body parsing, CSRF token management, Server-Sent Events (SSE) streaming, custom headers, and response hooks.

| Module | Purpose |
|--------|---------|
| `restmix` (src/) | Core library: `useApi()` composable for HTTP requests |
| `test/server` | Express.js mock server for integration testing |
| `docsite` | Vite-built documentation website source |

**Core capabilities:**
- GET, POST, PUT, PATCH, DELETE HTTP methods with TypeScript generics
- Server-Sent Events (SSE) streaming via `postSse()`
- CSRF token management from cookies with configurable names/headers
- Custom header injection/removal
- Response hooks for interception and transformation
- Automatic JSON/text body parsing based on Content-Type
- Dual build output: ESM bundle + minified IIFE

## 2. Architecture Principles

| Principle | Detail | Key Files |
|-----------|--------|-----------|
| Composable factory | `useApi()` returns a client object, not a class instance | `src/api.ts` |
| Generic typing | All methods use `<T>` for typed responses via `ApiResponse<T>` | `src/interfaces.ts` |
| Hook middleware | `onResponse()` allows response interception before return | `src/api.ts` |
| Minimal dependencies | Only `js-cookie` as runtime dependency | `package.json` |
| Dual build output | ESM for bundlers, IIFE for direct browser use | `rollup.config.js` |

## 3. Dependency Graph

```
                    ┌─────────────┐
                    │  src/api.ts  │
                    │  (useApi)    │
                    └──────┬───────┘
                           │ uses
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        fetch API    js-cookie    src/interfaces.ts
        (native)     (CSRF)      (types)
```

**Prose:** The core `api.ts` depends on the native `fetch` API for all HTTP operations, `js-cookie` for CSRF token retrieval, and exports types defined in `interfaces.ts`. The `main.ts` re-exports everything for clean public API. The test server (`test/server/`) is an independent Express app used only for integration tests.

## 4. Packages/Modules

### `restmix` (src/)
- **Purpose**: Core HTTP client library
- **Key files**:
  - `src/api.ts` — `useApi()` composable implementation
  - `src/interfaces.ts` — TypeScript type definitions
  - `src/main.ts` — Public re-exports
- **Key types/classes**:
  - `useApi(params?: UseApiParams)` — Factory function returning API client
  - `ApiResponse<T>` — Typed response envelope (ok, url, headers, status, statusText, data, text)
  - `UseApiParams` — Config params (serverUrl, csrfCookieName, csrfHeaderKey, credentials, mode)
  - `OnResponseHook` — Response interception type
  - `RequestCredentials`, `RequestMode` — Fetch option types

### `test/server`
- **Purpose**: Express.js mock server providing REST endpoints for integration tests
- **Key files**:
  - `test/server/src/index.ts` — Express app with mock endpoints (/, /204, /401, /403, /post, /put, /patch)
  - `test/server/package.json` — Express dependencies (body-parser, cors, helmet, morgan, etc.)
- **Key types/classes**:
  - Express `App` instance on port 5714

### `docsite`
- **Purpose**: Vite + Vue.js documentation website source
- **Key files**:
  - `docsite/src/App.vue` — Root Vue component
  - `docsite/src/main.ts` — Vue app entry point
  - `docsite/src/router.ts` — Vue Router config
  - `docsite/src/conf.ts` — Doc site configuration
  - `docsite/src/views/` — Documentation views (API keys, CSRF, extra headers, HTTP method examples)
  - `docsite/src/components/` — Reusable UI components (header, nav, sidebar)
  - `docsite/src/widgets/` — Content rendering widgets (Markdown, TypeScript code display)
- **Key types/classes**:
  - Vue Router-based SPA with dynamic Markdown/TypeScript code rendering

## 5. Server

### Test Server (`test/server/`)
- **Routes**:
  | Route | Method | Response |
  |-------|--------|----------|
  | `/` | GET | `{ "response": "ok" }` |
  | `/text` | GET | plain text (`Content-Type: text/plain`) |
  | `/invalid-json` | GET | `{ "invalid json` (200, malformed JSON) |
  | `/204` | GET | 204 No Content |
  | `/401` | GET | 401 Unauthorized |
  | `/403` | GET | `{ "ok": false }` |
  | `/csrf-set` | GET | sets `csrftoken` cookie, returns `{ "csrf": "test-token" }` |
  | `/headers` | GET | echoes request headers |
  | `/post` | POST | `{ "response": "ok" }` |
  | `/put` | PUT | `{ "response": "ok" }` |
  | `/patch` | PATCH | `{ "response": "ok" }` |
  | `/del` | DELETE | `{ "response": "ok" }` |
  | `/del/404` | DELETE | 404 `{ "error": "not found" }` |
- **Key files**: `test/server/src/index.ts`, `test/server/package.json`
- **Patterns**: Express middleware (cors, helmet, morgan, body-parser, dotenv); port configurable via `PORT` env (default 5714)

## 6. Plugins

Not applicable — this is a library, not a plugin framework.

## 7. UI

### Docsite (`docsite/`)
- **Components**:
  - `TheHeader.vue` — Site header
  - `TheNav.vue` — Main navigation
  - `TheSidebar.vue` — Sidebar navigation
  - `LoadingSpinner.vue` — Loading indicator widget
- **Views** (documentation pages):
  - `HomeView.vue` — Landing page
  - `ApiKeyView.vue` — API key authentication docs
  - `CsrfView.vue` — CSRF token management docs
  - `ExtraHeadersView.vue` — Custom headers docs
  - `MdApiFileView.vue` — Markdown API file viewer
  - `ts/TsGetView.vue`, `ts/TsPostView.vue`, `ts/TsPutView.vue`, `ts/TsPatchView.vue`, `ts/TsPostSseView.vue`, `ts/TsErrorView.vue` — TypeScript usage examples
- **Services/Widgets**:
  - `state.ts` — shared app state + API client singletons (`user`, `api`, `apiDemo`) built on `@snowind/state` and `useApi`
  - `env.d.ts` — Vite module declarations (`*.vue`, `*.svg`)
  - `RenderMd.vue`, `RenderMdFile.vue` — Markdown rendering
  - `RenderTs.vue`, `RenderTsFile.vue` — TypeScript code display
- **Assets**: `assets/index.css` — Tailwind CSS entry
- **Themes**: Tailwind CSS (`tailwind.config.js`)
- **Extensions**: TypeDoc plugins (`typedoc-plugin-markdown`, `typedoc-plugin-rename-defaults`)

## 8. Apps

Not applicable — no standalone apps beyond the docsite.

## 9. Code Snippets

### Basic typed GET request
```ts
import { useApi, ApiResponse } from 'restmix';

const api = useApi();

interface TodoItemContract {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const res: ApiResponse<TodoItemContract> = await api.get<TodoItemContract>(
  "https://jsonplaceholder.typicode.com/todos/1",
);
if (res.ok) {
  const data: TodoItemContract = res.data;
} else {
  throw new Error(res.statusText);
}
```

### POST with CSRF token
```ts
const api = useApi({ serverUrl: "https://api.example.com" });
api.setCsrfTokenFromCookie(true); // reads from 'csrftoken' cookie

const res = await api.post<CreateResult>("/items", { name: "New Item" });
```

### SSE streaming
```ts
const controller = new AbortController();

await api.postSse<{ message: string }>(
  "/stream",
  { query: "search" },
  (chunk) => console.log("Got:", chunk),
  controller,
);

// Stop streaming
controller.abort();
```

### Response hook
```ts
const api = useApi();

api.onResponse((res) => {
  // Transform or log responses
  if (!res.ok) {
    console.warn(`Request to ${res.url} failed: ${res.status}`);
  }
  return res; // must return modified response
});
```

### Custom headers
```ts
const api = useApi();
api.addHeader("Authorization", "Bearer token123");
api.addHeader("X-Request-ID", "abc-123");

const res = await api.get<User>("/me");

// Remove header later
api.removeHeader("Authorization");
```

## 10. Navigation Quick Reference

| Task | Path |
|------|------|
| Find main library source | `src/api.ts`, `src/interfaces.ts` |
| Run tests | `npm test` (Jest) |
| Build library | `npm run build` (Rollup → dist/) |
| View docs site | Open `docsite/` — `npm run dev` |
| Run integration test server | `node test/server/dist/index.js` (port 5714) |
| Modify HTTP methods | `src/api.ts` — get, post, put, patch, del, postSse |
| Add new types | `src/interfaces.ts` |
| Change build output | `rollup.config.js` |
| Update documentation examples | `docsite/src/views/` |

## 11. Documentation Links

| Resource | Path |
|----------|------|
| npm package | https://www.npmjs.com/package/restmix |
| GitHub repo | https://github.com/synw/restmix |
| Live doc site | https://synw.github.io/restmix |
| Doc site source | `docsite/` |
| TypeDoc config | `tsconfig.json` (typedocOptions) |
| Project nav | `.agents/documentation/project-nav.md` |
| Codebase summary | `.agents/documentation/codebase-summary.md` |

## 12. Key Conventions & Patterns

- **Naming**: Composable functions use `use` prefix (`useApi`). Types use PascalCase.
- **File structure**: Flat `src/` — one module file, no subdirectories.
- **Build**: Rollup produces two outputs — ESM (`dist/main.js`) and IIFE minified (`dist/main.min.js`, global `$api`).
- **TypeScript**: Targets ES2015, strict mode enabled, declarations emitted to `dist/`.
- **Testing**: Jest with ts-jest; integration tests against Express mock server on port 5714.
- **CSRF default**: Cookie name `csrftoken`, header `X-CSRFToken` — configurable via `UseApiParams`.
- **Response format**: All methods return `ApiResponse<T>` with `ok` boolean, status code, headers, typed `data`, and raw `text`.
- **SSE**: `postSse()` requires an `AbortController`; parses SSE `data:` lines as JSON or raw strings.
