# Tasks: Agent Metadata Summary Content

**Input**: Design documents from `/specs/009-agent-metadata-mock-data/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-contract.md`, `quickstart.md`

**Tests**: Tests are mandatory and precede production changes for every user story. Observe the failing state before implementing each story, then retain the tests as regression coverage and maintain at least 80% coverage for changed behavior.

**Organization**: Tasks are grouped by user story so knowledge records, social players, and artifacts can each be implemented and validated as independently demonstrable increments.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks marked `[P]` in the same phase because it changes a different file and does not depend on an incomplete task
- **[Story]**: Maps a task to User Story 1, 2, or 3
- Every task names the exact file or files it reads or changes

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the installed framework guidance and reusable local UI contracts before changing production code.

- [X] T001 Review the installed client composition, CSS, Jest, Playwright, and accessibility guidance in `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`, `node_modules/next/dist/docs/01-app/02-guides/testing/jest.md`, `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`, and `node_modules/next/dist/docs/03-architecture/accessibility.md`
- [X] T002 [P] Review the reusable composition, responsive-content, list, avatar, and file-icon APIs in `components/run-asca/agent-metadata-summary-card.tsx`, `components/ui/item.tsx`, `components/ui/avatar.tsx`, `components/icons/lucide-file-text.tsx`, and `components/icons/lucide-file-image.tsx`

---

## Phase 2: Test Foundation (Blocking Prerequisites)

**Purpose**: Confirm the shared render helpers, authenticated browser setup, and current metadata/token regression boundary used by every story.

**⚠️ CRITICAL**: Complete this phase before story-specific tests so each failing state is attributable to missing detailed metadata behavior rather than test-harness setup.

- [X] T003 Review the existing render helpers, `matchMedia` behavior, authenticated browser setup, metadata assertions, non-overlap helper, and token-trend coverage in `tests/unit/run-asca-test-helpers.ts`, `tests/unit/run-asca-chat.test.tsx`, `tests/e2e/auth-test-helpers.ts`, and `tests/e2e/run-asca.spec.ts`

**Checkpoint**: Unit and browser entry points are understood; no production code has changed before the first failing story tests.

---

## Phase 3: User Story 1 - Review Agent Knowledge (Priority: P1) 🎯 MVP

**Goal**: Replace the knowledge count-only fixture with 14 typed records and show every title and description in a bounded, read-only, independently scrollable grouped list.

**Independent Test**: Open the Knowledge summary at a viewport where metadata content is available, confirm exactly 14 distinct title/description items and a derived total of 14, verify long or unbroken text truncates within the card, and reach the final item by scrolling only the knowledge viewport; rendering an empty collection produces an empty group and zero total.

### Tests for User Story 1 (write first and observe failure) ⚠️

- [X] T004 [P] [US1] Add failing unit coverage for 14 deterministic knowledge records, unique IDs, derived totals, semantic grouped-list structure, title and description content, blank rendering for empty title and description values, single-line truncation classes, empty records, read-only rows, and no metadata fetch in `tests/unit/run-asca-chat.test.tsx`
- [X] T005 [P] [US1] Add failing authenticated Playwright coverage for all 14 reachable knowledge items, long-title and long-description truncation geometry, knowledge-only scrolling to the final record, stationary surrounding workspace content, and below-breakpoint content availability in `tests/e2e/run-asca.spec.ts`
- [X] T006 [US1] Run the new User Story 1 cases from `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts`, record that they fail for missing knowledge records and list content, and make no production change in this task

### Implementation for User Story 1

- [X] T007 [US1] Add documented `KnowledgeItem` and knowledge-collection contracts without `any`, create exactly 14 deterministic knowledge fixtures with unique IDs, and derive the knowledge total from the collection in `components/run-asca/types.ts` and `components/run-asca/agent-metadata-fixtures.ts`
- [X] T008 [US1] Implement a typed Knowledge content renderer using `ItemGroup`, compact non-interactive `Item` rows, `ItemTitle`, `ItemDescription`, `min-w-0`, single-line truncation, and a bounded `min-h-0 overflow-y-auto` viewport in `components/run-asca/agent-metadata-summary-card.tsx`
- [X] T009 [US1] Pass the knowledge fixture collection into the Knowledge summary while leaving Social, Artifacts, Tokens, `/api/asca/chat`, and authentication behavior unchanged in `app/run/run-asca-chat.tsx`
- [X] T010 [US1] Run the focused User Story 1 cases in `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts` until fixture integrity, empty rendering, truncation, read-only semantics, responsive availability, and independent scrolling pass

