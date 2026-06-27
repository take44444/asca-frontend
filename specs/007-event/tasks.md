# Tasks: Event View

**Input**: Design documents from `/specs/007-event/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-contract.md`, `quickstart.md`

**Tests**: Tests are mandatory and precede production changes for every user story. Observe the failing state before implementing each story, then retain the tests as regression coverage.

**Organization**: Tasks are grouped by user story so the core event content, source recognition, and bounded scrolling can be implemented and validated as explicit increments.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks marked `[P]` in the same phase because it changes a different file and has no dependency on an incomplete task
- **[Story]**: Maps a task to User Story 1, 2, or 3
- Every task names the exact file or files it reads or changes

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the installed framework guidance and existing local component contracts before changing code.

- [x] T001 Review the installed client composition and accessibility guidance in `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `node_modules/next/dist/docs/03-architecture/accessibility.md`
- [x] T002 [P] Review the reusable APIs in `components/ui/card.tsx`, `components/ui/item.tsx`, `components/ui/badge.tsx`, `components/icons/logos-slack-icon.tsx`, `components/icons/logos-microsoft-teams.tsx`, `components/icons/logos-discord-icon.tsx`, `components/icons/logos-x.tsx`, and `components/icons/logos-github-icon.tsx`

---

## Phase 2: Test Foundation (Blocking Prerequisites)

**Purpose**: Confirm the existing test harness and authenticated browser setup that every story uses for Red-Green-Refactor.

**⚠️ CRITICAL**: Complete this phase before writing story-specific tests so each failing state is attributable to missing Event View behavior rather than harness setup.

- [x] T003 Review the existing render helpers and authenticated browser setup to identify the reusable test entry points in `tests/unit/run-asca-test-helpers.ts`, `tests/unit/run-asca-chat.test.tsx`, `tests/e2e/auth-test-helpers.ts`, and `tests/e2e/run-asca.spec.ts`

**Checkpoint**: Unit and browser test entry points are understood; no production code has changed before the first failing story tests.

---

## Phase 3: User Story 1 - Review Thread-Related Events (Priority: P1) 🎯 MVP

**Goal**: Show a bounded Events card for the selected A.S.C.A. thread, with sender, optional external-thread badge, content, and human-readable date for every local event.

**Independent Test**: Open the default thread and verify a complementary region titled `Events` contains exactly 20 non-interactive items with sender, content, and dates; switch to a non-default thread and verify the same region changes to exactly three associated items, with `in: {thread}` rendered only when the field exists and no event fetch performed.

### Tests for User Story 1 (write first and observe failure) ⚠️

- [X] T004 [P] [US1] Add failing unit tests for the Events region, required fields, optional `in:` badges, non-interactive items, locale-formatted dates, no event fetch, thread switching, and fixture integrity including unique IDs, owner-key matches, 20 `demo` records, three records for every other `ThreadId`, all five sources, and valid ISO timestamps in `tests/unit/run-asca-chat.test.tsx`
- [X] T005 [P] [US1] Add failing authenticated Playwright coverage for the 20-event default view and three-event non-default thread switch in `tests/e2e/run-asca.spec.ts`
- [X] T006 [US1] Run the User Story 1 tests from `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts`, record that the new assertions fail for the missing event view, and make no production change in this task

### Implementation for User Story 1

- [X] T007 [US1] Add documented `EventApp`, `ThreadEvent`, `EventsByThread`, and `EventViewProps` contracts without `any` in `components/run-asca/types.ts`, then create the deterministic fixture map with 20 varied `demo` records and three records for every other `ThreadId` in `components/run-asca/event-fixtures.ts`
- [X] T008 [US1] Implement the semantic complementary Events card and non-interactive list items using Card, Item, and Badge primitives, including sender, conditional `in: {thread}`, content, and `Intl.DateTimeFormat` output in `components/run-asca/event-view.tsx`
- [X] T009 [US1] Derive the selected thread's event array from `selectedThreadId` and compose `EventView` into the existing workspace without changing `/api/asca/chat` behavior in `app/run/run-asca-chat.tsx`
- [X] T010 [US1] Run the focused User Story 1 unit and Playwright cases in `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts` until the core event-content and thread-switching increment passes

**Checkpoint**: User Story 1 is independently demonstrable as the MVP, including thread association and optional-label behavior.

---

## Phase 4: User Story 2 - Identify Event Sources (Priority: P2)

**Goal**: Make every event's Slack, Microsoft Teams, Discord, X, or GitHub source recognizable visually and accessible by name.

**Independent Test**: Render representative events for all five closed `EventApp` values and verify each item shows its matching left-side logo with an accessible application name and no fallback source path.

### Tests for User Story 2 (write first and observe failure) ⚠️

- [X] T011 [P] [US2] Add failing unit cases that cover all five `EventApp` values, assert accessible Slack, Microsoft Teams, Discord, X, and GitHub names, and verify the icon remains associated with its event in `tests/unit/run-asca-chat.test.tsx`
- [X] T012 [P] [US2] Add a failing Playwright assertion that the default event set exposes all five application sources in `tests/e2e/run-asca.spec.ts`
- [X] T013 [US2] Run the User Story 2 tests from `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts`, record that source-recognition assertions fail, and make no production change in this task

### Implementation for User Story 2

- [X] T014 [US2] Add an exhaustive typed `EventApp`-to-logo-and-accessible-name mapping using the existing five logo components and render it on the left of each item in `components/run-asca/event-view.tsx`
- [X] T015 [US2] Run the focused User Story 2 unit and Playwright cases in `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts` until all five source mappings pass without weakening User Story 1 coverage

**Checkpoint**: All supported applications are distinguishable visually and by assistive technology.

---

## Phase 5: User Story 3 - Browse a Long Event History (Priority: P3)

**Goal**: Keep long event history independently scrollable and responsive without moving or overlapping the conversation and surrounding thread interface.

**Independent Test**: At 1280px width and a short viewport, verify Events is right of Conversation and its last item becomes reachable by scrolling only the event viewport while the heading and conversation remain usable; below `xl`, verify Events stacks after Conversation without overlap.

### Tests for User Story 3 (write first and observe failure) ⚠️

- [X] T016 [P] [US3] Add failing unit assertions for a separately identifiable event viewport, persistent Events heading, bounded overflow classes, and long sender/thread/content containment in `tests/unit/run-asca-chat.test.tsx`
- [X] T017 [P] [US3] Add failing Playwright coverage for the 1280px two-column placement, below-`xl` stacking order, independent event scrolling to the final item, persistent heading, stationary conversation, and non-overlap in `tests/e2e/run-asca.spec.ts`
- [X] T018 [US3] Run the User Story 3 tests from `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts`, record that responsive placement and independent-scroll assertions fail, and make no production change in this task

### Implementation for User Story 3

- [X] T019 [P] [US3] Add a bounded flex layout, stable heading, independently scrollable event content viewport, and overflow-safe sender, badge, description, and date styling in `components/run-asca/event-view.tsx`
- [X] T020 [P] [US3] Change the post-metadata content area to stack Conversation then Events below `xl` and use a minmax conversation column plus a 22rem Events column at `xl` in `app/run/run-asca-chat.tsx`
- [X] T021 [US3] Run the focused User Story 3 unit and Playwright cases in `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts` until scroll, placement, containment, and prior-story regressions pass

**Checkpoint**: All three user stories are functional at supported responsive widths and short viewport heights.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate fixture integrity, accessibility, coverage, and all repository quality gates across the completed feature.

- [X] T022 [P] Audit the rendered semantics, accessible source names, keyboard non-interaction, long-text readability, and visual associations against `specs/007-event/contracts/ui-contract.md` in `components/run-asca/event-view.tsx`
- [X] T023 [P] Review exported event contracts and components for required docstrings, explicit stable types, and absence of `any` in `components/run-asca/types.ts`, `components/run-asca/event-fixtures.ts`, and `components/run-asca/event-view.tsx`
- [X] T024 Run the `npm run format`, `npm run lint`, and `npm run typecheck` gates defined in `package.json`, resolving failures only in Event View files and their tests
- [X] T025 Run the `npm run test` and `npm run test:coverage` gates defined in `package.json` and `jest.config.ts`, and verify Event View behavior in `tests/unit/run-asca-chat.test.tsx` remains at or above 80% coverage
- [X] T026 Run `npm run test:e2e` and resolve Event View regressions in `tests/e2e/run-asca.spec.ts` without changing existing authentication, metadata, thread, or chat behavior
- [X] T027 Run `npm run build` and manually execute every validation scenario documented in `specs/007-event/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001 and T002 can run in parallel.
- **Test Foundation (Phase 2)**: Depends on Setup and blocks story work so the shared unit and authenticated browser test entry points are understood before failing story tests are written.
- **User Story 1 (Phase 3)**: Depends on the Test Foundation and establishes the event contracts, fixture map, presentational card, and selected-thread integration.
- **User Story 2 (Phase 4)**: Depends on User Story 1's event items, then adds an independently testable source-recognition layer.
- **User Story 3 (Phase 5)**: Depends on User Story 1's card and workspace integration; it can run in parallel with User Story 2 after User Story 1 completes.
- **Polish (Phase 6)**: Depends on all stories selected for delivery; full quality gates require all three stories.

