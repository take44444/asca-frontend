# Tasks: User Authentication

**Input**: Design documents from `/specs/002-user-auth/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Test tasks are mandatory for this feature. Write each story's tests before implementation, observe the failing state, then implement.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other marked tasks in the same phase because it touches different files and does not depend on incomplete work
- **[Story]**: User story label for traceability, required only in user story phases
- Each task includes exact repository file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing Next.js/Auth.js test surface and local configuration expectations before behavior work begins.

- [ ] T001 Read installed Next.js authentication, Route Handler, redirect, Proxy, and Server/Client Component docs listed in `specs/002-user-auth/plan.md`
- [ ] T002 [P] Document required local auth variables in `.env.example`
- [ ] T003 [P] Add reusable auth test mock helpers for Auth.js boundaries in `tests/unit/auth-test-helpers.ts`
- [ ] T004 [P] Add Playwright auth storage/session helper scaffolding in `tests/e2e/auth-test-helpers.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare typed contracts and test seams used by every auth story without implementing user-visible auth behavior.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [ ] T005 Define typed `AuthenticatedUser` and `UserSession` DTOs in `lib/auth-session.ts`
- [ ] T006 [P] Add Auth.js module augmentation for typed session user fields in `types/next-auth.d.ts`
- [ ] T007 [P] Add route/action mock reset utilities for auth tests in `tests/unit/auth-test-helpers.ts`
- [ ] T008 Add export-safe auth boundary placeholders and docstrings in `auth.ts`

**Checkpoint**: Auth types and test seams are ready; user story work can begin.

---

## Phase 3: User Story 1 - Sign In With Google (Priority: P1) MVP

**Goal**: An unauthenticated visitor can navigate from the header to `/login`, see a focused Google sign-in screen, and start Google authentication.

**Independent Test**: Visit the site signed out, select `Sign In` in the header, confirm `/login` content, select `Sign in with Google`, and verify the Google provider sign-in boundary starts with callback `/`.

### Tests for User Story 1 (MANDATORY - write before implementation)

- [ ] T009 [P] [US1] Add failing unit tests for signed-out header `/login` link in `tests/unit/app-header-auth.test.tsx`
- [ ] T010 [P] [US1] Add failing unit tests for `/login` heading, Google mark, retry action, pending state, and error state in `tests/unit/login-page.test.tsx`
- [ ] T011 [P] [US1] Add failing unit tests for Google sign-in action callback behavior in `tests/unit/auth-actions.test.ts`
- [ ] T012 [P] [US1] Add failing Playwright test for signed-out header navigation and login page provider start in `tests/e2e/auth.spec.ts`

### Implementation for User Story 1

- [ ] T013 [US1] Implement Auth.js Google provider configuration and `signIn` export in `auth.ts`
- [ ] T014 [US1] Implement App Router Auth.js GET/POST route handler in `app/api/auth/[...nextauth]/route.ts`
- [ ] T015 [US1] Implement typed Google sign-in server action with callback `/` and recoverable error result in `lib/auth-actions.ts`
- [ ] T016 [US1] Implement focused login page with Google action, pending state, and error retry path in `app/login/page.tsx`
- [ ] T017 [US1] Wire signed-out header `Sign In` link to `/login` while preserving existing controls in `components/layout/app-header.tsx`
- [ ] T018 [US1] Verify US1 tests fail before implementation and pass after implementation using `tests/unit/login-page.test.tsx`, `tests/unit/auth-actions.test.ts`, `tests/unit/app-header-auth.test.tsx`, and `tests/e2e/auth.spec.ts`

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Maintain Authenticated Session (Priority: P2)

**Goal**: A successful Google sign-in returns the user to `/` and maintains a JWT-backed session containing name, email, and optional profile picture.

**Independent Test**: Mock or complete Google sign-in, confirm redirect to `/`, and verify session helpers expose name, email, and image without database-backed session storage.

### Tests for User Story 2 (MANDATORY - write before implementation)

- [ ] T019 [P] [US2] Add failing unit tests for session DTO normalization, required name/email validation, and optional image handling in `tests/unit/auth-session.test.ts`
- [ ] T020 [P] [US2] Add failing unit tests for Auth.js JWT session callbacks and Google profile fields in `tests/unit/auth-config.test.ts`
- [ ] T021 [P] [US2] Add failing Playwright test for mocked successful sign-in redirect to `/` in `tests/e2e/auth.spec.ts`

### Implementation for User Story 2

