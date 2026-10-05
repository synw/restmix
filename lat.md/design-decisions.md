# design-decisions.md — Design Decisions

Why Restmix is built this way: the reasoning behind the composable (factory) pattern, the wrapper-around-`fetch` choice, and the token-in-header CSRF scheme — plus the trade-offs developers will inherit.

## Unifying Goal

Restmix makes typed `fetch` usage declarative and safe by moving repetitive, error-prone HTTP work — parsing, CSRF, headers, streaming — into one shared, testable layer. Every decision below flows from this single goal.

The goal has two halves: **safety** (compile-time generic typing flowing into `ApiResponse<T>`) and **convenience** (one call handles parsing, cookies, and hooks). Nothing in this section survives unless it serves one of those halves.

## Why Composable (Factory) Rather Than a Class?

`useApi` returns a plain object of closure-bound functions rather than a class instance, matching the Vue composable convention and giving each client isolation without `new`, no `this` binding, and a minimal public surface.

**Isolation without `new`.** Each `useApi()` call closes over its own private state (`_serverUrl`, `_csrfToken`, `_extraHeaders`, …), so multiple clients coexist with zero constructor boilerplate and no prototype inheritance. This mirrors the composable pattern described in `[[architecture#the-composable-pattern]]`.

**No `this` binding.** Every method is an arrow closure, so the returned members are safe to destructure or pass around — a common footgun with class methods. See the factory in `[[src/api.ts#useApi]]` and the per-member inventory in `[[components#useApi--the-composable-factory]]`.

**Minimal surface.** Only the returned members are public; the helpers prefixed with `_` (`_getHeader`, `_postHeader`, `_getBaseHeaders`, `_processResponse`) are genuinely private and unreachable from the outside.

**Config via params.** `UseApiParams` replaces constructor arguments, with defaults applied inline (`params?.x ?? "default"`), documented in `[[src/interfaces.ts#UseApiParams]]`. This is the composable principle stated in `project-nav.md#2`.

## Why a Wrapper Around `fetch`?

`fetch` is powerful but ergonomically fragmented — status checking, content negotiation, header assembly, and body parsing are every call's burden — so the wrapper centralizes them behind a single choke point.

- **Automatic body parsing.** JSON vs text is chosen by `Content-Type`, a `204` is skipped, and malformed JSON warns instead of throwing. Rationale: `[[src/api.ts#_processResponse]]`.
- **Typed responses.** The `<T>` generic flows into `ApiResponse<T>` for compile-time safety.
- **CSRF + header injection.** A single `_getBaseHeaders` merges the token and extra headers on every request. Rationale: `[[src/api.ts#_getBaseHeaders]]`.
- **SSE support.** The `ReadableStream` reader plus `TextDecoder` are wrapped for streaming. Rationale: `[[src/api.ts#postSse]]`.
- **Response hooks.** The `onResponse` middleware has no `fetch` equivalent.
- **Consolidated options.** `_serverUrl`, `_mode`, and `_credentials` are set once and applied everywhere.

The cost is a thin but non-trivial abstraction, which is exactly why parsing and error handling are written defensively (the `try/catch` + `console.warn` above).

## CSRF Approach

Restmix uses the Django/DRF token-in-header scheme — a `csrftoken` cookie sent back as the `X-CSRFToken` header — with opt-in token injection so anonymous endpoints stay clean and both the cookie name and header key are configurable.

- **Opt-in token.** `_csrfToken` starts `null`, so no CSRF header is emitted unless the developer calls `setCsrfToken` / `setCsrfTokenFromCookie`.
- **Configurable names.** `csrfCookieName` and `csrfHeaderKey` are `UseApiParams`, so a server that renames either needs no code change.
- **`credentials: "include"` default.** Required for the cross-site cookie flow; without it the browser drops the CSRF cookie cross-origin.
- **Not double-submit.** The token is read from the server-provided cookie via `js-cookie` and injected, assuming the server sets a fresh token cookie on login. See `[[src/api.ts#setCsrfTokenFromCookie]]` and `[[src/api.ts#setCsrfToken]]`.
- **Security caveat.** The cookie must be JS-readable (so `js-cookie` can read it) yet is only useful with the matching header; the library does not enforce cookie flags — that is the server's job.

This justifies the `[[components#csrf-management]]` component and sits under the `[[domain-concepts#security-considerations]]` context.

## Trade-offs & Known Limitations

These choices are not free: the client is not `instanceof`-checkable or subclassable, leans on modern JavaScript features, and a couple of defaults can surprise callers.

- **No subclassing.** Extend by composition, not inheritance — the client is a plain object, not a class.
- **Modern JS targets.** The build targets `es2015` while the code uses `Object.entries`, `TextDecoder`, and `response.body.getReader()` (via `@ts-ignore` / DOM lib); polyfills may be needed on old environments.
- **Fragile SSE framing.** The regex `/data: |\n\n(?=$)/g` does no real SSE line splitting — see `[[test-specs#gaps--observations]]`.
- **Non-JSON bodies** silently land in `text` with `data: {}`, which can surprise callers expecting typed data.
- **Arbitrary user headers** added via `addHeader` risk leaking secrets.

For the structure these decisions produced, see `[[architecture]]`; for the code each decision justifies, see `[[components]]`; for the exact type shapes, see `[[api-contracts]]`.