### User Story Dependency Graph

```text
Setup -> Test Foundation -> US1 (MVP) -> US2
                              \-> US3
US2 + US3 -> Polish
```

### Within Each User Story

- Write unit and Playwright tests from the story contract before production changes.
- Run the new tests and observe the expected failing state.
- Implement fixture/model behavior before selected-thread composition where applicable.
- Implement core UI behavior before responsive integration where applicable.
- Re-run focused tests and preserve all earlier-story coverage before reaching the checkpoint.

### Parallel Opportunities

- T001 and T002 can run in parallel during Setup.
- T004 and T005 can run in parallel; after T006, T007, T008, and T009 proceed in dependency order.
- T011 and T012 can run in parallel.
- T016 and T017 can run in parallel; after T018, T019 and T020 can run in parallel.
- User Stories 2 and 3 can be assigned in parallel after User Story 1 is complete, with coordination because their final production edits touch different concerns in `components/run-asca/event-view.tsx`.
- T022 and T023 can run in parallel before the sequential quality-gate tasks.

---

## Parallel Example: User Story 1

```text
Task T004: Add failing Event View unit coverage in tests/unit/run-asca-chat.test.tsx
Task T005: Add failing default and thread-switch Playwright coverage in tests/e2e/run-asca.spec.ts

After T006 confirms failure:
Task T007: Create typed contracts and local fixtures in components/run-asca/types.ts and components/run-asca/event-fixtures.ts
Task T008: Create the presentational card in components/run-asca/event-view.tsx
```

