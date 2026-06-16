# Restmix Test Coverage Report

**Date:** Generated from existing coverage data in `coverage/` directory  
**Source File:** `src/api.ts` (158 lines)  
**Test File:** `test/test.ts` (10 test cases)  
**Test Framework:** Jest with ts-jest  

---

## Executive Summary

The Restmix project has **moderate test coverage** at 57.6% lines, 71.4% functions, and 56.3% branches. While core HTTP methods (GET, POST, PUT, PATCH) are covered, several critical functions remain entirely untested, including the response processing pipeline and the DELETE method.

> **NOTE:** The `postSse()` function has been **removed from the project** and is no longer maintained. All SSE-related code has been deprecated and removed. This report no longer includes SSE testing requirements.

---

## Coverage Metrics

| Metric | Covered | Total | Percentage |
|--------|---------|-------|------------|
| **Lines** | 91 | 158 | **57.6%** |
| **Functions** | 25 | 35 | **71.4%** |
| **Branches** | 67 | 119 | **56.3%** |

---

## What IS Tested ✅

### HTTP Methods
| Method | Status | Details |
|--------|--------|---------|
| `GET` | ✅ Covered | 200, 204, 401, 403 responses tested |
| `POST` | ✅ Covered | JSON payload, response parsing |
| `PUT` | ✅ Covered | JSON payload, response parsing |
| `PATCH` | ✅ Covered | Success and 400 error cases |
| `DELETE` | ❌ Untested | No tests exist |
| `postSse()` | ❌ **Deprecated/Removed** | SSE functionality removed from project |

### Other Features
| Feature | Status | Details |
|---------|--------|---------|
| `onResponse` hook | ✅ Covered | Hook modifies response data |
| `setCsrfToken()` / `csrfToken()` | ✅ Covered | Token set and retrieved |
| `addHeader()` | ⚠️ Partially | Called but error path not tested |
| `removeHeader()` | ❌ Untested | Cleanup logic untested |
| `hasCsrfCookie()` | ⚠️ Partially | True path covered, false path not |
| `setCsrfTokenFromCookie()` | ⚠️ Partially | Success path covered |

---

## Critical Gaps — Entirely Untested Functions ❌

### 1. `_processResponse()` — Line 57
**Priority: HIGH**  
This is the core response processing function that handles:
- Response header extraction
- JSON vs text content-type detection
- `response.json()` and `response.text()` parsing
- Invalid JSON error handling (`console.warn`)
- On-response hook invocation

**Impact:** Without tests for this function, there is no verification that the library correctly processes API responses in various scenarios.

### 2. `delete()` — Line 202
**Priority: MEDIUM**  
The DELETE HTTP method is not tested at all, despite being a standard REST operation.

> **REMOVED:** `postSse()` (Lines 72/120) has been **removed from the project**. The SSE streaming functionality is deprecated and will not be tested.

---

## Untested Code Paths ⚠️

### CSRF Cookie Functions
| Path | Line | Description |
|------|------|-------------|
| `_csrfFromCookie()` throw | 39-44 | Throws when CSRF cookie not found |
| `hasCsrfCookie()` false | 46 | Returns false when no cookie |
| `setCsrfTokenFromCookie()` false | 72-78 | Returns false, logs verbose message |

### Header Management
| Path | Line | Description |
|------|------|---------|
| `removeHeader()` cleanup | 48-51 | Clears extra headers when empty |
| `_getBaseHeaders()` extra headers | 245-247 | Propagates custom headers to requests |

### Verbose/Debug Logging
| Method | Lines | Status |
|--------|-------|--------|
| `post` verbose | 162-163 | ❌ Not tested |
| `put` verbose | 184-185 | ❌ Not tested |
| `patch` verbose | 195-196 | ❌ Not tested |
| `delete` verbose | 204-210 | ❌ Not tested |

---

## Branch Coverage Details

**Total branches:** 119  
**Covered branches:** 67 (56.3%)  
**Uncovered branches:** 52 (43.7%)

### Major Uncovered Branch Categories
1. **Conditional defaults** — 8 branches for default parameter values
2. **Error paths** — CSRF cookie not found, invalid JSON
3. **Content-type branches** — Non-JSON response handling
4. **Debug/verbose logging** — All `if (verbose)` and `if (debug)` branches
5. **Null checks** — `_credentials !== null` in header building

---

## Test Infrastructure

### Test Server
- **Location:** `test/server/`
- **Framework:** Express.js
- **Port:** 5714
- **Endpoints tested:** `/`, `/204`, `/401`, `/403`, `/post`, `/put`, `/patch`, `/non-existent`

### Test Runner
- **Command:** `npm test` (runs server + jest with coverage)
- **Coverage format:** LCOV, Clover, JSON
- **Output directory:** `coverage/`

---

## Recommendations

### Immediate (Quick Wins)
1. **Add DELETE tests** — Add a `/delete` endpoint to the mock server and 1-2 test cases
2. **Test `_processResponse()` non-JSON** — Mock a response with `text/plain` content type
3. **Test CSRF error paths** — Remove CSRF cookie in a test to exercise error branches

### Medium Effort
4. **Test `removeHeader()` cleanup** — Add/remove headers and verify state
5. **Test verbose logging** — Use `jest.spyOn(console, 'log')` to verify logging calls
6. **Test extra headers propagation** — Verify custom headers appear in requests

> **REMOVED:** SSE testing (previously Phase 6) is no longer required as `postSse()` has been removed from the project.

---

## Coverage Trend

| Run | Lines | Functions | Branches |
|-----|-------|-----------|----------|
| Current | 57.6% | 71.4% | 56.3% |
| Target | ≥80% | ≥85% | ≥70% |
