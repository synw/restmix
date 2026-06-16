# Execution Plan: Improve Test Coverage

## Overview
- **Task ID:** improve-test-coverage
- **Current Coverage:** 57.6% lines, 71.4% functions, 56.3% branches
- **Target Coverage:** ≥80% lines, ≥85% functions, ≥70% branches
- **Status:** planned (no work started)

## Files to Modify

| File | Purpose |
|------|---------|
| `test/server/src/index.ts` | Add mock endpoints for new test scenarios |
| `test/test.ts` | Add new test cases for all 5 phases |

## Phases

---

### Phase 1: Add DELETE method tests

**Goal:** Cover the `del()` method and its error handling paths.

**Steps:**

1. **Add DELETE mock endpoints in test server** (`test/server/src/index.ts`)
   - Add `app.delete('/del')` — returns `{ "response": "ok" }` with 200 status
   - Add `app.delete('/del/404')` — returns 404 status with `{ "error": "not found" }`

2. **Add DELETE success test** (`test/test.ts`)
   - Test: `api.del<Record<string, any>>("/del")`
   - Expect: `res.ok === true`, `res.data` equals `{ response: "ok" }`

3. **Add DELETE error test** (`test/test.ts`)
   - Test: `api.del<Record<string, any>>("/del/404")`
   - Expect: `res.ok === false`, `res.status === 404`

**Expected coverage impact:** +2-3 lines, +2 functions, +2 branches

---

### Phase 2: Test _processResponse() edge cases

**Goal:** Cover edge cases in `_processResponse()` method — non-JSON responses, invalid JSON, and 204 handling.

**Steps:**

1. **Add non-JSON Content-Type mock endpoint** (`test/server/src/index.ts`)
   - Add `app.get('/text')` — returns plain text with `Content-Type: text/plain`
   - Add `app.get('/invalid-json')` — returns `{ "invalid json` (malformed JSON) with `Content-Type: application/json`

2. **Add test for non-JSON response** (`test/test.ts`)
   - Test: `api.get<string>("/text")`
   - Expect: `res.text` is populated with the plain text, `res.data` is empty object

3. **Add test for invalid JSON parsing** (`test/test.ts`)
   - Test: `api.get<Record<string, any>>("/invalid-json")`
   - Expect: `res.ok === true` (200 status), `console.warn` was called (mock console), `res.data` may be empty

4. **Enhance 204 test** (`test/test.ts`)
   - Current test exists but add assertions for `res.text === ""` and `res.data` being empty object
   - Verify no text parsing is attempted for 204

**Expected coverage impact:** +4-5 lines, +1 function, +4 branches

---

### Phase 3: Test CSRF error paths

**Goal:** Cover CSRF-related functions: `hasCsrfCookie()`, `setCsrfTokenFromCookie()`, and `_csrfFromCookie()` error paths.

**Steps:**

1. **Add CSRF cookie mock endpoint** (`test/server/src/index.ts`)
   - Add `app.get('/csrf-set')` — sets a `csrftoken` cookie and returns `{ "csrf": "test-token" }`
   - This endpoint uses `res.cookie('csrftoken', 'test-token')` to set the cookie

2. **Add test: hasCsrfCookie returns false** (`test/test.ts`)
   - Create a new API instance (or ensure no cookie is set)
   - Test: `api.hasCsrfCookie()`
   - Expect: `false`

3. **Add test: setCsrfTokenFromCookie returns false with verbose** (`test/test.ts`)
   - Create a new API instance (no cookie set)
   - Mock `console.log` to capture output
   - Test: `api.setCsrfTokenFromCookie(true)`
   - Expect: returns `false`, `console.log` called with "User does not have csrf cookie"

