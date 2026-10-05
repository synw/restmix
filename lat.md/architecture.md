# architecture.md — Architecture Overview

How Restmix is put together: one composable factory (`useApi`) using closures for per-client state, returning a plain object of bound HTTP methods. Covers the factory pattern, closure state, and request pipeline — the whole-library mental model.

## Architecture Overview

One composable factory (`useApi`) plus closure-scoped state: no classes, no prototypes, per-client isolation. The subsections below walk the pattern, the state, the request flow, and the response envelope.

### The Composable Pattern

`useApi` is a **factory function, not a class** — no `extends`, no prototype chain, no `new`. Each call returns an isolated client whose 13 bound members close over private per-client state, so independent clients coexist.

The `use` prefix follows the Vue "composable" convention. The returned object's 13 bound members: `csrfToken`, `hasCsrfCookie`, `setCsrfToken`, `setCsrfTokenFromCookie`, `addHeader`, `removeHeader`, `onResponse`, `get`, `post`, `put`, `patch`, `del`, `postSse`.

Link: `[[src/api.ts#useApi]]` · see also `[[components#useApi--the-composable-factory]]`, `[[design-decisions#why-composable-factory-rather-than-a-class]]`.

> Note: the source returns 13 members (the enumerated list above). Outlines that state "14" appear to miscount the returned object.

### State Management via Closures

All client state lives as closure-scoped `let` variables inside the factory body — never as properties on the returned object, so it is not enumerable or visible via `Object.keys()` and is reached only through accessor/mutator closures.

| State | Role |
| --- | --- |
| `_serverUrl` | base URL prepended to every `uri` |
| `_csrfCookieName` | name of the server-provided CSRF cookie |
| `_csrfHeaderKey` | header key the token is injected into (`X-CSRFToken`) |
| `_mode` | fetch `mode` (`cors` default) |
| `_credentials` | fetch `credentials` (`include` default, or `null`) |
| `_csrfToken` | current token (`null` ⇒ no CSRF header) |
| `_extraHeaders` / `_hasExtraHeaders` | user-added headers + presence flag |
| `_onResponse` | optional response hook |

Link: `[[src/api.ts#useApi]]`, `[[src/api.ts#csrfToken]]`, `[[src/api.ts#setCsrfTokenFromCookie]]`. Cross-ref: `[[components#csrf-management]]`, `[[api-contracts]]`.

### Request/Response Flow

Every request follows the same pipeline: build a `RequestInit`, prepend `_serverUrl`, call `fetch`, hand the `Response` to `_processResponse`, then run the optional hook.

Header assembly is a single choke point — `_getBaseHeaders` merges the CSRF token (only when `_csrfToken !== null`) with any extra headers (only when `_hasExtraHeaders`). `_processResponse` normalizes the raw `Response` into an `ApiResponse<T>`, and the `OnResponseHook` receives that normalized response and returns a transformed one.

Link: `[[src/api.ts#_getBaseHeaders]]`, `[[src/api.ts#_processResponse]]`, `[[src/interfaces.ts#OnResponseHook]]`. Cross-ref: `[[components]]`, `[[domain-concepts#rest-principles]]`.

### The Response Envelope

`ApiResponse<T>` is the single shape consumers ever see — the raw `Response` never escapes the factory. It packs seven fields (`ok, url, headers, status, statusText, data, text`); `ok` mirrors `response.ok`, so a `204 No Content` yields `ok:false`.

Link: `[[src/interfaces.ts#ApiResponse]]`.

## Request Pipeline Diagram

End-to-end view of one request: URL assembly, header merge at `_getBaseHeaders`, fetch, normalization in `_processResponse`, and the optional hook; `postSse` diverges from this pipeline at the bottom.

```
                       useApi closure (per-client state)
       ┌───────────────────────────────────────────────────────────────┐
       │                                                                 │
  uri ─┼─▶ url = _serverUrl + uri                                       │
       │                                                                 │
  ┌────┴─────┐                                                            │
  │ payload  │  (get/del: none)                                          │
  └────┬─────┘                                                            │
       ▼                                                                  │
  _postHeader / _getHeader  ─▶  RequestInit (method, mode, body)          │
       │                                                                  │
       ▼                                                                  │
  _getBaseHeaders                                                         │
   ├─ if _csrfToken !== null: headers[_csrfHeaderKey] = _csrfToken        │
   └─ if _hasExtraHeaders:    merge _extraHeaders                         │
       │                                                                  │
       ▼                                                                  │
  fetch(url, opts)  ──────────────▶  Response                            │
       │                                                                  │
       ▼                                                                  │
  _processResponse<T>  ─▶  ApiResponse<T>  { ok, url, headers,           │
       │                                  status, statusText, data, text }
       │                                                                  │
       ▼                                                                  │
  _onResponse hook (if set)  ─▶  transformed ApiResponse<T>               │
       │                                                                  │
       ▼                                                                  │
  Promise<ApiResponse<T>> returned to caller                             │
       └───────────────────────────────────────────────────────────────┘

  postSse diverges from the pipeline above:
    fetch → response.body.getReader() → TextDecoder
          → strip SSE framing (/data: |\n\n(?=$)/g) → onChunk(payload)
    returns Promise<void>; caller owns the AbortController.
    Link: [[src/api.ts#postSse]]  (untested — see [[test-specs]])
```

## What This Section Covers / Not

This section covers the **mental model and topology** of Restmix: the composable factory pattern, closure-based state, the request/response flow, and the response envelope. Per-method signatures live in `[[components]]`; type shapes in `[[api-contracts]]`.

For the reasoning behind these structural choices, see `[[design-decisions]]`; for the three domains this architecture touches, see `[[domain-concepts]]`.
