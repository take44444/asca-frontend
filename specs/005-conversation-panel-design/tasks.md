# Tasks: Conversation Panel Design

**Input**: Design documents from `/specs/005-conversation-panel-design/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: Test tasks are mandatory for this feature. Write each story's tests before implementation, observe the failing state, then implement the story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm version-specific guidance and existing Run A.S.C.A. boundaries before changing code.

- [x] T001 Review installed Next.js 16 App Router, accessibility, and supported browser guidance in node_modules/next/dist/docs/01-app/index.md, node_modules/next/dist/docs/03-architecture/accessibility.md, and node_modules/next/dist/docs/03-architecture/supported-browsers.md
- [x] T002 [P] Audit existing chat ownership, route transport, and selected thread rendering in app/run/run-asca-chat.tsx
- [x] T003 [P] Audit existing conversation semantics, scroll viewport, prompt input, and status/error controls in components/run-asca/conversation-panel.tsx
- [x] T004 [P] Audit existing Run A.S.C.A. unit and Playwright regression coverage in tests/unit/run-asca-chat.test.tsx and tests/e2e/run-asca.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared typed metadata contracts and static data required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Add exported docstringed types for ThreadMetadataSummary, TaskSummary, ArtifactSummary, KnowledgeSummary, TokenUsageSummary, and TokenUsagePoint in components/run-asca/types.ts
- [x] T006 Create static typed thread metadata fixture with non-negative counts, seven chronological token points, and derived token totals in components/run-asca/thread-metadata-fixtures.ts
- [x] T007 [P] Add reusable Run A.S.C.A. test setup helpers for rendering with custom messages and querying conversation landmarks in tests/unit/run-asca-test-helpers.ts

**Checkpoint**: Shared metadata model and fixtures are ready for all stories.

---

## Phase 3: User Story 1 - Use a Clear Conversation Panel (Priority: P1) MVP

**Goal**: Present the active thread in a visually bounded panel with a clear header, exact message count, independently scrollable messages, and anchored prompt entry while preserving existing chat behavior.

**Independent Test**: Open `/run`, verify the Conversation region shows `Demonstration Thread`, the current message count, message history, and prompt entry in one bounded panel, then submit a prompt and confirm existing streaming behavior still works.

### Tests for User Story 1 (MANDATORY - write before implementation)

- [x] T008 [P] [US1] Add unit tests for conversation panel header, exact message count, bounded panel classes, empty state, anchored prompt, and `data-testid="message-viewport"` in tests/unit/run-asca-chat.test.tsx
- [x] T009 [P] [US1] Add Playwright coverage for the bounded conversation panel, independently scrollable message viewport, anchored prompt, and preserved prompt submit flow in tests/e2e/run-asca.spec.ts

### Implementation for User Story 1

- [x] T010 [US1] Refactor ConversationPanel into a bounded header/content/prompt shell while preserving aria-labels, status/error text, copy controls, scroll button, and prompt behavior in components/run-asca/conversation-panel.tsx
- [x] T011 [US1] Adjust Run A.S.C.A. workspace sizing so the conversation panel fills the authenticated page without body scrolling in app/run/run-asca-chat.tsx
- [x] T012 [US1] Verify long-message seeding still scrolls only inside `data-testid="message-viewport"` and update any affected development-only control positioning in app/run/run-asca-chat.tsx

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Scan Thread Metadata (Priority: P2)

**Goal**: Show compact static summaries above the conversation for tasks, artifacts, knowledge, and total tokens with distinct symbols, category labels, primary counts, and supporting details.

**Independent Test**: Open `/run` and verify the metadata area contains exactly four summaries for tasks, artifacts, knowledge, and total tokens using static data without any live metadata request.

### Tests for User Story 2 (MANDATORY - write before implementation)

- [x] T013 [P] [US2] Add unit tests for rendering exactly four metadata summaries, task completed/pending counts, artifact research/document/image counts, knowledge item count, and no metadata fetch calls in tests/unit/run-asca-chat.test.tsx
- [x] T014 [P] [US2] Add Playwright coverage for visible metadata summaries and desktop one-row presentation at 1280px width in tests/e2e/run-asca.spec.ts

### Implementation for User Story 2

- [x] T015 [P] [US2] Create ThreadMetadataSummaryCard component with icon, label, primary value, supporting details, and tone styles in components/run-asca/thread-metadata-summary-card.tsx
- [x] T016 [US2] Render the four static metadata summaries above ConversationPanel using the typed fixture in app/run/run-asca-chat.tsx
- [x] T017 [US2] Add responsive metadata grid spacing and cohesive category color treatment without nested cards in app/run/run-asca-chat.tsx and components/run-asca/thread-metadata-summary-card.tsx

**Checkpoint**: User Stories 1 and 2 work independently with static metadata visible.

---

## Phase 5: User Story 3 - Inspect Token Usage Trend (Priority: P3)

**Goal**: Display the last seven days of input and output token usage as distinguishable trends with exact values available through hover or keyboard focus.

**Independent Test**: View the total tokens summary, distinguish input from output usage, and reveal exact input/output values for any of the seven days with hover or focus.

### Tests for User Story 3 (MANDATORY - write before implementation)

- [x] T018 [P] [US3] Add unit tests for seven chronological token points, distinguishable input/output labels, zero-value rendering, and derived total consistency in tests/unit/run-asca-chat.test.tsx
- [x] T019 [P] [US3] Add Playwright coverage for token chart hover or keyboard focus revealing exact input and output counts in tests/e2e/run-asca.spec.ts

### Implementation for User Story 3

- [x] T020 [P] [US3] Create TokenUsageTrend component using components/ui/chart.tsx and Recharts line chart primitives in components/run-asca/token-usage-trend.tsx
- [x] T021 [US3] Integrate TokenUsageTrend into the total tokens summary while preserving compact summary text in components/run-asca/thread-metadata-summary-card.tsx
- [x] T022 [US3] Add accessible labels, tooltip content, focusable token points, and distinct input/output color variables in components/run-asca/token-usage-trend.tsx

**Checkpoint**: User Story 3 is independently functional and the token interaction contract is satisfied.

---

## Phase 6: User Story 4 - Use the Layout Across Screen Sizes (Priority: P4)

**Goal**: Ensure the conversation panel and metadata summaries adapt across supported screen sizes without overlapping text, controls, messages, or prompt entry.

**Independent Test**: Resize the `/run` page across narrow and desktop widths and verify metadata summaries, the conversation panel, the message viewport, and the prompt remain visible, readable, and non-overlapping.

### Tests for User Story 4 (MANDATORY - write before implementation)

- [x] T023 [P] [US4] Add unit tests that render the compact metadata presentation and assert each summary keeps its accessible category label, symbol text alternative, and primary count visible in tests/unit/run-asca-chat.test.tsx
- [x] T024 [P] [US4] Add Playwright responsive checks at 390x844 and 1280x800 for no overlapping metadata, conversation panel, message viewport, and prompt entry in tests/e2e/run-asca.spec.ts

### Implementation for User Story 4

- [x] T025 [US4] Tune responsive grid tracks, fixed-format panel dimensions, and mobile spacing for the workspace and metadata area in app/run/run-asca-chat.tsx
- [x] T026 [US4] Tune compact summary typography, icon sizing, and supporting detail visibility so long labels do not overflow in components/run-asca/thread-metadata-summary-card.tsx
- [x] T027 [US4] Tune conversation panel minimum heights and prompt/message spacing to avoid overlap during viewport changes in components/run-asca/conversation-panel.tsx

**Checkpoint**: All user stories are independently functional across supported viewport sizes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate regression coverage, quality gates, and manual quickstart scenarios.

- [x] T028 [P] Run formatting, lint, and type checking with `npm run format`, `npm run lint`, and `npm run typecheck` for app/run/run-asca-chat.tsx, components/run-asca/conversation-panel.tsx, components/run-asca/thread-metadata-summary-card.tsx, components/run-asca/token-usage-trend.tsx, and components/run-asca/types.ts
- [x] T029 [P] Run unit tests and coverage with `npm run test` and `npm run test:coverage` for tests/unit/run-asca-chat.test.tsx
- [x] T030 [P] Run Playwright tests with `npm run test:e2e` for tests/e2e/run-asca.spec.ts
- [x] T031 Run production build with `npm run build` for the Next.js App Router application
- [x] T032 Execute manual validation scenarios from specs/005-conversation-panel-design/quickstart.md and record any unresolved deviations in specs/005-conversation-panel-design/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; may integrate after US1 shell is available.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and the US2 metadata summary location.
- **User Story 4 (Phase 6)**: Depends on the target UI from US1, US2, and US3.
- **Polish (Phase 7)**: Depends on the implemented stories selected for delivery.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2; no dependency on other stories.
- **US2 (P2)**: Can start after Phase 2; uses the page location around the US1 conversation panel but remains independently testable.
- **US3 (P3)**: Can start after Phase 2; integrates into the token metadata summary from US2.
- **US4 (P4)**: Should run after US1 through US3 to validate final responsive composition.

### Within Each User Story

- Write tests first and observe failures before implementation.
- Implement typed models and fixtures before components that consume them.
- Implement reusable components before page integration.
- Validate the story independently at its checkpoint before moving to the next priority.

### Parallel Opportunities

- Setup audits T002, T003, and T004 can run in parallel.
- Foundational test helper work T007 can run in parallel with metadata fixture work T006 after T005 type names are agreed.
- Each story's unit and Playwright tests can be written in parallel because they touch different test files.
- Component creation tasks T015 and T020 can run in parallel with page integration tasks only after the component prop contracts are stable.
- Polish quality gate commands T028, T029, and T030 can run in parallel after implementation is complete.

---

## Parallel Example: User Story 1

```bash
Task: "T008 [P] [US1] Add unit tests for conversation panel header, exact message count, bounded panel classes, empty state, anchored prompt, and data-testid=\"message-viewport\" in tests/unit/run-asca-chat.test.tsx"
Task: "T009 [P] [US1] Add Playwright coverage for the bounded conversation panel, independently scrollable message viewport, anchored prompt, and preserved prompt submit flow in tests/e2e/run-asca.spec.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T013 [P] [US2] Add unit tests for rendering exactly four metadata summaries, task completed/pending counts, artifact research/document/image counts, knowledge item count, and no metadata fetch calls in tests/unit/run-asca-chat.test.tsx"
Task: "T014 [P] [US2] Add Playwright coverage for visible metadata summaries and desktop one-row presentation at 1280px width in tests/e2e/run-asca.spec.ts"
Task: "T015 [P] [US2] Create ThreadMetadataSummaryCard component with icon, label, primary value, supporting details, and tone styles in components/run-asca/thread-metadata-summary-card.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T018 [P] [US3] Add unit tests for seven chronological token points, distinguishable input/output labels, zero-value rendering, and derived total consistency in tests/unit/run-asca-chat.test.tsx"
Task: "T019 [P] [US3] Add Playwright coverage for token chart hover or keyboard focus revealing exact input and output counts in tests/e2e/run-asca.spec.ts"
Task: "T020 [P] [US3] Create TokenUsageTrend component using components/ui/chart.tsx and Recharts line chart primitives in components/run-asca/token-usage-trend.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "T023 [P] [US4] Add unit tests or class assertions for compact metadata presentation preserving symbols and primary counts in tests/unit/run-asca-chat.test.tsx"
Task: "T024 [P] [US4] Add Playwright responsive checks at 390x844 and 1280x800 for no overlapping metadata, conversation panel, message viewport, and prompt entry in tests/e2e/run-asca.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup audits.
2. Complete Phase 2 shared types, static fixture, and test helper preparation.
3. Complete Phase 3 tests and implementation for the bounded conversation panel.
4. Stop and validate US1 independently with unit, Playwright, and manual `/run` checks.

### Incremental Delivery

1. Add US1 to deliver the redesigned conversation panel without metadata.
2. Add US2 to deliver static metadata summaries above the panel.
3. Add US3 to replace the token summary detail with an interactive seven-day trend.
4. Add US4 to harden responsive layout and no-overlap behavior.
5. Run Phase 7 quality gates and quickstart validation before considering the feature complete.

### Parallel Team Strategy

1. One developer completes Phase 1 and T005 type contracts.
2. Developers split fixture/test helper work from T006 and T007.
3. After Phase 2, developers can write test files in parallel while a component owner implements the matching story components.
4. Integrate in priority order: US1, then US2, then US3, then US4.

---

## Notes

- [P] tasks use different files or can proceed without depending on an incomplete task in the same file.
- [US1], [US2], [US3], and [US4] labels map directly to the prioritized user stories in spec.md.
- No task introduces live task, artifact, knowledge, or token fetching.
- Existing `/api/asca/chat` request and streaming response behavior must remain unchanged.
- Commit after each task or logical group, and run the relevant story tests before moving to the next checkpoint.