**Checkpoint**: User Story 1 is independently functional and demonstrable as the MVP.

---

## Phase 4: User Story 2 - Identify Social Players (Priority: P2)

**Goal**: Replace the social count-only fixture with eight typed player records and show every name with deterministic initials-only local avatar fallback in a bounded, read-only list.

**Independent Test**: Open the Social summary, confirm exactly eight named players and a derived total of eight, verify one-word, multi-word, punctuation-only, and non-Latin names produce deterministic fallback content with no avatar image or remote request, confirm long names truncate, and reach the final player by scrolling only the social viewport.

### Tests for User Story 2 (write first and observe failure) ⚠️

- [X] T011 [P] [US2] Add failing unit coverage for eight deterministic players, unique IDs, derived totals, empty records, semantic grouped-list rows, initials for empty, one-word, multi-word, punctuation-only, and non-Latin names, blank display text plus the generic avatar fallback for an empty name, at-most-two-uppercase-character output, initials-only avatars, truncation classes, read-only rows, and zero remote avatar requests in `tests/unit/run-asca-chat.test.tsx`
- [X] T012 [P] [US2] Add failing authenticated Playwright coverage for all eight reachable player names and local avatar fallbacks, long-name truncation geometry, social-only scrolling to the final player, no avatar network request, and no effect from pointer or keyboard activation attempts in `tests/e2e/run-asca.spec.ts`
- [X] T013 [US2] Run the new User Story 2 cases from `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts`, record that they fail for missing player records, initials, and list content, and make no production change in this task

### Implementation for User Story 2

- [X] T014 [US2] Add documented `SocialPlayer` and social-collection contracts without image or backend identifiers, create exactly eight deterministic player fixtures with unique IDs and required name edge cases, and derive the social total from the collection in `components/run-asca/types.ts` and `components/run-asca/agent-metadata-fixtures.ts`
- [X] T015 [US2] Implement and document the Unicode-aware deterministic initials helper plus a typed Social content renderer using `ItemGroup`, compact non-interactive `Item` rows, `ItemMedia`, `Avatar`, `AvatarFallback` without `AvatarImage`, truncated `ItemTitle`, and a bounded independent viewport in `components/run-asca/agent-metadata-summary-card.tsx`
- [X] T016 [US2] Pass the player fixture collection into the Social summary while leaving Knowledge, Artifacts, Tokens, `/api/asca/chat`, and authentication behavior unchanged in `app/run/run-asca-chat.tsx`
- [X] T017 [US2] Run the focused User Story 2 cases in `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts` until fixture integrity, initials edge cases, empty rendering, no-network behavior, truncation, read-only semantics, and independent scrolling pass without weakening User Story 1

**Checkpoint**: User Story 2 is independently functional and demonstrable with no remote avatar dependency.

---

## Phase 5: User Story 3 - Inspect Agent Artifacts (Priority: P3)

**Goal**: Replace artifact count-only fixtures with two typed document records and one typed image record, showing each name, data size, and exhaustive accessible type icon in a bounded, read-only list while preserving token behavior.

**Independent Test**: Open the Artifacts summary, confirm two documents and one image produce a derived total of three, verify every record exposes its name, data size, and correct accessible icon, confirm long names truncate and the final record is reachable through artifact-only scrolling, and verify activation changes neither navigation nor token usage.

### Tests for User Story 3 (write first and observe failure) ⚠️