4. **Add test: _csrfFromCookie throws on missing cookie** (`test/test.ts`)
   - Create a new API instance (no cookie set)
   - Test: `api.del("/csrf-set")` won't help — need to directly test the internal method
   - Since `_csrfFromCookie` is not exported, test via `setCsrfTokenFromCookie` which calls it internally
   - Actually, we can test by calling `setCsrfTokenFromCookie(false)` on an instance without cookie — it returns false
   - To test the throw path, we need a cookie-less scenario and verify the error is thrown
   - Alternative: test `setCsrfTokenFromCookie(true)` without cookie — it returns false (doesn't throw because it checks `hasCsrfCookie()` first)
   - The throw in `_csrfFromCookie` is only reachable if `hasCsrfCookie()` returns true but `Cookies.get()` returns undefined — this is an edge case that's hard to test directly
   - Best approach: test `setCsrfTokenFromCookie(true)` with a cookie set, verify it returns true and sets the token

5. **Add test: setCsrfTokenFromCookie returns true with cookie** (`test/test.ts`)
   - Make a GET request to `/csrf-set` to set the cookie
   - Test: `api.setCsrfTokenFromCookie(true)`
   - Expect: returns `true`, `api.csrfToken()` equals `"test-token"`, `console.log` called

**Expected coverage impact:** +5-6 lines, +3 functions, +4 branches

---

### Phase 4: Test header management

**Goal:** Cover `addHeader()`, `removeHeader()`, and `_getBaseHeaders()` paths.

**Steps:**

1. **Add header echo mock endpoint** (`test/server/src/index.ts`)
   - Add `app.get('/headers')` — returns all request headers as JSON: `{ headers: req.headers }`
   - This allows verifying custom headers are sent

2. **Add test: removeHeader clears headers** (`test/test.ts`)
   - `api.addHeader('X-Test-Header', 'test-value')`
   - `api.removeHeader('X-Test-Header')`
   - `api.get<Record<string, any>>("/headers")`
   - Expect: `res.headers['x-test-header']` is undefined or not present

3. **Add test: extra headers included in requests** (`test/test.ts`)
   - `api.addHeader('X-Custom-Header', 'custom-value')`
   - `api.get<Record<string, any>>("/headers")`
   - Expect: `res.headers['x-custom-header']` equals `'custom-value'`
   - `api.removeHeader('X-Custom-Header')`

4. **Add test: multiple headers and partial removal** (`test/test.ts`)
   - `api.addHeader('X-Header-1', 'value1')`
   - `api.addHeader('X-Header-2', 'value2')`
   - `api.removeHeader('X-Header-1')`
   - `api.get<Record<string, any>>("/headers")`
   - Expect: `X-Header-2` present, `X-Header-1` absent

**Expected coverage impact:** +4-5 lines, +1 function, +3 branches

---

### Phase 5: Test verbose/debug branches

**Goal:** Cover the `verbose` parameter branches in `get()`, `post()`, `put()`, `patch()`, and `del()` methods.

**Steps:**

1. **Add test: verbose POST** (`test/test.ts`)
   - Mock `console.log` using `jest.spyOn(console, 'log').mockImplementation()`
   - Test: `api.post<Record<string, any>>("/post", { foo: "bar" }, false, true)`
   - Expect: `console.log` called with "POST" and URL, and with JSON stringified options
   - Expect: `res.data` equals `{ response: "ok" }`

2. **Add test: verbose PUT** (`test/test.ts`)
   - Test: `api.put<Record<string, any>>("/put", { foo: "bar" }, true)`
   - Expect: `console.log` called with "PUT" and URL

3. **Add test: verbose PATCH** (`test/test.ts`)
   - Test: `api.patch<Record<string, any>>("/patch", { foo: "bar" }, true)`
   - Expect: `console.log` called with "PATCH" and URL

4. **Add test: verbose GET** (`test/test.ts`)
   - Test: `api.get<Record<string, any>>("/", true)`
   - Expect: `console.log` called with "GET" and URL

5. **Add test: verbose DELETE** (`test/test.ts`)
   - Test: `api.del<Record<string, any>>("/del", true)`
   - Expect: `console.log` called with "DELETE" and URL

6. **Cleanup:** Restore `console.log` mock after verbose tests

**Expected coverage impact:** +5-6 lines, +0 functions, +5 branches

---

## Summary of Changes

### test/server/src/index.ts — Additions
```typescript
// DELETE endpoints
app.delete('/del', (req, res) => {
  res.send({ "response": "ok" });
});
app.delete('/del/404', (req, res) => {
  res.status(404).send({ "error": "not found" });
});

// Non-JSON endpoint
app.get('/text', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('plain text response');
});

// Invalid JSON endpoint
app.get('/invalid-json', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send('{ "invalid json');
});

// CSRF cookie endpoint
app.get('/csrf-set', (req, res) => {
  res.cookie('csrftoken', 'test-token');
  res.send({ "csrf": "test-token" });
});

// Header echo endpoint
app.get('/headers', (req, res) => {
  res.send({ headers: req.headers });
});
```

### test/test.ts — Additions
- Phase 1: 2 new test cases (DELETE success, DELETE error)
- Phase 2: 3 new test cases (non-JSON response, invalid JSON, enhanced 204)
- Phase 3: 3-4 new test cases (hasCsrfCookie false, setCsrfTokenFromCookie false/true)
- Phase 4: 3 new test cases (removeHeader, extra headers, multiple headers)
- Phase 5: 5 new test cases (verbose for each method)
- **Total new tests: ~16 test cases**

## Execution Order
1. Phase 1 (DELETE tests) — simple, no dependencies
2. Phase 2 (processResponse edge cases) — requires new mock endpoints
3. Phase 3 (CSRF error paths) — requires cookie endpoint
4. Phase 4 (header management) — requires header echo endpoint
5. Phase 5 (verbose branches) — simplest, just mock console

## Notes
- **SSE (postSse) has been removed** — do NOT add any SSE-related tests
- All tests run against the Express mock server on port 5714
- Use `jest.spyOn(console, 'log')` for mocking console output in Phase 5
- Create fresh API instances for CSRF tests to avoid state pollution from other tests