- [ ] T022 [US2] Implement JWT session strategy, Google basic profile scope, and typed callbacks in `auth.ts`
- [ ] T023 [US2] Implement `getCurrentUserSession` and session normalization in `lib/auth-session.ts`
- [ ] T024 [US2] Add deterministic signed-in session mocking support for e2e tests in `tests/e2e/auth-test-helpers.ts`
- [ ] T025 [US2] Verify US2 tests fail before implementation and pass after implementation using `tests/unit/auth-session.test.ts`, `tests/unit/auth-config.test.ts`, and `tests/e2e/auth.spec.ts`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Show Profile And Sign Out (Priority: P3)

**Goal**: An authenticated user sees profile information in the header instead of `Sign In` and can sign out from the profile popover.

**Independent Test**: Mock an authenticated session, inspect the header profile trigger, verify avatar image/fallback behavior, open the menu, select `Sign Out`, and confirm redirect `/`.

### Tests for User Story 3 (MANDATORY - write before implementation)

- [ ] T026 [P] [US3] Add failing unit tests for authenticated header name, email, image avatar, fallback initial, and absence of sign-in link in `tests/unit/app-header-auth.test.tsx`
- [ ] T027 [P] [US3] Add failing unit tests for sign-out action redirect behavior in `tests/unit/auth-actions.test.ts`
- [ ] T028 [P] [US3] Add failing Playwright test for authenticated header profile popover and sign-out flow in `tests/e2e/auth.spec.ts`

### Implementation for User Story 3

- [ ] T029 [US3] Implement typed sign-out server action with redirect `/` in `lib/auth-actions.ts`
- [ ] T030 [US3] Implement authenticated profile trigger, popover content, avatar image, fallback initial, and sign-out form in `components/layout/app-header.tsx`
- [ ] T031 [US3] Adjust avatar primitive behavior for auth image and fallback accessibility in `components/ui/avatar.tsx`
- [ ] T032 [US3] Verify US3 tests fail before implementation and pass after implementation using `tests/unit/app-header-auth.test.tsx`, `tests/unit/auth-actions.test.ts`, and `tests/e2e/auth.spec.ts`

**Checkpoint**: User Stories 1, 2, and 3 work independently.

---

## Phase 6: User Story 4 - Protect Run A.S.C.A. (Priority: P4)

**Goal**: Only authenticated users can access `/run`; signed-out visitors redirect to `/login` before protected content is visible.

**Independent Test**: Visit `/run` signed out and confirm redirect to `/login`; visit `/run` with mocked signed-in session and confirm the `Run A.S.C.A.` heading renders.

### Tests for User Story 4 (MANDATORY - write before implementation)

- [ ] T033 [P] [US4] Add failing unit tests for `/run` server-side signed-out redirect and signed-in render behavior in `tests/unit/run-page-auth.test.tsx`
- [ ] T034 [P] [US4] Add failing Playwright tests for signed-out `/run` redirect and signed-in `/run` access in `tests/e2e/auth.spec.ts`

### Implementation for User Story 4

- [ ] T035 [US4] Add server-side session guard and `redirect('/login')` behavior in `app/run/page.tsx`
- [ ] T036 [US4] Optionally add optimistic `/run` redirect Proxy that delegates final authorization to the page guard in `proxy.ts`
- [ ] T037 [US4] Verify US4 tests fail before implementation and pass after implementation using `tests/unit/run-page-auth.test.tsx` and `tests/e2e/auth.spec.ts`

**Checkpoint**: All user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation, accessibility, coverage, and release quality for the complete auth feature.

