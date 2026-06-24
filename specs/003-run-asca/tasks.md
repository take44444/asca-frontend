---
description: "Task list for Run A.S.C.A. implementation"
---

# Tasks: Run A.S.C.A.

**Input**: Design documents from `/specs/003-run-asca/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/api-contract.md](./contracts/api-contract.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Mandatory. Follow Red-Green-Refactor: write each test first, verify it fails, then implement the smallest production change.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks
- **[Story]**: User story label, used only in user story phases
- Every task includes explicit repository file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare dependencies, documentation context, and shared feature paths before test-first story work.

- [X] T001 Install the AI SDK core package and update `package.json` and `package-lock.json`
- [X] T002 [P] Add `OPENAI_API_KEY` and `ASCA_MODEL` documentation to `.env.example`
- [X] T003 [P] Review installed Next.js Route Handler, Server/Client Component, authentication, redirect, and Backend-for-Frontend docs listed in `specs/003-run-asca/plan.md`
- [X] T004 [P] Create feature source directories `components/run-asca/` and `app/api/asca/chat/`
- [X] T005 [P] Create placeholder test files `tests/unit/asca-chat-route.test.ts`, `tests/unit/run-asca-chat.test.tsx`, and `tests/e2e/run-asca.spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared contracts and deterministic test seams that all user stories depend on.

**Critical**: No user story implementation can begin until this phase is complete.

- [X] T006 Create shared chat domain types with docstrings for Thread, ChatMessage, PromptSubmission, AscaChatRequest, AscaChatResponse, and API error payloads in `components/run-asca/types.ts`
- [X] T007 Create request parsing, response builders, model configuration, and provider-facing message helpers with exported-function docstrings in `lib/asca-chat.ts`
- [X] T008 [P] Add reusable test helpers for mocked A.S.C.A. route responses and clipboard behavior in `tests/unit/run-asca-test-helpers.ts`
- [X] T009 [P] Add Playwright auth and route mocking helpers for Run A.S.C.A. scenarios in `tests/e2e/run-asca.spec.ts`
- [X] T010 Configure Jest mocks for `ai`, `@ai-sdk/openai`, `next/navigation`, and authenticated sessions in `tests/unit/asca-chat-route.test.ts`

**Checkpoint**: Foundation ready; user story implementation can now begin.

---

## Phase 3: User Story 1 - Chat in a Thread (Priority: P1) MVP

**Goal**: Authenticated users can open `/run`, submit a valid prompt in the demonstration thread, see their message immediately, see `A.S.C.A. is thinking...`, and receive the assistant response in the same thread.

**Independent Test**: Open `/run` as an authenticated user, submit a non-empty prompt, verify the user message appears, verify the thinking state appears, and verify the assistant response is appended as the latest message.

### Tests for User Story 1 (write first and verify failure)

- [X] T011 [P] [US1] Add route tests for signed-out `401`, invalid `400`, `ASCA_MODEL` usage, success payload mapping, and provider failure mapping in `tests/unit/asca-chat-route.test.ts`
- [X] T012 [P] [US1] Add component tests for whitespace rejection, valid prompt append, thinking state within 1 second, successful response append, duplicate-submit prevention, and route failure state in `tests/unit/run-asca-chat.test.tsx`
- [X] T013 [P] [US1] Add Playwright tests for signed-out `/run` redirect and signed-in prompt-to-response flow in `tests/e2e/run-asca.spec.ts`

### Implementation for User Story 1

- [X] T014 [US1] Implement authenticated `POST /api/asca/chat` Route Handler with docstrings for exported handlers using `getCurrentUserSession`, `generateText`, `openai`, and typed responses in `app/api/asca/chat/route.ts`
- [X] T015 [US1] Implement request validation, `ASCA_MODEL` lookup, text-only message normalization, sanitized error mapping, and exported-function docstrings in `lib/asca-chat.ts`
- [X] T016 [US1] Implement local demonstration thread state, prompt submission state, duplicate-submit prevention, route calls, assistant response append logic, and component prop docstrings in `app/run/run-asca-chat.tsx`
- [X] T017 [P] [US1] Implement markdown-capable message rendering, sender identity display, and component prop docstrings in `components/run-asca/chat-message.tsx`
- [X] T018 [US1] Update `/run` authenticated Server Component to render the interactive chat client in `app/run/page.tsx`
- [X] T019 [US1] Update protected-page expectations for the new chat workspace heading and authenticated render path in `tests/unit/run-page-auth.test.tsx`

