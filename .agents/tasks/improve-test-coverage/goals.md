# Goals and Success Criteria: improve-test-coverage

## Primary Goal
Increase test coverage for the Restmix project from current levels to meet or exceed targets:
- **Lines:** 57.6% → ≥80%
- **Functions:** 71.4% → ≥85%
- **Branches:** 56.3% → ≥70%

## Success Criteria

### Functional Criteria
1. **All 5 phases completed** — all planned test cases implemented
2. **All tests pass** — `npm test` runs successfully with zero failures
3. **No regressions** — all existing tests continue to pass
4. **16+ new test cases** added across all phases

### Phase-Specific Criteria

#### Phase 1: DELETE method tests
- [ ] DELETE endpoint `/del` returns `{ "response": "ok" }` with 200 status
- [ ] DELETE endpoint `/del/404` returns 404 status
- [ ] Test for successful DELETE passes
- [ ] Test for DELETE error response passes

#### Phase 2: _processResponse() edge cases
- [ ] `/text` endpoint returns plain text with `Content-Type: text/plain`
- [ ] `/invalid-json` endpoint returns malformed JSON with `Content-Type: application/json`
- [ ] Non-JSON response test verifies `res.text` is populated
- [ ] Invalid JSON test verifies `console.warn` is called
- [ ] 204 test verifies `res.text === ""` and no parsing attempted

#### Phase 3: CSRF error paths
- [ ] `/csrf-set` endpoint sets `csrftoken` cookie
- [ ] `hasCsrfCookie()` returns `false` when no cookie present
- [ ] `setCsrfTokenFromCookie(true)` returns `false` when no cookie, logs message
- [ ] `setCsrfTokenFromCookie(true)` returns `true` and sets token when cookie present

#### Phase 4: Header management
- [ ] `/headers` endpoint echoes request headers
- [ ] `removeHeader()` clears specific header
- [ ] `addHeader()` headers are included in requests
- [ ] Multiple headers work correctly with partial removal

#### Phase 5: Verbose/debug branches
- [ ] `verbose=true` on POST triggers `console.log` with URL and options
- [ ] `verbose=true` on PUT triggers `console.log` with URL and options
- [ ] `verbose=true` on PATCH triggers `console.log` with URL and options
- [ ] `verbose=true` on GET triggers `console.log` with URL and options
- [ ] `verbose=true` on DELETE triggers `console.log` with URL and options

### Coverage Criteria
- Run `npm test -- --coverage` and verify:
  - Lines coverage ≥80%
  - Functions coverage ≥85%
  - Branches coverage ≥70%

## Files Modified
- `test/server/src/index.ts` — Add mock endpoints
- `test/test.ts` — Add test cases

## Exclusions
- **SSE (postSse) testing excluded** — feature removed from project
