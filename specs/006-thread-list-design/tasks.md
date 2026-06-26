# Tasks: Thread List Design

**Input**: Design documents from `specs/006-thread-list-design/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Test tasks are mandatory because the project constitution requires TDD and the plan requires coverage for changed behavior. Write each story's tests first, observe the failing state, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or depends only on completed earlier phases.
- **[Story]**: User story label for story phases only.
- Every task includes exact repository file paths.

## Phase 1: Setup (Shared Orientation)

**Purpose**: Confirm implementation constraints and local entry points before changing behavior.

- [ ] T001 [P] Review installed Client Component guidance in node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md before editing app/run/run-asca-chat.tsx
- [ ] T002 [P] Review the thread list UI contract in specs/006-thread-list-design/contracts/ui-contract.md before editing components/run-asca/thread-list.tsx
- [ ] T003 [P] Review existing Run A.S.C.A. coverage in tests/unit/run-asca-chat.test.tsx and tests/e2e/run-asca.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared typed demonstration-thread data model used by all user stories.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [ ] T004 [P] Expand ThreadId typing and exported documentation for 20 static demonstration ids in components/run-asca/types.ts
- [ ] T005 [P] Create typed static demonstration thread fixtures with exactly 20 entries in components/run-asca/thread-fixtures.ts
- [ ] T006 Integrate the fixture builder into app/run/run-asca-chat.tsx so the live demo thread uses current chat messages and the other 19 threads use static messages
- [ ] T007 Verify `npm run typecheck` fails or passes only because of foundational type changes, and record any required fixes against components/run-asca/types.ts

**Checkpoint**: The app can construct 20 typed threads without introducing backend fetching or changing the existing chat route contract.

---

## Phase 3: User Story 1 - Browse Available Threads (Priority: P1) MVP

**Goal**: Users can see a bounded left-side thread list with a visible disabled create-thread control and 20 demonstration entries with titles and message counts.

**Independent Test**: Open Run A.S.C.A. and verify the left-side list contains the create-thread control and 20 entries, each with a title and message count.

### Tests for User Story 1 (write first, ensure they fail)

- [ ] T008 [P] [US1] Add unit assertions for exactly 20 rendered thread buttons, visible titles, visible message counts, and no thread-list fetch calls in tests/unit/run-asca-chat.test.tsx
- [ ] T009 [P] [US1] Add Playwright assertions for the left-side thread list, disabled `Create New Thread` control, and 20 accessible thread entries in tests/e2e/run-asca.spec.ts

### Implementation for User Story 1

- [ ] T010 [US1] Refactor components/run-asca/thread-list.tsx to render the outer thread list with Card, CardHeader, and CardContent from components/ui/card.tsx
- [ ] T011 [US1] Update the create-thread header button in components/run-asca/thread-list.tsx to use Button from components/ui/button.tsx and MessageSquarePlusIcon from components/icons/lucide-message-square-plus.tsx with visible text `Create New Thread`
- [ ] T012 [US1] Render all 20 thread entries with title and derived message count in components/run-asca/thread-list.tsx
- [ ] T013 [US1] Preserve the complementary region label `Run A.S.C.A. threads` and selected-state accessibility in components/run-asca/thread-list.tsx
- [ ] T014 [US1] Run the targeted US1 tests in tests/unit/run-asca-chat.test.tsx and tests/e2e/run-asca.spec.ts and confirm User Story 1 passes independently

**Checkpoint**: User Story 1 is complete and independently demonstrable as the MVP.

---

## Phase 4: User Story 2 - Navigate to a Thread (Priority: P2)

**Goal**: Users can select any visible thread and see the matching right-side conversation content with selected-thread styling in the list.

**Independent Test**: Select multiple visible thread entries and verify the selected state, conversation title, message count, and messages update to match each selected thread.

### Tests for User Story 2 (write first, ensure they fail)

- [ ] T015 [P] [US2] Add unit coverage for selecting non-live static threads and returning to the live demonstration thread in tests/unit/run-asca-chat.test.tsx
- [ ] T016 [P] [US2] Add Playwright coverage for switching through at least five thread entries and verifying right-side content changes in tests/e2e/run-asca.spec.ts

### Implementation for User Story 2

- [ ] T017 [US2] Update selected-thread derivation in app/run/run-asca-chat.tsx so ConversationPanel receives the thread matching selectedThreadId
- [ ] T018 [US2] Ensure components/run-asca/thread-list.tsx visually distinguishes the selected thread without changing the disabled create-thread button
- [ ] T019 [US2] Ensure prompt submission in app/run/run-asca-chat.tsx preserves existing chat behavior and uses the current selectedThreadId in the existing `/api/asca/chat` request body
- [ ] T020 [US2] Run the targeted US2 tests in tests/unit/run-asca-chat.test.tsx and tests/e2e/run-asca.spec.ts and confirm User Story 2 passes independently

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Handle Long Thread Lists (Priority: P3)

**Goal**: Users can browse all 20 threads when the list exceeds viewport height without moving the right-side conversation out of view.

**Independent Test**: Use a shorter viewport, scroll the thread list independently, reach lower entries, and confirm the conversation panel remains visible and usable.

### Tests for User Story 3 (write first, ensure they fail)

- [ ] T021 [P] [US3] Add unit assertions for the scrollable thread-list content container class and fixed header behavior in tests/unit/run-asca-chat.test.tsx
- [ ] T022 [P] [US3] Add Playwright coverage for independent thread-list scrolling and reaching the twentieth thread while the conversation remains visible in tests/e2e/run-asca.spec.ts

### Implementation for User Story 3

- [ ] T023 [US3] Apply min-height, overflow, and containment classes to the card content area in components/run-asca/thread-list.tsx so entries scroll independently
- [ ] T024 [US3] Adjust workspace sizing or responsive layout classes in app/run/run-asca-chat.tsx only if needed to keep thread list scrolling independent from the conversation panel
- [ ] T025 [US3] Run the targeted US3 tests in tests/unit/run-asca-chat.test.tsx and tests/e2e/run-asca.spec.ts and confirm User Story 3 passes independently

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate edge cases, coverage, and full project quality gates.

- [ ] T026 [P] Add edge-case unit coverage for long thread titles, zero-message counts, and multi-digit message counts in tests/unit/run-asca-chat.test.tsx
- [ ] T027 [P] Add or update responsive non-overlap Playwright checks for thread title, message count, create-thread control, and conversation content in tests/e2e/run-asca.spec.ts
- [ ] T028 Run `npm run lint` and fix any reported issues in components/run-asca/thread-list.tsx, app/run/run-asca-chat.tsx, and components/run-asca/types.ts
- [ ] T029 Run `npm run typecheck` and fix any reported issues in components/run-asca/thread-fixtures.ts, components/run-asca/types.ts, and app/run/run-asca-chat.tsx
- [ ] T030 Run `npm run test` and fix any reported regressions in tests/unit/run-asca-chat.test.tsx
- [ ] T031 Run `npm run test:coverage` and ensure changed behavior maintains at least 80% coverage for tests/unit/run-asca-chat.test.tsx
- [ ] T032 Run `npm run test:e2e` and fix any reported regressions in tests/e2e/run-asca.spec.ts
- [ ] T033 Run `npm run build` and fix any production build issues in app/run/run-asca-chat.tsx and components/run-asca/thread-list.tsx
- [ ] T034 Validate the manual scenarios in specs/006-thread-list-design/quickstart.md against the implemented Run A.S.C.A. page

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on setup orientation; blocks all user stories.
- **Phase 3 US1**: Depends on foundational typed thread fixtures.
- **Phase 4 US2**: Depends on foundational typed thread fixtures; can start after US1 tests define the visible thread-list contract.
- **Phase 5 US3**: Depends on the thread list rendered by US1; can proceed in parallel with US2 after US1 implementation exists.
- **Phase 6 Polish**: Depends on all selected user stories being implemented.

### User Story Dependencies

- **US1 Browse Available Threads**: MVP; must be delivered first because US2 and US3 depend on visible thread entries.
- **US2 Navigate to a Thread**: Depends on the 20-entry list and shared fixtures from US1/Foundation.
- **US3 Handle Long Thread Lists**: Depends on the 20-entry list from US1, but not on US2 selection behavior.

### Within Each User Story

- Write story tests before implementation and confirm they fail.
- Complete implementation tasks in listed order for the same file.
- Run the targeted story validation task before moving to the next story checkpoint.

## Parallel Opportunities

- Setup review tasks T001-T003 can run in parallel.
- Foundational type and fixture tasks T004-T005 can run in parallel before T006.
- US1 test tasks T008-T009 can run in parallel.
- US2 test tasks T015-T016 can run in parallel.
- US3 test tasks T021-T022 can run in parallel.
- Polish edge-case test additions T026-T027 can run in parallel after all stories pass.

## Parallel Example: User Story 1

```bash
Task: "T008 [P] [US1] Add unit assertions for exactly 20 rendered thread buttons, visible titles, visible message counts, and no thread-list fetch calls in tests/unit/run-asca-chat.test.tsx"
Task: "T009 [P] [US1] Add Playwright assertions for the left-side thread list, disabled Create New Thread control, and 20 accessible thread entries in tests/e2e/run-asca.spec.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T015 [P] [US2] Add unit coverage for selecting non-live static threads and returning to the live demonstration thread in tests/unit/run-asca-chat.test.tsx"
Task: "T016 [P] [US2] Add Playwright coverage for switching through at least five thread entries and verifying right-side content changes in tests/e2e/run-asca.spec.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T021 [P] [US3] Add unit assertions for the scrollable thread-list content container class and fixed header behavior in tests/unit/run-asca-chat.test.tsx"
Task: "T022 [P] [US3] Add Playwright coverage for independent thread-list scrolling and reaching the twentieth thread while the conversation remains visible in tests/e2e/run-asca.spec.ts"
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for User Story 1.
3. Stop and validate the MVP: 20 visible demonstration threads, disabled create-thread control, title and message counts, no backend thread fetch.

### Incremental Delivery

1. Add US1 browse experience and validate independently.
2. Add US2 selection behavior and validate right-side content updates.
3. Add US3 independent scrolling and validate viewport behavior.
4. Complete polish and full quality gates.

### TDD Enforcement

- For each user story, run the new unit and E2E tests before implementation and observe failure.
- Implement only the minimum behavior needed for that story checkpoint.
- Re-run targeted tests, then continue to the next story.
