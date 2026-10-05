---
lat:
  require-code-mention: true
---
# test-specs.md — Test Specifications

The Jest + ts-jest integration suite running the built library against a live Express mock server on port 5714. Covers each HTTP method, the response envelope, CSRF, headers, the hook, verbose logging, plus setup, each case, and coverage gaps.

## Test Setup & Mock Server

The runner is `jest` + `ts-jest`; the npm `test` script orchestrates everything through `start-server-and-test`: build and launch the Express mock server (`test/server/dist/index.js`), wait for `http://localhost:5714`, then run `jest --coverage`.

`tsconfig.json` includes both `test/**/*.spec.ts` and `test/test.ts` in its `include` array.

The mock server at `[[test/server/src/index.ts]]` is an Express 5 app using `cors`, `helmet`, `morgan`, and `body-parser`, listening on `PORT` (default `5714`). CORS is configured with `cors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true })` — this enables the credential flow that CSRF token injection depends on. Link: `[[test/server/src/index.ts#cors]]`.

The test client is created once at the top of the suite with `serverUrl: 'http://localhost:5714'`. Link: `[[test/test.ts#client]]`.

The mock server exposes the following routes, each exercised by at least one test case:

| Route | Method | Response |
|---|---|---|
| `/` | GET | `{"response":"ok"}` |
| `/text` | GET | `text/plain` → "plain text response" |
| `/invalid-json` | GET | malformed JSON body |
| `/204` | GET | 204 No Content |
| `/401` | GET | 401 Unauthorized |
| `/403` | GET | 403 + `{"ok":false}` |
| `/post` | POST | `{"response":"ok"}` |
| `/put` | PUT | `{"response":"ok"}` |
| `/patch` | PATCH | `{"response":"ok"}` |
| `/del` | DELETE | `{"response":"ok"}` |
| `/del/404` | DELETE | 404 + `{"error":"not found"}` |
| `/csrf-set` | GET | sets `csrftoken` cookie |
| `/headers` | GET | echoes `req.headers` |

## Coverage Map (Test Cases)

The suite contains 26 `it()` cases. Each case targets one or more components documented in `[[components]]`.

1. `[[test/test.ts#200]]` — **200**: verifies `get` parses JSON and `data` equals `{"response":"ok"}`.
2. `[[test/test.ts#get non-JSON response]]` — **get non-JSON response**: confirms `text` holds the raw body and `data` falls back to `{}`.
3. `[[test/test.ts#get invalid JSON response]]` — **get invalid JSON response**: asserts `console.warn` is called and status remains 200.
4. `[[test/test.ts#204]]` — **204**: verifies status 204, empty text, `data: {}`, and `ok: false`. Cross-ref: `[[architecture#the-response-envelope]]` for the `ok:false` on 204 behaviour.
5. `[[test/test.ts#401]]` — **401**: asserts status 401.
6. `[[test/test.ts#403]]` — **403**: asserts status 403 and `data` equals `{"ok":false}`.
7. `[[test/test.ts#post]]` — **post**: sends a JSON payload and verifies the response.
8. `[[test/test.ts#put]]` — **put**: sends a JSON payload and verifies the response.
9. `[[test/test.ts#patch]]` — **patch**: sends a JSON payload and verifies the response.
10. `[[test/test.ts#del success]]` — **del success**: verifies successful deletion.
11. `[[test/test.ts#del error 404]]` — **del error 404**: verifies 404 on a missing resource.
12. `[[test/test.ts#patch non-existent resource]]` — **patch non-existent**: asserts status 400.
13. `[[test/test.ts#commented]]` — **addHeader/removeHeader round-trip** (commented out): the original round-trip test is disabled; functionality is instead covered by the live `/headers` echo tests below.
14. `[[test/test.ts#onResponse]]` — **onResponse hook**: registers a hook that appends `{modified:true}` and verifies it is applied.
15. `[[test/test.ts#setCsrfToken]]` — **setCsrfToken**: verifies the token is stored.
16. `[[test/test.ts#hasCsrfCookie returns false when no cookie]]` — **hasCsrfCookie false**: asserts false when no cookie is present.
17. `[[test/test.ts#setCsrfTokenFromCookie returns false when no cookie]]` — **setCsrfTokenFromCookie false**: asserts false with a console log when no cookie exists.
18. `[[test/test.ts#setCsrfTokenFromCookie returns true when cookie present]]` — **setCsrfTokenFromCookie true**: asserts true and token stored when cookie is present.
19. `[[test/test.ts#addHeader includes custom headers in requests]]` — **addHeader includes**: verifies a custom header appears in the server-echoed response.
20. `[[test/test.ts#removeHeader clears specific header]]` — **removeHeader clears**: verifies a removed header is absent.
21. `[[test/test.ts#multiple headers with partial removal]]` — **multiple headers partial removal**: verifies one header is removed while another remains.
22. `[[test/test.ts#verbose POST logs request details]]` — **verbose POST**: asserts `console.log` receives the method and URL.
23. `[[test/test.ts#verbose PUT logs request details]]` — **verbose PUT**: asserts `console.log` receives the method and URL.
24. `[[test/test.ts#verbose PATCH logs request details]]` — **verbose PATCH**: asserts `console.log` receives the method and URL.
25. `[[test/test.ts#verbose GET logs request details]]` — **verbose GET**: asserts `console.log` receives the method and URL.
26. `[[test/test.ts#verbose DELETE logs request details]]` — **verbose DELETE**: asserts `console.log` receives the method and URL.

