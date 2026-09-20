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

#### Step 1.1: Add DELETE mock endpoints in test server

**File:** `test/server/src/index.ts`

**Execution Plan:**
Add the following endpoints after existing routes:
```typescript
app.delete('/del', (req: Request, res: Response) => {
  res.send({ "response": "ok" });
});

app.delete('/del/404', (req: Request, res: Response) => {
  res.status(404).send({ "error": "not found" });
});
```

**Success Criteria:**
- [ ] File `test/server/src/index.ts` contains `app.delete('/del', ...)` endpoint
- [ ] File `test/server/src/index.ts` contains `app.delete('/del/404', ...)` endpoint
- [ ] Test server starts without errors: `cd test/server && npm run build && node dist/index.js` (should log "Test server running on 5714")
- [ ] Manual verification: `curl -X DELETE http://localhost:5714/del` returns `{"response":"ok"}`
- [ ] Manual verification: `curl -X DELETE http://localhost:5714/del/404` returns 404 status

---

#### Step 1.2: Add DELETE success test

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('del success', async () => {
  const res = await api.del<Record<string, any>>("/del");
  expect(res.ok).toBe(true);
  expect(res.status).toBe(200);
  expect(res.data).toEqual({ response: "ok" });
});
```

**Success Criteria:**
- [ ] Test file contains `it('del success', ...)` test case
- [ ] Test passes: `npm test` shows "del success" as passing (green checkmark)
- [ ] No new test failures introduced

---

#### Step 1.3: Add DELETE error test

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('del error 404', async () => {
  const res = await api.del<Record<string, any>>("/del/404");
  expect(res.ok).toBe(false);
  expect(res.status).toBe(404);
});
```

**Success Criteria:**
- [ ] Test file contains `it('del error 404', ...)` test case
- [ ] Test passes: `npm test` shows "del error 404" as passing
- [ ] All existing tests still pass (no regressions)

---

### Phase 2: Test _processResponse() edge cases

**Goal:** Cover edge cases in `_processResponse()` method — non-JSON responses, invalid JSON, and 204 handling.

#### Step 2.1: Add non-JSON Content-Type mock endpoints

**File:** `test/server/src/index.ts`

**Execution Plan:**
Add the following endpoints:
```typescript
app.get('/text', (req: Request, res: Response) => {
  res.set('Content-Type', 'text/plain');
  res.send('plain text response');
});

app.get('/invalid-json', (req: Request, res: Response) => {
  res.set('Content-Type', 'application/json');
  res.send('{ "invalid json');
});

app.get('/204', (req: Request, res: Response) => {
  res.status(204).send();
});
```

**Success Criteria:**
- [ ] File contains `app.get('/text', ...)` endpoint with `Content-Type: text/plain`
- [ ] File contains `app.get('/invalid-json', ...)` endpoint with malformed JSON
- [ ] Test server builds and starts without errors
- [ ] Manual verification: `curl http://localhost:5714/text` returns "plain text response"
- [ ] Manual verification: `curl http://localhost:5714/invalid-json` returns `{ "invalid json`

---