- [ ] T038 [P] Update auth setup and validation notes in `specs/002-user-auth/quickstart.md`
- [ ] T039 [P] Add missing accessibility assertions for login errors, pending state, profile popover keyboard reachability, and redirect focus behavior in `tests/unit/login-page.test.tsx`
- [ ] T040 [P] Add missing accessibility assertions for profile popover keyboard reachability in `tests/unit/app-header-auth.test.tsx`
- [ ] T041 Run coverage verification and confirm changed auth behavior remains at or above 80% using `package.json`
- [ ] T042 Run lint, format, typecheck, unit tests, e2e tests, and build using `package.json`
- [ ] T043 Validate all quickstart scenarios manually or with deterministic mocks and record any credential limitations in `specs/002-user-auth/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks user story implementation.
- **User Stories (Phases 3-6)**: Depend on Foundational completion. Implement in priority order for safest delivery, or in parallel with clear file ownership.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on later stories. This is the MVP.
- **User Story 2 (P2)**: Starts after Foundational; integrates with Auth.js config created for US1 but remains independently testable through session helpers.
- **User Story 3 (P3)**: Starts after Foundational; requires session data from US2 for full behavior but can be mocked independently in tests.
- **User Story 4 (P4)**: Starts after Foundational; requires session guard helpers from US2 but can be tested independently with signed-out/signed-in mocks.

### Within Each User Story

- Write story tests first and observe failing results.
- Implement typed models/session helpers before UI or route integration when both are needed.
- Implement server actions and Auth.js boundaries before components that invoke them.
- Complete and verify a story before moving to the next priority when working sequentially.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001.
- T006 and T007 can run in parallel with T005 once the DTO shape is agreed.
- US1 tests T009-T012 can run in parallel before US1 implementation.
- US2 tests T019-T021 can run in parallel before US2 implementation.
- US3 tests T026-T028 can run in parallel before US3 implementation.
- US4 tests T033-T034 can run in parallel before US4 implementation.
- After Phase 2, US1 through US4 can be staffed in parallel if teams coordinate ownership of `auth.ts`, `lib/auth-actions.ts`, `components/layout/app-header.tsx`, and `tests/e2e/auth.spec.ts`.

---

## Parallel Example: User Story 1

```bash
# Tests that can be authored together before implementation:
Task: "T009 [US1] Add failing unit tests for signed-out header `/login` link in tests/unit/app-header-auth.test.tsx"
Task: "T010 [US1] Add failing unit tests for `/login` heading, Google mark, retry action, pending state, and error state in tests/unit/login-page.test.tsx"
Task: "T011 [US1] Add failing unit tests for Google sign-in action callback behavior in tests/unit/auth-actions.test.ts"
Task: "T012 [US1] Add failing Playwright test for signed-out header navigation and login page provider start in tests/e2e/auth.spec.ts"
```

## Parallel Example: User Story 2

```bash
# Tests that can be authored together before implementation:
Task: "T019 [US2] Add failing unit tests for session DTO normalization, required name/email validation, and optional image handling in tests/unit/auth-session.test.ts"
Task: "T020 [US2] Add failing unit tests for Auth.js JWT session callbacks and Google profile fields in tests/unit/auth-config.test.ts"
Task: "T021 [US2] Add failing Playwright test for mocked successful sign-in redirect to `/` in tests/e2e/auth.spec.ts"
```

## Parallel Example: User Story 3

```bash
# Tests that can be authored together before implementation:
Task: "T026 [US3] Add failing unit tests for authenticated header name, email, image avatar, fallback initial, and absence of sign-in link in tests/unit/app-header-auth.test.tsx"
Task: "T027 [US3] Add failing unit tests for sign-out action redirect behavior in tests/unit/auth-actions.test.ts"
Task: "T028 [US3] Add failing Playwright test for authenticated header profile popover and sign-out flow in tests/e2e/auth.spec.ts"
```

## Parallel Example: User Story 4

```bash
# Tests that can be authored together before implementation:
Task: "T033 [US4] Add failing unit tests for `/run` server-side signed-out redirect and signed-in render behavior in tests/unit/run-page-auth.test.tsx"
Task: "T034 [US4] Add failing Playwright tests for signed-out `/run` redirect and signed-in `/run` access in tests/e2e/auth.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for User Story 1.
3. Stop and validate the signed-out header link, `/login` UI, and Google sign-in initiation.
4. Demo the MVP before adding authenticated-session, profile, or `/run` protection work.

### Incremental Delivery

1. Deliver US1: signed-out navigation and Google sign-in initiation.
2. Deliver US2: JWT-backed session persistence and typed session data.
3. Deliver US3: authenticated header profile and sign-out.
4. Deliver US4: protected `/run` route.
5. Run Phase 7 quality gates and quickstart validation.

### Parallel Team Strategy

1. Complete Setup and Foundational phases together.
2. Split story work by primary files:
   - US1: `app/login/page.tsx`, `app/api/auth/[...nextauth]/route.ts`, initial `auth.ts`
   - US2: `lib/auth-session.ts`, Auth.js callbacks in `auth.ts`
   - US3: `components/layout/app-header.tsx`, `components/ui/avatar.tsx`, `lib/auth-actions.ts`
   - US4: `app/run/page.tsx`, optional `proxy.ts`
3. Coordinate edits to shared files `auth.ts`, `lib/auth-actions.ts`, and `tests/e2e/auth.spec.ts`.

## Notes

- [P] tasks are parallelizable only when assigned without shared-file conflicts.
- Do not commit real OAuth credentials; use `.env.local` for local values.
- Live Google OAuth should not be required for CI; use deterministic unit mocks and Playwright session helpers.
- Stop at each story checkpoint to validate independent behavior before continuing.
