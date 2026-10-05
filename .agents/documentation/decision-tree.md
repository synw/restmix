# Documentation Decision Tree

> Quick guide: What to read based on your task.
> For most tasks this file alone is enough — follow the path and open the source file directly.
> Two layers: `.agents/` docs are **navigation** (task → file); the `lat.md/` knowledge graph is **grounding** (design intent, contracts, test specs).

## I need to understand the project

- High-level overview → `.agents/documentation/project-overview.md`
- Full navigation map & deep reference → `.agents/documentation/project-nav.md`
- Structured technical summary → `.agents/documentation/codebase-summary.md`

## I need design grounding before changing code

Ground each task in actual architecture and intent before writing code:

| Question | Command |
|----------|---------|
| "How does X work / why is it designed this way?" | `lat search "<task>"` (semantic; requires `LAT_LLM_KEY`) |
| No key configured? | `lat locate "<section name>"`, then `lat section <id>` |
| What references a section? | `lat refs "<id>"` |

Knowledge graph (`lat.md/`):

| Need | File |
|------|-------|
| Mental model: composable factory, closure state, request pipeline | `lat.md/architecture.md` |
| Exact signatures of the public surface | `lat.md/api-contracts.md` |
| Per-member behaviour of the client object returned by `useApi` | `lat.md/components.md` |
| Rationale & trade-offs (factory vs class, fetch wrapper, CSRF scheme) | `lat.md/design-decisions.md` |
| Domain concepts: composable-client, REST, security | `lat.md/domain-concepts.md` |
| Test cases, techniques, coverage gaps | `lat.md/test-specs.md` |

## I need to work on a specific area

| Area | Go To |
|------|-------|
| Public API / exports (barrel) | `src/main.ts` |
| Core composable `useApi()` + HTTP methods | `src/api.ts` |
| Public types (`ApiResponse`, `UseApiParams`, hooks) | `src/interfaces.ts` |
| Jest tests + express test server | `test/test.ts`, `test/server/src/index.ts` |
| Build (rollup → `dist/`) | `rollup.config.js`, `tsconfig.json` |
| Documentation site (Vite/Vue) | `docsite/` |

For behavior changes, ground first with `lat search` (§ design grounding above), then open the file.

## Common Tasks (Quick Reference)

| Task | Go To |
|------|-------|
| Add or change an HTTP method (get/post/put/patch/del) | `src/api.ts` (`get`, `post`, `put`, `patch`, `del`) |
| Add per-request / extra headers | `src/api.ts` (`addHeader`, `removeHeader`, `_getBaseHeaders`) |
| Configure CSRF handling | `src/api.ts` (`setCsrfToken`, `setCsrfTokenFromCookie`, `hasCsrfCookie`) + `src/interfaces.ts` (`UseApiParams`) |
| Add an on-response transform hook | `src/api.ts` (`onResponse`) + `src/interfaces.ts` (`OnResponseHook`) |
| Stream a Server-Sent Events response | `src/api.ts` (`postSse`) |
| Change build output / bundle format | `rollup.config.js` (ESM + IIFE) |
| Run the test suite | `npm test` (starts `test/server`, runs jest) |
| Add or change a test | `test/test.ts` (+ express route in `test/server/src/index.ts`) — each spec section needs exactly one `// @lat:` ref next to the test; update `lat.md/test-specs.md` |

## Post-task checklist (REQUIRED)

After EVERY task, before responding:

- [ ] If you added or changed meaningful implemented functionality, architecture, tests, or behavior → update the relevant `lat.md/` file. Keep it a focused snapshot of the current implemented state, not a journal/changelog.
- [ ] Run `lat check` — all validations must pass.

Do not consider your task done until both are complete.

→ Conventions & patterns: `.agents/documentation/project-nav.md` § Key Conventions & Patterns.