- [X] T018 [P] [US3] Add failing unit coverage for exactly three unique artifacts, the two-document/one-image breakdown, derived totals, supported empty collections, blank rendering for an empty artifact name, display-only zero and unusually large data sizes, exhaustive icon mapping and accessible type names, name truncation classes, read-only rows, no fetch, and unchanged seven-point token data in `tests/unit/run-asca-chat.test.tsx`
- [X] T019 [P] [US3] Add failing authenticated Playwright coverage for all three artifact names and data sizes, two text-document symbols and one image-file symbol, long-name truncation geometry, artifact-only scrolling when overflow is forced, pointer and keyboard non-interaction, unchanged token totals, and metadata-card non-overlap in `tests/e2e/run-asca.spec.ts`
- [X] T020 [US3] Run the new User Story 3 cases from `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts`, record that they fail for missing artifact records, type symbols, and list content, and make no production change in this task

### Implementation for User Story 3

- [X] T021 [US3] Add documented closed `ArtifactType`, `Artifact`, and artifact-collection contracts, create exactly two document and one image fixtures with unique IDs and human-readable data sizes, and derive the artifact totals and type breakdown from the collection in `components/run-asca/types.ts` and `components/run-asca/agent-metadata-fixtures.ts`
- [X] T022 [US3] Implement an exhaustive typed `ArtifactType` mapping to `FileTextIcon` and `FileImageIcon` plus a typed Artifact content renderer using accessible type names, compact non-interactive grouped rows, truncated names, data-size descriptions, and a bounded independent viewport in `components/run-asca/agent-metadata-summary-card.tsx`
- [X] T023 [US3] Pass the artifact fixture collection into the Artifacts summary while leaving Knowledge, Social, Tokens, `/api/asca/chat`, and authentication behavior unchanged in `app/run/run-asca-chat.tsx`
- [X] T024 [US3] Run the focused User Story 3 cases in `tests/unit/run-asca-chat.test.tsx` and `tests/e2e/run-asca.spec.ts` until fixture integrity, empty rendering, exhaustive icons, truncation, read-only behavior, token regression coverage, scrolling, and non-overlap pass without weakening User Stories 1 or 2

**Checkpoint**: All three user stories are independently functional and the existing token summary remains unchanged.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate accessibility, type safety, responsive containment, coverage, and every repository quality gate across the completed feature.

- [X] T025 [P] Audit grouped-list semantics, icon and avatar accessible names, keyboard non-interaction, empty collections, blank field rendering and generic empty-name avatar fallback, long unbroken text, bounded scrolling, responsive content availability, and backend boundaries against `specs/009-agent-metadata-mock-data/contracts/ui-contract.md` in `components/run-asca/agent-metadata-summary-card.tsx` and `app/run/run-asca-chat.tsx`
- [X] T026 [P] Review exported metadata types, fixtures, helpers, and component props for docstrings, explicit stable types, closed artifact mapping, unique fixture IDs, derived aggregates, and absence of `any` in `components/run-asca/types.ts`, `components/run-asca/agent-metadata-fixtures.ts`, and `components/run-asca/agent-metadata-summary-card.tsx`
- [X] T027 Run the `npm run format`, `npm run lint`, and `npm run typecheck` gates defined in `package.json`, resolving failures only in `app/run/run-asca-chat.tsx`, `components/run-asca/agent-metadata-fixtures.ts`, `components/run-asca/agent-metadata-summary-card.tsx`, `components/run-asca/types.ts`, `tests/unit/run-asca-chat.test.tsx`, and `tests/e2e/run-asca.spec.ts`
- [X] T028 Run `npm run test` and `npm run test:coverage` using `package.json` and `jest.config.ts`, and verify new or changed metadata behavior in `tests/unit/run-asca-chat.test.tsx` remains at or above 80% coverage
- [X] T029 Run `npm run test:e2e` from `package.json` and resolve metadata-summary regressions in `tests/e2e/run-asca.spec.ts` without changing authentication, chat transport, agent selection, event data, conversation state, or token behavior
- [X] T030 Run `npm run build` from `package.json` and manually execute every validation scenario documented in `specs/009-agent-metadata-mock-data/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001 and T002 can run in parallel.
- **Test Foundation (Phase 2)**: Depends on Setup and blocks story-specific test work.
- **User Story 1 (Phase 3)**: Depends only on the Test Foundation and delivers the suggested MVP.
- **User Story 2 (Phase 4)**: Depends only on the Test Foundation for behavior, but sequential priority order avoids concurrent edits to shared metadata files.
- **User Story 3 (Phase 5)**: Depends only on the Test Foundation for behavior, but sequential priority order avoids concurrent edits to shared metadata files.
- **Polish (Phase 6)**: Depends on all stories selected for delivery; full quality gates require all three stories.

### User Story Dependency Graph

```text
Setup -> Test Foundation -> US1 (P1, MVP) --\
                         -> US2 (P2) -------+-> Polish
                         -> US3 (P3) -------/
