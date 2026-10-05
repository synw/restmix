# Restmix — Project Overview

> **Role**: Concise "what is this" for context loading (~1 page overview).
> **See also**: `.agents/documentation/decision-tree.md` to find the right doc for your task.
> **See also**: `.agents/documentation/project-nav.md` for detailed navigation and task references.

---

## What is Restmix?

Restmix is a lightweight, TypeScript-friendly HTTP client library for REST APIs. It wraps the native `fetch` API to deliver typed responses with automatic body parsing, CSRF token management, Server-Sent Events (SSE) streaming, custom header injection/removal, and response hooks — all with a single runtime dependency (`js-cookie`).

---

## Core Capabilities

- **Typed HTTP methods** — GET, POST, PUT, PATCH, DELETE with TypeScript generics via `ApiResponse<T>`
- **SSE streaming** — `postSse()` streams server-sent events through an `AbortController`
- **CSRF management** — reads CSRF tokens from cookies (`csrftoken` / `X-CSRFToken`), configurable
- **Custom headers** — add/remove headers per client instance via `addHeader` / `removeHeader`
- **Response hooks** — `onResponse()` intercepts and transforms responses before return
- **Automatic parsing** — JSON or text body parsing based on `Content-Type`; dual build output (ESM + minified IIFE)

---

## Repository Structure

| Module | Path | Purpose |
|--------|------|---------|
| `restmix` | `src/` | Core library: `useApi()` composable HTTP client |
| `test/server` | `test/server/` | Express.js mock server for integration tests (port 5714) |
| `docsite` | `docsite/` | Vite + Vue.js documentation website source |

---

## Key Architecture Patterns

- **Composable factory**: `useApi()` returns a client object with bound HTTP methods, configured via params (serverUrl, CSRF settings, credentials). No class instances.
- **Generic typed responses**: All HTTP methods use `<T>` generics; `ApiResponse<T>` carries `ok`, `url`, `headers`, `status`, `statusText`, typed `data`, and raw `text`.
- **Response hook middleware**: `onResponse(hook)` intercepts responses before return, enabling transformation or side effects.
- **Minimal dependencies**: Only `js-cookie` as a runtime dependency; everything else is dev-only (TypeScript, Rollup, Jest, TypeDoc).
- **Dual build output**: Rollup emits ESM (`dist/main.js`) for bundlers and minified IIFE (`dist/main.min.js`, exposed as global `$api`) for direct browser use.

---

## Quick Reference: Common Tasks

| Task | Go To |
|------|------|
| Understand the project (this doc) | `.agents/documentation/project-overview.md` |
| Full navigation map & architecture | `.agents/documentation/project-nav.md` |
| Structured technical summary | `.agents/documentation/codebase-summary.md` |
| Modify HTTP methods / core logic | `src/api.ts` |
| Add or change types | `src/interfaces.ts` |
| Run tests (integration) | `npm test` — starts Express server, runs Jest on `test/test.ts` |
| Build library | `npm run build` — Rollup → `dist/` |
| Update documentation examples | `docsite/src/views/` |

---

## Code Snippets

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

await api.postSse<{ message: string }>("/stream", { query: "search" }, (chunk) =>
  console.log("Got:", chunk),
  controller,
);

// Stop streaming
controller.abort();
```

### Response hook
```ts
const api = useApi();

api.onResponse((res) => {
  if (!res.ok) {
    console.warn(`Request to ${res.url} failed: ${res.status}`);
  }
  return res; // must return modified response
});
```

---

## Documentation Links

| Resource | Path |
|----------|------|
| Decision tree (find the right doc) | `.agents/documentation/decision-tree.md` |
| Project overview (this doc) | `.agents/documentation/project-overview.md` |
| Navigation map & architecture | `.agents/documentation/project-nav.md` |
| Codebase summary | `.agents/documentation/codebase-summary.md` |
| npm package | https://www.npmjs.com/package/restmix |
| GitHub repo | https://github.com/synw/restmix |
| Live doc site | https://synw.github.io/restmix |
| Doc site source | `docsite/` |
