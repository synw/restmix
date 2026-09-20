# Task State: improve-test-coverage

## Status: planned (not started)

## Organization
This task uses a coordinator-executor model:
- **Coordinator Agent** reads `execute-instructions.md` and delegates phases
- **Executor Agents** read only their assigned phase file in `phases/` directory

## Phase Files
| Phase | File | Steps |
|-------|------|-------|
| 1: DELETE method tests | `phases/phase-1.md` | 3 |
| 2: _processResponse() edge cases | `phases/phase-2.md` | 4 |
| 3: CSRF error paths | `phases/phase-3.md` | 4 |
| 4: Header management | `phases/phase-4.md` | 4 |
| 5: Verbose/debug branches | `phases/phase-5.md` | 5 |
| 6: Get the coverage stats | `phases/phase-6.md` | 1 |

## Progress

### Phase 1: DELETE method tests ✅ COMPLETED
- [x] Step 1.1: Add DELETE mock endpoints in test server
- [x] Step 1.2: Add DELETE success test
- [x] Step 1.3: Add DELETE error test

### Phase 2: _processResponse() edge cases ✅ COMPLETED
- [x] Step 2.1: Add non-JSON Content-Type mock endpoints
- [x] Step 2.2: Add test for non-JSON response
- [x] Step 2.3: Add test for invalid JSON parsing
- [x] Step 2.4: Enhance 204 test with additional assertions

### Phase 3: CSRF error paths ✅ COMPLETED
- [x] Step 3.1: Add CSRF cookie mock endpoint
- [x] Step 3.2: Add test for hasCsrfCookie returns false
- [x] Step 3.3: Add test for setCsrfTokenFromCookie returns false (no cookie)
- [x] Step 3.4: Add test for setCsrfTokenFromCookie returns true (with cookie)

### Phase 4: Header management ✅ COMPLETED
- [x] Step 4.1: Add header echo mock endpoint
- [x] Step 4.2: Add test for addHeader and verify in request
- [x] Step 4.3: Add test for removeHeader clears headers
- [x] Step 4.4: Add test for multiple headers and partial removal

### Phase 5: Verbose/debug branches ✅ COMPLETED
- [x] Step 5.1: Add test for verbose POST
- [x] Step 5.2: Add test for verbose PUT
- [x] Step 5.3: Add test for verbose PATCH
- [x] Step 5.4: Add test for verbose GET
- [x] Step 5.5: Add test for verbose DELETE

### Phase 6: Get the coverage stats ✅ COMPLETED
- [x] Step 6: read the coverage stats and report

## Coverage Targets
| Metric | Current | Target |
|--------|---------|--------|
| Lines | 57.6% | ≥80% |
| Functions | 71.4% | ≥85% |
| Branches | 56.3% | ≥70% |

## Notes
- Task created on: [date]
- Last updated: [date]
- Next phase to execute: Phase 1 (if starting fresh)
- Coordinator reads `execute-instructions.md` for orchestration instructions
- Executors read only their assigned `phases/phase-X.md` file

When the task is finished present the coverage stats to the user in a Mermaid chart