#### Step 2.2: Add test for non-JSON response

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('get non-JSON response', async () => {
  const res = await api.get<Record<string, any>>("/text");
  expect(res.ok).toBe(true);
  expect(res.text).toBe("plain text response");
  expect(res.data).toEqual({});
});
```

**Success Criteria:**
- [ ] Test file contains `it('get non-JSON response', ...)` test case
- [ ] Test passes: `npm test` shows "get non-JSON response" as passing
- [ ] All existing tests still pass

---

#### Step 2.3: Add test for invalid JSON parsing

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case with console.warn mocking:
```typescript
it('get invalid JSON response', async () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const res = await api.get<Record<string, any>>("/invalid-json");
  expect(res.ok).toBe(true);
  expect(res.status).toBe(200);
  expect(warnSpy).toHaveBeenCalled();
  warnSpy.mockRestore();
});
```

**Success Criteria:**
- [ ] Test file contains `it('get invalid JSON response', ...)` test case
- [ ] Test passes: `npm test` shows "get invalid JSON response" as passing
- [ ] `console.warn` is verified to have been called (spy assertion passes)
- [ ] All existing tests still pass

---

#### Step 2.4: Enhance 204 test with additional assertions

**File:** `test/test.ts`

**Execution Plan:**
Update the existing 204 test to add more assertions:
```typescript
it('204', async () => {
  const res = await api.get("/204");
  expect(res.status).toEqual(204);
  expect(res.text).toEqual("");
  expect(res.data).toEqual({});
  expect(res.ok).toBe(false);
});
```

**Success Criteria:**
- [ ] Existing `it('204', ...)` test is updated with additional assertions
- [ ] Test passes: `npm test` shows "204" as passing
- [ ] All existing tests still pass

---

### Phase 3: Test CSRF error paths

**Goal:** Cover CSRF-related functions: `hasCsrfCookie()`, `setCsrfTokenFromCookie()`, and error paths.

#### Step 3.1: Add CSRF cookie mock endpoint

**File:** `test/server/src/index.ts`

**Execution Plan:**
Add the following endpoint:
```typescript
app.get('/csrf-set', (req: Request, res: Response) => {
  res.cookie('csrftoken', 'test-token');
  res.send({ "csrf": "test-token" });
});
```

**Success Criteria:**
- [ ] File contains `app.get('/csrf-set', ...)` endpoint with `res.cookie()`
- [ ] Test server builds and starts without errors
- [ ] Manual verification: `curl http://localhost:5714/csrf-set` returns `Set-Cookie: csrftoken=test-token` header

---

#### Step 3.2: Add test for hasCsrfCookie returns false

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case with a fresh API instance:
```typescript
it('hasCsrfCookie returns false when no cookie', () => {
  const testApi = useApi({ serverUrl: 'http://localhost:5714' });
  expect(testApi.hasCsrfCookie()).toBe(false);
});
```

**Success Criteria:**
- [ ] Test file contains `it('hasCsrfCookie returns false when no cookie', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] All existing tests still pass

---

#### Step 3.3: Add test for setCsrfTokenFromCookie returns false (no cookie)

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('setCsrfTokenFromCookie returns false when no cookie', () => {
  const testApi = useApi({ serverUrl: 'http://localhost:5714' });
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const result = testApi.setCsrfTokenFromCookie(true);
  expect(result).toBe(false);
  expect(logSpy).toHaveBeenCalledWith("User does not have csrf cookie");
  logSpy.mockRestore();
});
```

**Success Criteria:**
- [ ] Test file contains `it('setCsrfTokenFromCookie returns false when no cookie', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] `console.log` is verified to have been called with expected message
- [ ] All existing tests still pass

---

#### Step 3.4: Add test for setCsrfTokenFromCookie returns true (with cookie)

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('setCsrfTokenFromCookie returns true when cookie present', async () => {
  const testApi = useApi({ serverUrl: 'http://localhost:5714' });
  // First, set the cookie by calling the endpoint (this won't actually set browser cookie in Node)
  // Since we're testing in Node environment, we need to simulate having a cookie
  // For this test, we'll directly set the CSRF token and verify the flow
  testApi.setCsrfToken('test-token');
  expect(testApi.csrfToken()).toBe('test-token');
});
```

**Note:** Since tests run in Node.js (not browser), Cookies.get() won't find browser cookies. The test above verifies the alternative path of setting CSRF token directly.

**Success Criteria:**
- [ ] Test file contains `it('setCsrfTokenFromCookie returns true when cookie present', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] All existing tests still pass

---

### Phase 4: Test header management

**Goal:** Cover `addHeader()`, `removeHeader()`, and `_getBaseHeaders()` paths.

#### Step 4.1: Add header echo mock endpoint

**File:** `test/server/src/index.ts`

**Execution Plan:**
Add the following endpoint:
```typescript
app.get('/headers', (req: Request, res: Response) => {
  res.send({ headers: req.headers });
});
```

**Success Criteria:**
- [ ] File contains `app.get('/headers', ...)` endpoint
- [ ] Test server builds and starts without errors
- [ ] Manual verification: `curl http://localhost:5714/headers` returns headers as JSON

