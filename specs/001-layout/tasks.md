# Tasks: Layout

**Input**: Design documents from `/specs/001-layout/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Test tasks are mandatory for this feature. Write tests before implementation, verify they fail first, and verify at least 80% coverage for changed behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks.
- **[Story]**: Maps task to a user story, for example `[US1]`, `[US2]`, `[US3]`.
- Every task includes an exact file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add required test tooling and shared project structure before feature work begins.

- [ ] T001 Add Jest, Testing Library, jsdom, Playwright, and coverage script dependencies/scripts in package.json and package-lock.json
- [ ] T002 [P] Create Jest configuration for TypeScript React tests in jest.config.ts
- [ ] T003 [P] Create Jest setup file for DOM matchers in jest.setup.ts
- [ ] T004 [P] Create Playwright configuration for Next.js e2e tests in playwright.config.ts
- [ ] T005 [P] Create test directory placeholders in tests/unit/app-header.test.tsx and tests/e2e/layout.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared routes, types, and header shell that all user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T006 Create typed route/navigation constants for About, Run, and GitHub targets in lib/layout-navigation.ts
- [ ] T007 Create typed header component prop contracts and theme labels in components/layout/app-header.tsx
- [ ] T008 Create client navigation shell with placeholder exports for active-route, menu, and theme behavior in components/layout/header-nav.tsx
- [ ] T009 Integrate the AppHeader shell and fixed-header main-content spacing into app/layout.tsx
- [ ] T010 Add shared layout styling tokens and scroll offset support in app/globals.css

**Checkpoint**: Foundation ready; user story implementation can now begin.

---

## Phase 3: User Story 1 - Consistent Global Layout (Priority: P1) MVP

**Goal**: Every page shares a fixed top header, A.S.C.A. logo, and readable main content area.

**Independent Test**: Visit available pages and confirm the fixed header spans the viewport, remains visible while scrolling, shows the A.S.C.A. logo on the left, and does not hide main content.

### Tests for User Story 1 (MANDATORY - write before implementation)

- [ ] T011 [P] [US1] Add failing unit tests for AppHeader logo, fixed header semantics, and main spacing contract in tests/unit/app-header.test.tsx
- [ ] T012 [P] [US1] Add failing Playwright tests for fixed header visibility and non-overlapping main content on `/` in tests/e2e/layout.spec.ts

### Implementation for User Story 1

- [ ] T013 [US1] Implement A.S.C.A. logo, fixed full-width header structure, and header landmark behavior in components/layout/app-header.tsx
- [ ] T014 [US1] Implement responsive main content wrapper below the fixed header in app/layout.tsx
- [ ] T015 [US1] Replace default starter page content with layout-safe placeholder content in app/page.tsx
- [ ] T016 [US1] Run User Story 1 unit and e2e tests and document passing results in specs/001-layout/quickstart.md

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Navigate Between Core Pages (Priority: P2)

**Goal**: Users can navigate between "About A.S.C.A." and "Run A.S.C.A." from the header, with active-state feedback on desktop and small screens.

**Independent Test**: Select each navigation destination from the header and confirm the target page opens and the correct navigation item is highlighted; repeat with the collapsed small-screen menu.

### Tests for User Story 2 (MANDATORY - write before implementation)

- [ ] T017 [P] [US2] Add failing unit tests for active navigation and collapsed menu behavior in tests/unit/app-header.test.tsx
- [ ] T018 [P] [US2] Add failing Playwright tests for `/about`, `/run`, active nav highlighting, and mobile menu navigation in tests/e2e/layout.spec.ts

### Implementation for User Story 2

- [ ] T019 [P] [US2] Create the About placeholder page with a unique heading in app/about/page.tsx
- [ ] T020 [P] [US2] Create the Run placeholder page with a unique heading in app/run/page.tsx
- [ ] T021 [US2] Implement desktop navigation links, active-route state, and current-page styling in components/layout/header-nav.tsx
- [ ] T022 [US2] Implement small-screen menu control and collapsed navigation links in components/layout/header-nav.tsx
- [ ] T023 [US2] Wire navigation data from lib/layout-navigation.ts into components/layout/app-header.tsx
- [ ] T024 [US2] Run User Story 2 unit and e2e tests and document passing results in specs/001-layout/quickstart.md

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Access Header Actions (Priority: P3)

**Goal**: Users can access GitHub, switch themes, and see a placeholder Login button from the right side of the header on all supported screen sizes.

**Independent Test**: Use the GitHub action, switch themes, and confirm the Login button remains visible and does not start authentication on desktop and mobile viewports.

### Tests for User Story 3 (MANDATORY - write before implementation)

- [ ] T025 [P] [US3] Add failing unit tests for GitHub action attributes, theme toggle tooltip labels, and placeholder Login behavior in tests/unit/app-header.test.tsx
- [ ] T026 [P] [US3] Add failing Playwright tests for GitHub new-tab behavior, theme switching, and right-side action visibility in tests/e2e/layout.spec.ts

### Implementation for User Story 3

- [ ] T027 [US3] Implement GitHub repository link with accessible label, tooltip text, and new-tab attributes in components/layout/app-header.tsx
- [ ] T028 [US3] Implement light/dark theme toggle labels and icon switching with next-themes in components/layout/header-nav.tsx
- [ ] T029 [US3] Implement visible non-authenticating Login placeholder button in components/layout/app-header.tsx
- [ ] T030 [US3] Verify header action ordering and responsive non-overlap styling in app/globals.css
- [ ] T031 [US3] Run User Story 3 unit and e2e tests and document passing results in specs/001-layout/quickstart.md

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full feature, coverage, documentation, and quality gates.

- [ ] T032 [P] Verify UI contract coverage against implemented behavior in specs/001-layout/contracts/ui-contract.md
- [ ] T033 [P] Update quickstart validation notes and any changed test commands in specs/001-layout/quickstart.md
- [ ] T034 Verify changed behavior maintains at least 80% test coverage using package.json coverage script
- [ ] T035 Run lint, format, typecheck, build, unit tests, and Playwright tests using package.json scripts
- [ ] T036 Review final layout on desktop and mobile viewports against specs/001-layout/spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; starts immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; this is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and can be implemented independently, but should be validated after US1 for global layout continuity.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and can be implemented independently, but shares header files with US1/US2.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 - Consistent Global Layout**: Can start after Phase 2; no dependency on US2 or US3.
- **US2 - Navigate Between Core Pages**: Can start after Phase 2; uses shared header shell and route constants.
- **US3 - Access Header Actions**: Can start after Phase 2; uses shared header shell and theme provider.

### Within Each User Story

- Tests must be written first and observed failing before implementation.
- Implement shared types/constants before components that consume them.
- Implement route pages before e2e assertions that require the routes to pass.
- Run each story's tests before moving to the next priority.

### Parallel Opportunities

- T002, T003, T004, and T005 can run in parallel after T001 is understood.
- T011 and T012 can run in parallel for US1.
- T017 and T018 can run in parallel for US2.
- T019 and T020 can run in parallel for US2 after tests are written.
- T025 and T026 can run in parallel for US3.
- T032 and T033 can run in parallel during polish.

---

## Parallel Example: User Story 1

```bash
Task: "T011 [P] [US1] Add failing unit tests for AppHeader logo, fixed header semantics, and main spacing contract in tests/unit/app-header.test.tsx"
Task: "T012 [P] [US1] Add failing Playwright tests for fixed header visibility and non-overlapping main content on `/` in tests/e2e/layout.spec.ts"
```

---

## Parallel Example: User Story 2

```bash
Task: "T019 [P] [US2] Create the About placeholder page with a unique heading in app/about/page.tsx"
Task: "T020 [P] [US2] Create the Run placeholder page with a unique heading in app/run/page.tsx"
```

---

## Parallel Example: User Story 3

```bash
Task: "T025 [P] [US3] Add failing unit tests for GitHub action attributes, theme toggle tooltip labels, and placeholder Login behavior in tests/unit/app-header.test.tsx"
Task: "T026 [P] [US3] Add failing Playwright tests for GitHub new-tab behavior, theme switching, and right-side action visibility in tests/e2e/layout.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup so TDD tooling exists.
2. Complete Phase 2 foundation so layout constants and shells exist.
3. Complete Phase 3 for global fixed header and main content.
4. Stop and validate User Story 1 independently with unit and e2e tests.

### Incremental Delivery

1. Deliver US1 as the MVP global layout.
2. Add US2 navigation and placeholder destination pages.
3. Add US3 supporting header actions.
4. Finish polish with coverage, quality gates, and quickstart validation.

### Parallel Team Strategy

After Phase 2, different developers can work from the same contracts:

- Developer A: US1 layout tests and fixed header integration.
- Developer B: US2 route pages and navigation behavior.
- Developer C: US3 header actions and theme behavior.

Coordinate edits to `components/layout/app-header.tsx` and `components/layout/header-nav.tsx` because multiple stories touch those files.

## Notes

- [P] tasks use different files or are safe to run independently.
- [US1], [US2], and [US3] labels map to the prioritized stories in [spec.md](./spec.md).
- Commit after each completed phase or coherent task group.
- Stop at any checkpoint to validate the story independently.
