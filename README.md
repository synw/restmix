# Restmix

[![pub package](https://img.shields.io/npm/v/restmix)](https://www.npmjs.com/package/restmix)

A lightweight Typescript friendly requests manager for rest apis

## Features

- ⚡️ **Tiny & typed** — a thin, TypeScript-friendly wrapper around `fetch` with fully typed responses.
- 🔁 **All HTTP methods** — `get`, `post`, `put`, `patch`, `del`.
- 🍪 **CSRF ready** — read the CSRF token from a cookie or set it manually; custom cookie/header names supported.
- 🧷 **Custom headers** — add/remove per-request headers without touching any global state.
- 🔗 **Response hooks** — transform responses before they reach your code via `onResponse`.
- 📡 **SSE streaming** — stream Server-Sent Events with `postSse`.
- 🧬 **Composable** — a simple factory returning a self-contained api instance (closure state, no globals).

## Documentation

### For AI Agents
- [Codebase Summary](https://github.com/synw/restmix/raw/refs/heads/main/.agents/documentation/codebase-summary.md) — Machine-readable technical summary of this module
- [Decision Tree](https://github.com/synw/restmix/raw/refs/heads/main/.agents/documentation/decision-tree.md) — Router mapping a task to the exact doc/source file you need
- [Project Overview](https://github.com/synw/restmix/raw/refs/heads/main/.agents/documentation/project-overview.md) — Concise high-level context
- [Project Navigation](https://github.com/synw/restmix/raw/refs/heads/main/.agents/documentation/project-nav.md) — Canonical deep reference (conventions, snippets, maps)
- [API Contracts](https://github.com/synw/restmix/raw/refs/heads/main/lat.md/api-contracts.md) — Exact signatures of the public surface
- [Architecture](https://github.com/synw/restmix/raw/refs/heads/main/lat.md/architecture.md) — Mental model: composable factory, closure state, request pipeline

### For Humans
- [Documentation Site](https://synw.github.io/restmix) — Published Vite/Vue docs

## Installation

```bash
npm install restmix
```

## Quick Start

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
  // status code is in the 200/299 range
  const data: TodoItemContract = res.data;
} else {
  // status code is > 299
  const responseStatus: number = res.status;
  throw new Error(res.statusText)
}
```

It is the same as [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) except that it takes care of the response
body parsing and delivers typed data

```ts
interface ApiResponse<T = Record<string, any> | Array<any>> {
  ok: boolean;
  url: string;
  headers: Record<string, string>;
  status: number;
  statusText: string;
  data: T;
  text: string;
}
```

## Usage

### Basic requests

`get`, `post`, `put`, `patch`, and `del` all return a `Promise<ApiResponse<T>>`.

```ts
const users = await api.get<User[]>("/users");
const created = await api.post<User>("/users", { name: "Ada" });
await api.put<User>(`/users/${created.id}`, { name: "Ada Lovelace" });
await api.patch<User>(`/users/${created.id}`, { active: true });
await api.del(`/users/${created.id}`);
```

### Configuring `useApi`

Pass options to control the request pipeline. All are optional (defaults shown):

```ts
const api = useApi({
  serverUrl: "https://api.example.com", // prepended to every uri
  csrfCookieName: "csrftoken",          // cookie read by the CSRF helpers
  csrfHeaderKey: "X-CSRFToken",         // header the token is sent in
  credentials: "include",               // "omit" | "include" | "same-origin" | null
  mode: "cors",                         // "cors" | "no-cors" | "same-origin" | "navigate"
});
```

`serverUrl` is prepended to every `uri`, so `api.get("/users")` becomes a request to `https://api.example.com/users`.

### CSRF protection

```ts
// Pull the token from your session cookie (returns true if found):
if (api.hasCsrfCookie()) {
  api.setCsrfTokenFromCookie(/* verbose */ true);
}

// ...or set it explicitly:
api.setCsrfToken(token);

// Use custom cookie/header names:
const api = useApi({
  csrfCookieName: "my_csrf_cookie",
  csrfHeaderKey: "X-Custom-CSRF-Token",
});
```

### Custom headers

```ts
api.addHeader("Authorization", `Bearer ${token}`);
// ...later, remove it again:
api.removeHeader("Authorization");
```

### Response hooks

Register a hook to transform any response before it is returned:

```ts
api.onResponse(async (res) => {
  // e.g. unwrap a `{ data: ... }` envelope
  return res;
});
```

### Streaming Server-Sent Events

```ts
const controller = new AbortController();

await api.postSse<{ message: string }>(
  "/events/stream",
  { id: 1 },
  (chunk) => console.log("event:", chunk),
  controller,
);

// abort the stream early, if needed:
controller.abort();
```

## API Reference

### `useApi(params?: UseApiParams)`

Returns a self-contained api instance. Parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `serverUrl` | `string` | `""` | Prepended to every `uri`. |
| `csrfCookieName` | `string` | `"csrftoken"` | Cookie the CSRF helpers read. |
| `csrfHeaderKey` | `string` | `"X-CSRFToken"` | Header the token is sent in. |
| `credentials` | `"omit" \| "include" \| "same-origin" \| null` | `"include"` | Value passed to `fetch`. |
| `mode` | `"cors" \| "no-cors" \| "same-origin" \| "navigate"` | `"cors"` | Value passed to `fetch`. |

### HTTP methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `get` | `<T>(uri: string, verbose?: boolean) => Promise<ApiResponse<T>>` | GET request. |
| `post` | `<T>(uri: string, payload: Array<any> \| Record<string, any> \| FormData, multipart?: boolean, verbose?: boolean) => Promise<ApiResponse<T>>` | POST request (JSON by default; pass `multipart: true` for `FormData`). |
| `put` | `<T>(uri: string, payload: Array<any> \| Record<string, any>, verbose?: boolean) => Promise<ApiResponse<T>>` | PUT request. |
| `patch` | `<T>(uri: string, payload: Array<any> \| Record<string, any>, verbose?: boolean) => Promise<ApiResponse<T>>` | PATCH request. |
| `del` | `<T>(uri: string, verbose?: boolean) => Promise<ApiResponse<T>>` | DELETE request. |
| `postSse` | `<T>(uri: string, payload: Array<any> \| Record<string, any> \| FormData, onChunk: (payload: T) => void, abortController: AbortController, parseJson?: boolean, multipart?: boolean, verbose?: boolean, debug?: boolean) => Promise<void>` | POST with SSE streaming; adds `Accept: text/event-stream` automatically. |

### Instance helpers

| Helper | Description |
|--------|-------------|
| `csrfToken()` | Returns the currently set CSRF token, or `null`. |
| `hasCsrfCookie()` | Whether the CSRF cookie is present in `document.cookie`. |
| `setCsrfToken(token)` | Set a CSRF token used in request headers. |
| `setCsrfTokenFromCookie(verbose?)` | Read the CSRF token from a cookie and set it; returns `true` if found. |
| `addHeader(key, val)` | Add a per-request extra header. |
| `removeHeader(key)` | Remove an added header. |
| `onResponse(hook)` | Register a response transform hook. |

### `ApiResponse<T>`

```ts
interface ApiResponse<T = Record<string, any> | Array<any>> {
  ok: boolean;        // status in the 200/299 range
  url: string;        // resolved request url (serverUrl + uri)
  headers: Record<string, string>;
  status: number;
  statusText: string;
  data: T;            // parsed JSON body (empty for non-JSON / 204 responses)
  text: string;       // raw response text
}
```

### `UseApiParams`

```ts
interface UseApiParams {
  serverUrl?: string;
  csrfCookieName?: string;
  csrfHeaderKey?: string;
  credentials?: "omit" | "include" | "same-origin" | null;
  mode?: "cors" | "no-cors" | "same-origin" | "navigate";
}
```

## Important Notes

- **Browser-oriented.** Restmix relies on the global `fetch` and reads cookies from `document.cookie` (via its runtime dependency [`js-cookie`](https://www.npmjs.com/package/js-cookie)). The CSRF helpers will throw `"Csrf cookie not found"` when no cookie is present, and require a browser/`document` environment.
- **Response parsing.** Non-JSON responses are captured in `res.text` rather than parsed into `res.data`. `204 No Content` responses skip body parsing entirely.
- **Instance state** (extra headers, CSRF token) lives in the closure returned by `useApi` — it is per-instance, not global.

## License

[MIT](https://github.com/synw/restmix/blob/main/LICENSE)