```

Each story has no behavioral dependency on another story and can be tested in isolation. In a single worktree, implement them in priority order because all three extend `components/run-asca/types.ts`, `components/run-asca/agent-metadata-fixtures.ts`, `components/run-asca/agent-metadata-summary-card.tsx`, `app/run/run-asca-chat.tsx`, and the same two test suites.

### Within Each User Story

- Write unit and Playwright tests from the story contract before production changes.
- Run the new tests and observe the expected failing state.
- Add typed record contracts and deterministic fixtures before rendering or integration.
- Implement the focused content renderer before composing it into `RunAscaChat`.
- Re-run focused tests and preserve all earlier regression coverage before reaching the checkpoint.

### Parallel Opportunities

- T001 and T002 can run in parallel during Setup.
- T004 and T005 can run in parallel for User Story 1.
- T011 and T012 can run in parallel for User Story 2.
- T018 and T019 can run in parallel for User Story 3.
- T025 and T026 can run in parallel before the sequential quality-gate tasks.
- The three stories can be assigned to separate worktrees after T003, but their shared production and test files require deliberate merge coordination.

---

## Parallel Example: User Story 1

```text
Task T004: Add failing knowledge fixture and rendering coverage in tests/unit/run-asca-chat.test.tsx
Task T005: Add failing knowledge reachability and geometry coverage in tests/e2e/run-asca.spec.ts
```

## Parallel Example: User Story 2

```text
Task T011: Add failing player, initials, and no-network coverage in tests/unit/run-asca-chat.test.tsx
Task T012: Add failing social reachability and interaction coverage in tests/e2e/run-asca.spec.ts
```

## Parallel Example: User Story 3

```text
Task T018: Add failing artifact fixture, icon, and token-regression coverage in tests/unit/run-asca-chat.test.tsx
Task T019: Add failing artifact geometry, interaction, and non-overlap coverage in tests/e2e/run-asca.spec.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and the Test Foundation.
2. Write and observe failing User Story 1 tests.
3. Implement typed knowledge records, derived totals, the bounded list, and workspace integration.
4. Stop at T010 and validate User Story 1 independently.
5. Demonstrate all 14 reachable records, truncation, empty rendering, and knowledge-only scrolling with no backend request.

### Incremental Delivery

1. Deliver User Story 1 as the knowledge-content MVP.
2. Add User Story 2 and validate deterministic local initials plus zero remote avatar requests.
3. Add User Story 3 and validate exhaustive icons, artifact details, read-only behavior, and unchanged tokens.
4. Complete accessibility and type audits, coverage, all repository quality gates, the production build, and manual quickstart validation.

### Parallel Team Strategy

1. Complete Setup and the Test Foundation together.
2. Assign User Stories 1, 2, and 3 to separate worktrees if parallel delivery is required.
3. Merge in priority order and resolve shared-file edits without weakening each story's independently failing-then-passing tests.
4. Run Polish only after all selected story branches are integrated.

---

## Notes

- `[P]` means separate-file work with no dependency on another incomplete task in the same parallel batch.
- No task adds backend interaction, remote avatar retrieval, persistence, loading/error states, item detail, editing, selection, navigation, or token-summary changes.
- Existing `/api/asca/chat`, authentication, agent selection, conversation state, event data, and the seven-point token trend are regression boundaries.
- Preserve Red-Green-Refactor: do not combine a failing-test task with its production implementation task.
