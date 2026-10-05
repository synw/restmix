# components.md — Core Components

The small, single-responsibility functions inside the `useApi` closure that together form the client: the HTTP verbs, the response normalizer, the response hook, CSRF helpers, and header management. This section is the component inventory.

## useApi — the Composable Factory

`useApi` binds every component below into one per-client instance: it reads defaults from `UseApiParams`, closes over private state, and returns a plain object of 13 bound members that delegate all HTTP work to the helpers documented below.

Link: `[[src/api.ts#useApi]]`. Cross-ref: `[[architecture#the-composable-pattern]]` for the factory pattern and full member enumeration.

The 13 returned members fall into five roles:

- **HTTP verbs (5):** `get`, `post`, `put`, `patch`, `del` — behavior in the next section.
- **Streaming (1):** `postSse` — § SSE Streaming.
- **Response hook (1):** `onResponse` — § Response Hook.
- **CSRF (4):** `csrfToken`, `hasCsrfCookie`, `setCsrfToken`, `setCsrfTokenFromCookie` — § CSRF Management.
- **Headers (2):** `addHeader`, `removeHeader` — § Header Management.

That is 5 + 1 + 1 + 4 + 2 = **13 members**. The source `return {…}` object enumerates exactly these 13; outlines and `api-contracts` that state "14" miscount the returned object.

## HTTP Methods

Five verbs make up the request surface — `get`, `del`, `post`, `put`, `patch` — plus `postSse`, the sixth, divergent member. Each builds a `RequestInit`, prepends `_serverUrl`, fetches, then normalizes via `_processResponse`.

| Method | Routes through | Body | Content-Type |
| --- | --- | --- | --- |
| `get` | `_getHeader` | none | (none) |
| `del` | `_getHeader` | none | (none) |
| `post` | `_postHeader` | JSON string or `FormData` | `application/json`, or none when `multipart` |
| `put` | `_postHeader` | JSON string or `FormData` | `application/json`, or none when `multipart` |
| `patch` | `_postHeader` | JSON string or `FormData` | `application/json`, or none when `multipart` |

- `post` / `put` / `patch` route through `_postHeader`: the payload is JSON-serialized unless `multipart` is set, in which case the `FormData` is passed through untouched and no `application/json` header is sent.
- `get` / `del` route through `_getHeader` and carry no body.
- Full signatures: `[[api-contracts#useapiclient-return-type]]`.

Link: `[[src/api.ts#get]]`, `[[src/api.ts#post]]`, `[[src/api.ts#put]]`, `[[src/api.ts#patch]]`, `[[src/api.ts#del]]`, `[[src/api.ts#_postHeader]]`, `[[src/api.ts#_getHeader]]`.

## ApiResponse — the Response Envelope

`ApiResponse<T>` is the single envelope every method returns and the I/O type of the `onResponse` hook. The raw `Response` never escapes the factory; its generic `T` defaults to `Record<string, any> | Array<any>`, so `api.get()` works untyped.

Fields: `ok`, `url`, `headers`, `status`, `statusText`, `data`, `text`. The `ok` flag mirrors `response.ok` (200–299), which means a `204 No Content` yields `ok: false`. A `204` also skips body parsing entirely, leaving `data` as `{}` and `text` as `""`; other non-JSON bodies land in `text` while `data` stays `{}`.

Link: `[[src/interfaces.ts#ApiResponse]]`. Cross-ref: `[[architecture#the-response-envelope]]`.

## Response Hook — onResponse

`onResponse` is the library's sole middleware primitive: it stores a hook that `_processResponse` awaits before returning, so callers can log, transform `data`, rewrite status, or short-circuit — without ever touching `fetch`.

`onResponse(hook)` sets `_onResponse`; `_processResponse` awaits it (if present) right before it returns, passing the normalized `ApiResponse<T>` and using whatever it returns. The test suite exercises it by appending `{ modified: true }` to the response.

Link: `[[src/api.ts#onResponse]]`, `[[src/api.ts#_processResponse]]`, `[[src/interfaces.ts#OnResponseHook]]`. Cross-ref: `[[test-specs]]`.

## CSRF Management

CSRF support is an opt-in, token-in-header (Django/DRF) scheme: a token read from a cookie is injected into each request as `X-CSRFToken`, but only when a token has actually been set. Five members coordinate it.

- `hasCsrfCookie()` — returns whether the cookie is readable.
- `_csrfFromCookie()` — reads the cookie, throwing `"Csrf cookie not found"` when absent.
- `setCsrfToken(token)` — direct set of the token.
- `setCsrfTokenFromCookie(verbose?)` — reads the cookie, sets the token, and returns `true`/`false`.
- `csrfToken()` — getter for the current token.

The token is injected only inside `_getBaseHeaders`, under `_csrfHeaderKey` (`X-CSRFToken`), and only when `_csrfToken !== null` — so anonymous requests stay clean. This is a token-in-header scheme (not double-submit), opt-in via `setCsrfToken` / `setCsrfTokenFromCookie`.

Link: `[[src/api.ts#hasCsrfCookie]]`, `[[src/api.ts#_csrfFromCookie]]`, `[[src/api.ts#setCsrfToken]]`, `[[src/api.ts#setCsrfTokenFromCookie]]`, `[[src/api.ts#csrfToken]]`. Cross-ref: `[[architecture#state-management-via-closures]]`, `[[design-decisions#csrf-approach]]`, `[[domain-concepts#security-considerations]]`.

## Header Management

`addHeader` and `removeHeader` let callers persist headers on the client: they mutate the closure's `_extraHeaders`, flip a `_hasExtraHeaders` flag, and are merged into every request by `_getBaseHeaders`.

`addHeader(key, val)` sets the header and marks `_hasExtraHeaders = true`; `removeHeader(key)` deletes it and clears the flag once no headers remain.

Link: `[[src/api.ts#addHeader]]`, `[[src/api.ts#removeHeader]]`. Cross-ref: `[[test-specs]]`, `[[architecture#state-management-via-closures]]`.

## SSE Streaming — postSse

`postSse` is the sixth, divergent member: rather than returning an `ApiResponse`, it streams a `text/event-stream` body through a `TextDecoder`, strips SSE framing, and forwards each event to a caller-supplied `onChunk` callback.

It adds `Accept: text/event-stream`, builds POST options via `_postHeader`, attaches an `AbortController` signal, calls `fetch`, and streams `response.body` with `response.body.getReader()`. Each chunk is decoded via `TextDecoder`, SSE framing is stripped with the regex `/data: |\n\n(?=$)/g`, and each event is optionally `JSON.parse`d when `parseJson` is true. It returns `Promise<void>`; the caller owns and must abort the stream. The framing regex is fragile (no real SSE line splitting) and this path is untested — see `[[test-specs]]`.

Link: `[[src/api.ts#postSse]]`.

## Component Interaction Summary

The components form one linear pipeline: the factory dispatches to a verb, merges base headers at a single choke point, then fetches and normalizes the `Response` through the envelope and hook before returning.

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

Link: `[[src/api.ts#_getBaseHeaders]]`.
