# Restmix — Project Overview

> **Role**: Concise "what is this" for context loading (~1 page overview).
> **See also**: `.agents/documentation/decision-tree.md` to find the right doc for your task.
> **See also**: `.agents/documentation/project-nav.md` for deep reference (conventions, snippets, maps).

---

## What is Restmix?

Restmix is a lightweight TypeScript-friendly requests manager for REST APIs. It wraps the browser/Node `fetch` API, takes care of response body parsing, and delivers strongly typed data via a small composable `useApi()`. It is published as an npm package (`restmix`) and ships both ESM and minified IIFE bundles.

---

## Core Capabilities

- **Typed HTTP methods** — `get`, `post`, `put`, `patch`, `del` return `ApiResponse<T>` with parsed, typed `data`.
- **Automatic body parsing** — JSON responses are parsed into `data`; non-JSON bodies are exposed via `text`; `204` responses yield empty objects.
- **CSRF support** — read the CSRF token from a cookie (`js-cookie`) or set it manually; injects it as a configurable header.
- **Custom headers** — add/remove per-request headers through `addHeader`/`removeHeader`.
- **On-response hooks** — transform the response before it returns via `onResponse`.
- **Server-Sent Events** — `postSse` streams chunked responses to a callback.

---

## Key Architecture Patterns

- **Composable factory**: `useApi(params)` is a closure that captures config (`serverUrl`, `mode`, `credentials`, CSRF settings) and returns an object of bound request methods.
- **Centralized header assembly**: `_getBaseHeaders` merges base headers with the CSRF token and any extra headers; `_getHeader`/`_postHeader` build the `RequestInit`.
- **Single response pipeline**: every method routes through `_processResponse`, which normalizes status, parses JSON vs. text, and applies the onResponse hook.
- **Barrel export**: `src/main.ts` re-exports the public API surface (`useApi` and its types) for a clean entry point.

---