**Checkpoint**: User Story 1 is functional and independently testable.

---

## Phase 4: User Story 2 - Navigate the Thread Layout (Priority: P2)

**Goal**: The page presents a stable two-area desktop workspace with a left thread list, a right conversation area, independently scrolling conversation messages, selected demonstration thread content, and unavailable Create New Thread action.

**Independent Test**: Open `/run` at supported desktop sizes and verify the page does not whole-page scroll, the thread list remains visible, the demonstration thread is selected, selection renders the conversation, and overflowing messages scroll inside the conversation area.

### Tests for User Story 2 (write first and verify failure)

- [X] T020 [P] [US2] Add component tests for selected demonstration thread rendering, unavailable Create New Thread action, and thread selection behavior in `tests/unit/run-asca-chat.test.tsx`
- [X] T021 [P] [US2] Add Playwright tests for no whole-page vertical scroll, left/right desktop layout, selected demonstration thread visibility, and conversation usability in `tests/e2e/run-asca.spec.ts`

### Implementation for User Story 2

- [X] T022 [P] [US2] Implement thread list UI with selected demonstration thread and disabled Create New Thread action in `components/run-asca/thread-list.tsx`
- [X] T023 [P] [US2] Implement conversation shell with title, message viewport, empty state, anchored prompt area, loading state, and error state in `components/run-asca/conversation-panel.tsx`
- [X] T024 [US2] Compose thread list and conversation panel into a viewport-height workspace in `app/run/run-asca-chat.tsx`
- [X] T025 [US2] Add responsive workspace sizing, conversation message scrolling, long-text wrapping, and supported desktop layout styles in `app/globals.css`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Manage Long Conversations (Priority: P3)

**Goal**: Long conversations remain readable, copyable, and easy to return to the latest message with automatic scrolling for new assistant responses.

**Independent Test**: Seed a long conversation, scroll the message area, verify the prompt stays anchored, verify the return-to-bottom control appears and works, verify new assistant responses move to the latest message, and verify copy success/failure feedback.

### Tests for User Story 3 (write first and verify failure)

- [X] T026 [P] [US3] Add component tests for long conversation scrolling, scroll-to-latest visibility, automatic latest-message movement, copy success feedback, and copy failure feedback in `tests/unit/run-asca-chat.test.tsx`
- [X] T027 [P] [US3] Add Playwright tests for independent message scrolling, anchored prompt input, return-to-bottom control, and message copy feedback in `tests/e2e/run-asca.spec.ts`

### Implementation for User Story 3

- [X] T028 [US3] Integrate `use-stick-to-bottom` and the existing scroll button behavior into the message viewport in `components/run-asca/conversation-panel.tsx`
- [X] T029 [US3] Implement per-message copy actions, temporary copied state, failed copy state, and original-text clipboard writes in `components/run-asca/chat-message.tsx`
- [X] T030 [US3] Add long-conversation seed/test data controls for component and e2e scenarios in `app/run/run-asca-chat.tsx`
- [X] T031 [US3] Verify markdown rendering preserves original message text for copy while formatting display content through `components/ui/markdown.tsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, coverage, accessibility, and implementation hygiene across all stories.

- [X] T032 [P] Add accessibility assertions for prompt labeling, message copy buttons, disabled Create New Thread, loading text, and error feedback in `tests/unit/run-asca-chat.test.tsx`
- [X] T033 [P] Add route contract edge-case coverage for malformed JSON, missing `ASCA_MODEL`, empty assistant text, and unsupported thread id in `tests/unit/asca-chat-route.test.ts`
- [X] T034 [P] Update manual validation notes for the implemented flow in `specs/003-run-asca/quickstart.md`
- [X] T035 Run formatting for changed TypeScript and Markdown files with `npm run format`
- [X] T036 Run linting with `npm run lint`
- [X] T037 Run type checking with `npm run typecheck`
- [X] T038 Run unit tests with `npm run test`
- [X] T039 Run coverage verification with `npm run test:coverage` and confirm changed behavior remains at or above 80%
- [X] T040 Run end-to-end tests with `npm run test:e2e`
- [X] T041 Run production build verification with `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2; delivers MVP.
- **User Story 2 (Phase 4)**: Depends on Phase 2 and can be built after or alongside US1, but final composition touches `app/run/run-asca-chat.tsx`.
- **User Story 3 (Phase 5)**: Depends on Phase 2 and benefits from US1/US2 message and layout surfaces.
- **Polish (Phase 6)**: Depends on all selected user stories being complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after foundation; this is the MVP.
- **US2 (P2)**: Can be tested independently with mock messages and the demonstration thread; integrates with US1 for final page composition.
- **US3 (P3)**: Can be tested independently with seeded long conversations; integrates with US1 message flow and US2 scroll containers.

