# api-contracts.md — API Contracts

The public surface of Restmix: every exported type and function with its exact signature. The barrel `src/main.ts` is the single entry point; this section is the reference developers copy signatures from.

## Public Entry — the Barrel

Everything a consumer imports flows through one barrel, `src/main.ts`. It re-exports the composable `useApi` together with the three types it accepts and returns, so callers never import the internal modules directly.

```ts
import { useApi } from "./api.js";
import type { UseApiParams, ApiResponse, OnResponseHook } from "./interfaces.js";

export { useApi, UseApiParams, ApiResponse, OnResponseHook };
```

Two types live in `src/interfaces.ts` but are **not** re-exported by the barrel: `RequestCredentials` and `RequestMode`. Consumers must import them from the internal module or rely on structural typing (they are only ever used as the types of `UseApiParams.credentials` and `UseApiParams.mode`).

- Link: `[[src/main.ts]]`
- Cross-ref: `[[components#useApi--the-composable-factory]]` — the behaviour behind the signature.

## Exported Types

All exported types live in `src/interfaces.ts`. They are the public contract for `useApi` and the return shape of every HTTP method.

```ts
type RequestCredentials = 'omit' | 'include' | 'same-origin';
type RequestMode = 'cors' | 'no-cors' | 'same-origin' | 'navigate';

interface UseApiParams {
  serverUrl?: string;
  csrfCookieName?: string;
  csrfHeaderKey?: string;
  credentials?: RequestCredentials | null;
  mode?: RequestMode;
}

interface ApiResponse<T = Record<string, any> | Array<any>> {
  ok: boolean;
  url: string;
  headers: Record<string, string>;
  status: number;
  statusText: string;
  data: T;
  text: string;
}

type OnResponseHook = <T>(res: ApiResponse<T>) => Promise<ApiResponse<T>>;
```

- **`UseApiParams`** — configuration for the composable. `serverUrl` is prepended to every `uri`; `csrfCookieName` / `csrfHeaderKey` name the CSRF cookie and the header the token is injected into; `credentials` and `mode` map straight onto `RequestInit`. All optional.
- **`ApiResponse<T>`** — the normalised response envelope returned by every HTTP method. `data` holds the parsed body (typed as `T`), `text` the raw body, `headers` a plain `Record<string,string>` copy of the response headers, and `ok`/`status`/`statusText` mirror `fetch`'s `Response`. The generic defaults to `Record<string, any> | Array<any>` so a call like `api.get()` is usable without an explicit type argument.
- **`OnResponseHook`** — the sole middleware primitive: an async function that receives an `ApiResponse<T>` and returns a (possibly rewritten) `ApiResponse<T>`.
- **`RequestCredentials` / `RequestMode`** — `fetch` string-literal unions (see the barrel note above).

- Link: `[[src/interfaces.ts]]`

## Exported Function — useApi

```ts
function useApi(params?: UseApiParams): UseApiClient
```

`useApi` is a factory (composable), not a class: it returns a plain object of closure-bound functions. When `params` is omitted the following defaults are applied inline via `params?.x ?? "default"`:

| param | default |
| --- | --- |
| `serverUrl` | `""` |
| `csrfCookieName` | `"csrftoken"` |
| `csrfHeaderKey` | `"X-CSRFToken"` |
| `credentials` | `"include"` |
| `mode` | `"cors"` |

- Link: `[[src/api.ts#useApi]]`
- Cross-ref: `[[components#HTTP-Methods]]` — what each returned verb does; `[[architecture#State-Management-via-Closures]]` — how the defaults and state are held.

## UseApiClient (Return Type)

`useApi` returns a plain object of **13** members (the exact count of the `return { … }` in `src/api.ts`). They group into five roles:

**CSRF** — `csrfToken(): string | null`, `hasCsrfCookie(): boolean`, `setCsrfToken(token: string): void`, `setCsrfTokenFromCookie(verbose?: boolean): boolean`

**Headers** — `addHeader(key: string, val: string): void`, `removeHeader(key: string): void`

**Hook** — `onResponse(hook: OnResponseHook): void`

**HTTP** —

```ts
get<T>(uri: string, verbose?: boolean): Promise<ApiResponse<T>>
post<T>(uri: string, payload: Array<any> | Record<string, any> | FormData, multipart?: boolean, verbose?: boolean): Promise<ApiResponse<T>>
put<T>(uri: string, payload: Array<any> | Record<string, any>, verbose?: boolean): Promise<ApiResponse<T>>
patch<T>(uri: string, payload: Array<any> | Record<string, any>, verbose?: boolean): Promise<ApiResponse<T>>
del<T>(uri: string, verbose?: boolean): Promise<ApiResponse<T>>
```

**SSE** —

```ts
postSse<T>(
  uri: string,
  payload: Array<any> | Record<string, any> | FormData,
  onChunk: (payload: T) => void,
  abortController: AbortController,
  parseJson?: boolean,
  multipart?: boolean,
  verbose?: boolean,
  debug?: boolean
): Promise<void>
```

Parameter defaults: `post(...)` takes `multipart` then `verbose`; `postSse(...)` takes `parseJson`, `multipart`, `verbose`, then `debug` (its most complex member, with eight parameters). The `<T>` generic defaults through `ApiResponse<T>`, so methods are usable without explicit type args.

- Link: `[[src/api.ts#useApi]]` (the returned object)
- Cross-ref: `[[components#HTTP-Methods]]`, `[[components#SSE-Streaming--postSse]]`

## Build Outputs

`rollup.config.js` bundles from `src/main.ts` into two artifacts:

| file | format | purpose |
| --- | --- | --- |
| `dist/main.js` | `esm` | the package entry for bundlers (also `package.json` `module` / `exports["."].import`) |
| `dist/main.min.js` | `iife` | minified (terser) browser global exposed as `$api` |
| `dist/main.d.ts` | — | TypeScript declarations emitted alongside the JS |

The `build` script (`rm -f dist/* && rollup -c`) clears `dist/` first. Types are generated by `@rollup/plugin-typescript` (`declaration: true`, `declarationDir: './dist'`); `package.json` points `types` at `./dist/main.d.ts`.

## Known Gaps / Notes

Open items in the public contract: two types that escaped the barrel, one eight-parameter member, and generic defaults that keep call sites untyped.

- `RequestCredentials` and `RequestMode` are exported from `src/interfaces.ts` but missing from the barrel (see §1) — consumers rely on structural typing.
- `postSse` is the most complex member (eight parameters); its signature is documented above and its behaviour in `[[components#SSE-Streaming--postSse]]`.
- The `T` generic default on `ApiResponse` makes every method usable without an explicit type argument.
- The return shape is a plain object by design — see `[[design-decisions#why-composable-factory-rather-than-a-class]]` for the rationale.