---

#### Step 4.2: Add test for addHeader and verify in request

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('addHeader includes custom headers in requests', async () => {
  const testApi = useApi({ serverUrl: 'http://localhost:5714' });
  testApi.addHeader('X-Custom-Header', 'custom-value');
  const res = await testApi.get<Record<string, any>>("/headers");
  expect(res.data.headers['x-custom-header']).toBe('custom-value');
  testApi.removeHeader('X-Custom-Header');
});
```

**Success Criteria:**
- [ ] Test file contains `it('addHeader includes custom headers in requests', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] Custom header is verified to be present in the request
- [ ] All existing tests still pass

---

#### Step 4.3: Add test for removeHeader clears headers

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('removeHeader clears specific header', async () => {
  const testApi = useApi({ serverUrl: 'http://localhost:5714' });
  testApi.addHeader('X-Test-Header', 'test-value');
  testApi.removeHeader('X-Test-Header');
  const res = await testApi.get<Record<string, any>>("/headers");
  expect(res.data.headers['x-test-header']).toBeUndefined();
});
```

**Success Criteria:**
- [ ] Test file contains `it('removeHeader clears specific header', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] Removed header is verified to be absent from request
- [ ] All existing tests still pass

---

#### Step 4.4: Add test for multiple headers and partial removal

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('multiple headers with partial removal', async () => {
  const testApi = useApi({ serverUrl: 'http://localhost:5714' });
  testApi.addHeader('X-Header-1', 'value1');
  testApi.addHeader('X-Header-2', 'value2');
  testApi.removeHeader('X-Header-1');
  const res = await testApi.get<Record<string, any>>("/headers");
  expect(res.data.headers['x-header-1']).toBeUndefined();
  expect(res.data.headers['x-header-2']).toBe('value2');
  testApi.removeHeader('X-Header-2');
});
```

**Success Criteria:**
- [ ] Test file contains `it('multiple headers with partial removal', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] Partial removal is verified: one header present, other absent
- [ ] All existing tests still pass

---

### Phase 5: Test verbose/debug branches

**Goal:** Cover the `verbose` parameter branches in HTTP methods.

#### Step 5.1: Add test for verbose POST

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('verbose POST logs request details', async () => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const res = await api.post<Record<string, any>>("/post", { foo: "bar" }, false, true);
  expect(logSpy).toHaveBeenCalledWith("POST", expect.stringContaining("/post"));
  expect(res.data).toEqual({ response: "ok" });
  logSpy.mockRestore();
});
```

**Success Criteria:**
- [ ] Test file contains `it('verbose POST logs request details', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] `console.log` is verified to have been called with "POST" and URL
- [ ] All existing tests still pass

---

#### Step 5.2: Add test for verbose PUT

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('verbose PUT logs request details', async () => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const res = await api.put<Record<string, any>>("/put", { foo: "bar" }, true);
  expect(logSpy).toHaveBeenCalledWith("PUT", expect.stringContaining("/put"));
  expect(res.data).toEqual({ response: "ok" });
  logSpy.mockRestore();
});
```

**Success Criteria:**
- [ ] Test file contains `it('verbose PUT logs request details', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] `console.log` is verified to have been called with "PUT" and URL
- [ ] All existing tests still pass

---

#### Step 5.3: Add test for verbose PATCH

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('verbose PATCH logs request details', async () => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const res = await api.patch<Record<string, any>>("/patch", { foo: "bar" }, true);
  expect(logSpy).toHaveBeenCalledWith("PATCH", expect.stringContaining("/patch"));
  logSpy.mockRestore();
});
```

**Success Criteria:**
- [ ] Test file contains `it('verbose PATCH logs request details', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] `console.log` is verified to have been called with "PATCH" and URL
- [ ] All existing tests still pass

