# domain-concepts.md — Domain Concepts

The three domains Restmix bridges: the composable-client pattern, REST semantics, and browser-origin security. Understanding these helps developers use the library idiomatically and avoid footguns around CSRF, CORS, and parsing.

## API Client Patterns

Restmix commits to the composable-client (factory) pattern: `useApi` returns a plain object of closure-bound methods, configured once via `UseApiParams` and reused, with per-client state and a stable public surface.

This follows the Vue `use*` composable convention (and React hook style): configure once, reuse, keep per-instance state, expose a minimal stable surface. It contrasts with (a) singleton global-`fetch` wrappers that share mutable global state, and (b) class-based clients such as axios instances, which need `new`, carry prototype inheritance, and bind `this`.

The single interception primitive is the response hook: `onResponse(hook)` stores a hook that `_processResponse` awaits before returning. It mirrors interceptor concepts but is expressed as one optional callback rather than a chain. Link: `[[src/api.ts#useApi]]`, `[[src/api.ts#onResponse]]`. Cross-ref: `[[design-decisions#why-composable-factory-rather-than-a-class]]`.

## REST Principles

The five verbs map cleanly onto REST semantics: `get` (read), `post` (create), `put` (replace), `patch` (partial update), `del` (delete), each returning a uniform `ApiResponse<T>`.

Three REST principles show up in the implementation. **Uniform interface** — every method takes a `uri` relative to the configured `serverUrl`, so resources are addressed relatively (`_serverUrl + uri`). **Content negotiation** — `_processResponse` inspects `Content-Type` to choose JSON vs text, while `_postHeader` sets `application/json` for JSON bodies and omits it for `multipart` (`FormData`). **Statelessness** — no client-side caching or session beyond the optional CSRF token, so each request is self-contained. **Status-aware responses** — `ApiResponse.ok` / `status` / `statusText` let callers branch on REST semantics (a `204` skips parsing entirely). Link: `[[src/api.ts#get]]`, `[[src/api.ts#post]]`, `[[src/api.ts#_processResponse]]`, `[[src/api.ts#_postHeader]]`. Cross-ref: `[[components#http-methods]]`, `[[architecture#request-response-flow]]`.

## Security Considerations

Restmix sits at the intersection of CSRF, CORS, and safe body parsing — three areas where HTTP libraries commonly leak footguns.

- **CSRF.** Token-in-header scheme (Django/DRF): a `csrftoken` cookie is sent back as the `X-CSRFToken` header, opt-in, and cross-origin via `credentials: "include"`. The server owns cookie flags and token rotation. Link: `[[src/api.ts#setCsrfTokenFromCookie]]`.
- **CORS.** `_mode` defaults to `"cors"`; cross-origin flows rely on the server sending appropriate `Access-Control-*` headers (the test server uses `cors({ origin, credentials: true })`).
- **Header injection.** Arbitrary headers via `addHeader` can leak secrets; callers own that risk.
- **Body parsing safety.** Malformed JSON is caught and warned (not thrown); a non-JSON body silently lands in `text` with `data: {}`.
- **SSE.** `postSse` streams unbounded and relies on the caller's `AbortController`; a leaked stream consumes resources. Link: `[[src/api.ts#postSse]]`.

Cross-ref: `[[design-decisions#csrf-approach]]`, `[[test-specs#gaps--observations]]`.

## Environment & Runtime Notes

Restmix's build targets `es2015` yet uses modern runtime features (`Object.entries`, `TextDecoder`, `ReadableStream.getReader()`). These come from the runtime's type library rather than the compiled target, so old environments may need polyfills.

The only runtime dependency is `js-cookie` (for the CSRF cookie); the build is a Rollup dual output (ESM + minified IIFE global `$api`). Link: `[[src/api.ts#_getBaseHeaders]]` (uses `Object.entries`), `[[src/api.ts#postSse]]` (uses `TextDecoder` / `getReader`).

## See Also

For the structure these concepts produced, see `[[architecture]]`; for the rationale behind each choice, see `[[design-decisions]]`; for the functions implementing them, see `[[components]]`; for the types carrying these domain semantics, see `[[api-contracts]]` — specifically `[[src/interfaces.ts#ApiResponse]]` and `[[src/interfaces.ts#UseApiParams]]`.