Cross-ref: `[[components]]` for the component each case targets. CSRF tests sit in context of `[[design-decisions#csrf-approach]]`.

## Notable Testing Techniques

**`console` spies.** Several cases use `jest.spyOn(console, 'warn'|'log')` with `mockImplementation(...)` to assert warnings or verbose logs, then `mockRestore()`; the pattern appears in the invalid-json case and all five verbose-* cases.

**Fresh client instances.** CSRF and header tests construct new `useApi(...)` clients rather than reusing the module-level `api` instance. This avoids shared-state pollution — a critical concern because `_csrfToken` and `_extraHeaders` are closure-scoped mutable state.

**Commented-out test.** The original `addHeader`/`removeHeader` round-trip test is commented out at `[[test/test.ts#commented]]`. Its functionality is instead covered by the live `/headers` echo tests (#19–21), which are more robust because they exercise the actual HTTP round-trip through the mock server rather than inspecting an in-memory header map.

## Gaps & Observations

Known untested paths and configuration gaps: `postSse`, the `multipart`/`FormData` branch, custom `mode`/`credentials`, the text branch of `_processResponse`, end-to-end CSRF header injection, and absent coverage thresholds.

- **`postSse` is untested.** No test exercises the SSE streaming path; the fragile SSE regex and branches (`parseJson`, `multipart`, `debug`) in `[[src/api.ts#postSse]]` are unverified.
- **`multipart`/`FormData` path untested.** No test passes `multipart: true` or a `FormData` payload. The non-JSON serialization branch of `[[src/api.ts#_postHeader]]` is uncovered.
- **`mode` and `credentials` variants untested.** Only the default values are exercised; custom `mode` and `credentials` configurations are not verified.
- **`_processResponse` text branch.** Covered only by the `/text` route (#2); other text-response scenarios are not tested.
- **CSRF header injection untested end-to-end.** `setCsrfToken` stores the token, but no test asserts that `X-CSRFToken` actually appears on a sent request. See `[[domain-concepts#security-considerations]]` for why this gap matters.
- **Coverage thresholds absent.** `npm test` runs `jest --coverage`, but no thresholds are configured, so partial coverage does not fail the build.

## How to Run

Two entry points run the suite: `npm test` (full orchestration via `start-server-and-test`) and `npm run test:server` (mock server only, for manual inspection).

- `npm test` — builds the mock server, launches it via `start-server-and-test`, waits for `http://localhost:5714`, then runs `jest --coverage`.
- `npm run test:server` — directly launches the Express mock server for manual inspection.