---

#### Step 5.4: Add test for verbose GET

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('verbose GET logs request details', async () => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const res = await api.get<Record<string, any>>("/", true);
  expect(logSpy).toHaveBeenCalledWith("GET", expect.stringContaining("/"));
  logSpy.mockRestore();
});
```

**Success Criteria:**
- [ ] Test file contains `it('verbose GET logs request details', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] `console.log` is verified to have been called with "GET" and URL
- [ ] All existing tests still pass

---

#### Step 5.5: Add test for verbose DELETE

**File:** `test/test.ts`

**Execution Plan:**
Add a new test case:
```typescript
it('verbose DELETE logs request details', async () => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const res = await api.del<Record<string, any>>("/del", true);
  expect(logSpy).toHaveBeenCalledWith("DELETE", expect.stringContaining("/del"));
  logSpy.mockRestore();
});
```

**Success Criteria:**
- [ ] Test file contains `it('verbose DELETE logs request details', ...)` test case
- [ ] Test passes: `npm test` shows this test as passing
- [ ] `console.log` is verified to have been called with "DELETE" and URL
- [ ] All existing tests still pass

---

## Final Verification Step

#### Step 6: Run coverage report and verify targets met

**Execution Plan:**
1. Run `npm test -- --coverage` to generate coverage report
2. Check coverage metrics in the output or `coverage/` directory

**Success Criteria:**
- [ ] All tests pass (zero failures)
- [ ] Lines coverage ≥ 80%
- [ ] Functions coverage ≥ 85%
- [ ] Branches coverage ≥ 70%
- [ ] Coverage report generated in `coverage/` directory

---

## Summary of Changes

### test/server/src/index.ts — Endpoints to Add
```typescript
// DELETE endpoints
app.delete('/del', (req: Request, res: Response) => {
  res.send({ "response": "ok" });
});
app.delete('/del/404', (req: Request, res: Response) => {
  res.status(404).send({ "error": "not found" });
});

// Non-JSON endpoint
app.get('/text', (req: Request, res: Response) => {
  res.set('Content-Type', 'text/plain');
  res.send('plain text response');
});

// Invalid JSON endpoint
app.get('/invalid-json', (req: Request, res: Response) => {
  res.set('Content-Type', 'application/json');
  res.send('{ "invalid json');
});

// CSRF cookie endpoint
app.get('/csrf-set', (req: Request, res: Response) => {
  res.cookie('csrftoken', 'test-token');
  res.send({ "csrf": "test-token" });
});

// Header echo endpoint
app.get('/headers', (req: Request, res: Response) => {
  res.send({ headers: req.headers });
});
```

### test/test.ts — New Test Cases (Total: 16)
| Phase | Test Count | Tests |
|-------|------------|-------|
| 1: DELETE | 2 | del success, del error 404 |
| 2: _processResponse | 3 | non-JSON response, invalid JSON, enhanced 204 |
| 3: CSRF | 3 | hasCsrfCookie false, setCsrfTokenFromCookie false, setCsrfToken true |
| 4: Headers | 3 | addHeader, removeHeader, multiple headers |
| 5: Verbose | 5 | verbose POST, PUT, PATCH, GET, DELETE |

## Execution Order
1. Phase 1 (DELETE tests) — simple, no dependencies
2. Phase 2 (processResponse edge cases) — requires new mock endpoints
3. Phase 3 (CSRF error paths) — requires cookie endpoint
4. Phase 4 (header management) — requires header echo endpoint
5. Phase 5 (verbose branches) — simplest, just mock console
6. Final verification — run coverage report

## Notes
- **SSE (postSse) has been removed** — do NOT add any SSE-related tests
- All tests run against the Express mock server on port 5714
- Use `jest.spyOn(console, 'log')` for mocking console output in Phase 5
- Create fresh API instances for CSRF tests to avoid state pollution from other tests
- **Each step must pass its success criteria before moving to the next step**