## Parallel Example: User Story 2

```text
Task T011: Add exhaustive accessible source-name unit coverage in tests/unit/run-asca-chat.test.tsx
Task T012: Add all-five-sources Playwright coverage in tests/e2e/run-asca.spec.ts
```

## Parallel Example: User Story 3

```text
Task T016: Add bounded-layout unit assertions in tests/unit/run-asca-chat.test.tsx
Task T017: Add responsive and independent-scroll Playwright coverage in tests/e2e/run-asca.spec.ts

After T018 confirms failure:
Task T019: Implement EventView overflow containment in components/run-asca/event-view.tsx
Task T020: Implement workspace responsive composition in app/run/run-asca-chat.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and the Test Foundation.
2. Write and observe failing User Story 1 tests.
3. Implement local fixtures, the core Events card, and selected-thread integration.
4. Stop at T010 and validate User Story 1 independently.
5. Demonstrate the default 20-event view and three-event thread switching with no backend event request.

### Incremental Delivery

1. Deliver User Story 1 as the content-complete MVP.
2. Add User Story 2 and validate all five source mappings without changing the data boundary.
3. Add User Story 3 and validate responsive placement plus independent scrolling.
4. Complete fixture integrity, coverage, all repository quality gates, the production build, and manual quickstart validation.

### Parallel Team Strategy

1. Complete Setup, the Test Foundation, and User Story 1 in dependency order.
2. After User Story 1, implement User Story 2 source mapping and User Story 3 responsive scrolling in parallel, coordinating edits to `components/run-asca/event-view.tsx`.
3. Merge both story increments before running the cross-cutting quality gates.

---

## Notes

- `[P]` means separate-file or separate-concern work that has no dependency on another incomplete task in the same parallel batch.
- No task adds event fetching, persistence, loading, error, empty, pagination, filtering, navigation, or item activation behavior.
- Existing `/api/asca/chat`, authentication, thread selection, metadata, conversation, and prompt-submission behavior remain regression boundaries.
- Preserve Red-Green-Refactor: do not combine a failing-test task with its production implementation task.