### Within Each User Story

- Write tests first and verify they fail.
- Implement shared validation/types before route or UI integration.
- Implement route/client behavior before final page composition.
- Validate each story independently at its checkpoint before moving to the next priority.

---

## Parallel Opportunities

- T002, T003, T004, and T005 can run in parallel after T001 is started.
- T008, T009, and T010 can run in parallel after T006 and T007 are defined.
- US1 tests T011, T012, and T013 can run in parallel.
- US1 implementation T017 can run in parallel with route work T014/T015 after shared types exist.
- US2 tests T020 and T021 can run in parallel.
- US2 components T022 and T023 can run in parallel before composition task T024.
- US3 tests T026 and T027 can run in parallel.
- Polish tasks T032, T033, and T034 can run in parallel before the final quality gates.

## Parallel Example: User Story 1

```bash
# Launch failing tests for User Story 1 together:
Task: "T011 [P] [US1] Add route tests in tests/unit/asca-chat-route.test.ts"
Task: "T012 [P] [US1] Add component tests in tests/unit/run-asca-chat.test.tsx"
Task: "T013 [P] [US1] Add Playwright tests in tests/e2e/run-asca.spec.ts"

# Launch independent implementation after shared types exist:
Task: "T014 [US1] Implement route in app/api/asca/chat/route.ts"
Task: "T017 [P] [US1] Implement message rendering in components/run-asca/chat-message.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T020 [P] [US2] Add component tests in tests/unit/run-asca-chat.test.tsx"
Task: "T021 [P] [US2] Add Playwright layout tests in tests/e2e/run-asca.spec.ts"
Task: "T022 [P] [US2] Implement thread list in components/run-asca/thread-list.tsx"
Task: "T023 [P] [US2] Implement conversation panel in components/run-asca/conversation-panel.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T026 [P] [US3] Add scroll and copy component tests in tests/unit/run-asca-chat.test.tsx"
Task: "T027 [P] [US3] Add scroll and copy e2e tests in tests/e2e/run-asca.spec.ts"
Task: "T029 [US3] Implement copy actions in components/run-asca/chat-message.tsx"
Task: "T030 [US3] Add long-conversation controls in app/run/run-asca-chat.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation.
3. Complete Phase 3 User Story 1.
4. Stop and validate the authenticated prompt-to-response flow independently with Jest and Playwright.
5. Demo the MVP before expanding layout and long-conversation controls.

### Incremental Delivery

1. Setup and foundation produce typed contracts, route helpers, and test seams.
2. US1 adds working authenticated chat.
3. US2 adds the stable workspace layout and thread navigation surface.
4. US3 adds long-conversation ergonomics and copy feedback.
5. Polish runs coverage and release gates.

### Notes

- Keep persistent thread fetching, real thread creation, multimodal input, and backend orchestration out of scope.
- Do not expose `OPENAI_API_KEY` or provider internals to the client.
- Use existing local UI primitives before introducing new abstractions.
- Commit after each completed task or logical task group.
