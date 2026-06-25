# Tasks: Stream Text

**Input**: Design documents from `/specs/004-stream-text/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks are mandatory for this feature. Write each user story's tests before production implementation and observe the failing state before changing production code.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm installed-version guidance and current code/test surfaces before changing behavior.

- [ ] T001 Review installed Next.js Route Handler, Server Component, Client Component, authentication, and redirect guidance in node_modules/next/dist/docs/ before editing app/api/asca/chat/route.ts, app/run/page.tsx, or app/run/run-asca-chat.tsx
- [ ] T002 [P] Review installed AI SDK streamText, Next.js App Router, streaming, stream abort handling, and simulateReadableStream docs in node_modules/ai/docs/ and node_modules/@ai-sdk/openai/docs/ before editing app/api/asca/chat/route.ts
- [ ] T003 [P] Inspect current chat route validation and response helpers in lib/asca-chat.ts and app/api/asca/chat/route.ts against specs/004-stream-text/contracts/api-contract.md
- [ ] T004 [P] Inspect current Run A.S.C.A. message, copy, and scroll behavior in app/run/run-asca-chat.tsx and components/run-asca/conversation-panel.tsx against specs/004-stream-text/contracts/ui-contract.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared typed contracts and deterministic stream test helpers required by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Add explicit streaming message/status types for ChatMessage, PromptSubmission, and StreamingAscaResponse in components/run-asca/types.ts
- [ ] T006 Add typed chat request, sanitized error, and plain-text stream response helper contracts in lib/asca-chat.ts
- [ ] T007 [P] Add controlled ReadableStream and chunk flushing helpers for client tests in tests/unit/run-asca-test-helpers.ts
- [ ] T008 [P] Add route stream mock helpers for AI SDK streamText tests in tests/unit/asca-chat-route.test.ts

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Receive Streaming Responses (Priority: P1) MVP

**Goal**: Valid prompts appear immediately and one A.S.C.A. response message grows progressively from streamed text chunks until complete.

**Independent Test**: Submit a valid prompt in the existing Run A.S.C.A. conversation and verify partial A.S.C.A. text appears before the final answer completes.

### Tests for User Story 1 (MANDATORY - write before implementation)

> Write these tests FIRST and confirm they fail before implementation.

- [ ] T009 [P] [US1] Add route unit tests for POST /api/asca/chat returning text/plain streamed chunks and using ASCA_MODEL in tests/unit/asca-chat-route.test.ts
- [ ] T010 [P] [US1] Add client unit tests for immediate user message rendering and chunk accumulation into one assistant message in tests/unit/run-asca-chat.test.tsx
- [ ] T011 [P] [US1] Add authenticated Playwright streaming chat test for partial text before final response in tests/e2e/run-asca.spec.ts

### Implementation for User Story 1

- [ ] T012 [US1] Replace generateText JSON success handling with streamText and toTextStreamResponse in app/api/asca/chat/route.ts
- [ ] T013 [US1] Preserve authenticated request validation, demo thread validation, empty prompt rejection, and sanitized JSON pre-stream errors in lib/asca-chat.ts and app/api/asca/chat/route.ts
- [ ] T014 [US1] Implement client fetch stream reading with TextDecoder chunk accumulation into one assistant ChatMessage in app/run/run-asca-chat.tsx
- [ ] T015 [US1] Render streaming assistant content through existing markdown/copy message components in components/run-asca/chat-message.tsx and components/ui/markdown.tsx
- [ ] T016 [US1] Verify User Story 1 tests fail first and then pass in tests/unit/asca-chat-route.test.ts, tests/unit/run-asca-chat.test.tsx, and tests/e2e/run-asca.spec.ts

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Understand Streaming State (Priority: P2)

**Goal**: Users can distinguish waiting for first text, active streaming, and completed responses.

**Independent Test**: Submit a valid prompt and observe visible processing before first text, an in-progress indication while chunks arrive, and normal reading/copying after completion.

### Tests for User Story 2 (MANDATORY - write before implementation)

- [ ] T017 [P] [US2] Add client unit tests for waiting-for-first-text processing state, streaming status, completion transition, and duplicate submit prevention in tests/unit/run-asca-chat.test.tsx
- [ ] T018 [P] [US2] Add accessibility assertions for status/error semantics and prompt/send disabled states in tests/unit/run-asca-chat.test.tsx
- [ ] T019 [P] [US2] Add Playwright assertions for processing state, in-progress marker removal, anchored prompt, and no duplicate route calls in tests/e2e/run-asca.spec.ts

### Implementation for User Story 2

- [ ] T020 [US2] Add waiting-for-first-text, streaming, complete, and disabled-submit state transitions in app/run/run-asca-chat.tsx
- [ ] T021 [US2] Show the existing A.S.C.A. is thinking... processing state before first text and an in-progress marker during partial content in components/run-asca/conversation-panel.tsx and components/run-asca/chat-message.tsx
- [ ] T022 [US2] Disable prompt input and send action while streaming while preserving accessible labels in app/run/run-asca-chat.tsx and components/ui/prompt-input.tsx
- [ ] T023 [US2] Preserve copy-current-visible-text behavior for streaming and complete assistant messages in components/run-asca/chat-message.tsx
- [ ] T024 [US2] Verify User Story 2 tests fail first and then pass in tests/unit/run-asca-chat.test.tsx and tests/e2e/run-asca.spec.ts

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Recover From Streaming Problems (Priority: P3)

**Goal**: Failed streams preserve submitted prompts, preserve partial text when available, mark incomplete answers clearly, and allow follow-up prompts.

**Independent Test**: Simulate failures before and after partial streamed text and verify the conversation remains usable.

### Tests for User Story 3 (MANDATORY - write before implementation)

- [ ] T025 [P] [US3] Add route unit tests for malformed JSON, empty prompt, unsupported thread, signed-out session, missing ASCA_MODEL, and provider startup errors in tests/unit/asca-chat-route.test.ts
- [ ] T026 [P] [US3] Add client unit tests for non-OK JSON errors before stream text, stream read errors after partial text, incomplete status, and follow-up submission in tests/unit/run-asca-chat.test.tsx
- [ ] T027 [P] [US3] Add Playwright interrupted stream scenario covering partial text preservation, incomplete marking, and follow-up prompt submission in tests/e2e/run-asca.spec.ts

### Implementation for User Story 3

- [ ] T028 [US3] Map pre-stream route failures to sanitized JSON error payloads without provider internals in lib/asca-chat.ts and app/api/asca/chat/route.ts
- [ ] T029 [US3] Handle fetch rejection, non-OK JSON errors, missing response body, and stream read errors in app/run/run-asca-chat.tsx
- [ ] T030 [US3] Preserve partial assistant content and mark the assistant message incomplete when stream reading fails after text in app/run/run-asca-chat.tsx and components/run-asca/chat-message.tsx
- [ ] T031 [US3] Show user-facing error copy for failed-before-text and failed-after-partial-text states in components/run-asca/conversation-panel.tsx
- [ ] T032 [US3] Re-enable prompt input and send action after stream completion or failure in app/run/run-asca-chat.tsx
- [ ] T033 [US3] Verify User Story 3 tests fail first and then pass in tests/unit/asca-chat-route.test.ts, tests/unit/run-asca-chat.test.tsx, and tests/e2e/run-asca.spec.ts

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate scroll behavior, formatting, coverage, and production readiness across all stories.

- [ ] T034 [P] Add or update tests for user-at-bottom auto-follow, user-scrolled-away no-jump behavior, return-to-latest control, and long streamed content in tests/unit/run-asca-chat.test.tsx
- [ ] T035 [P] Add or update Playwright checks for independent message scrolling, disabled page scroll, anchored prompt, and return-to-latest control in tests/e2e/run-asca.spec.ts
- [ ] T036 [P] Verify partial markdown remains readable while streaming and after completion in components/ui/markdown.tsx and tests/unit/run-asca-chat.test.tsx
- [ ] T037 Run npm run lint and fix any reported issues in app/api/asca/chat/route.ts, app/run/run-asca-chat.tsx, components/run-asca/, lib/asca-chat.ts, tests/unit/, and tests/e2e/
- [ ] T038 Run npm run format and keep formatting changes scoped to app/api/asca/chat/route.ts, app/run/run-asca-chat.tsx, components/run-asca/, lib/asca-chat.ts, tests/unit/, and tests/e2e/
- [ ] T039 Run npm run typecheck and resolve all TypeScript errors in app/api/asca/chat/route.ts, app/run/run-asca-chat.tsx, components/run-asca/types.ts, and lib/asca-chat.ts
- [ ] T040 Run npm run test and npm run test:coverage, then confirm changed streaming behavior maintains at least 80% coverage in tests/unit/
- [ ] T041 Run npm run test:e2e and verify authenticated streaming chat, interrupted stream, and layout guarantees in tests/e2e/run-asca.spec.ts
- [ ] T042 Run npm run build and resolve any production build issues in app/api/asca/chat/route.ts, app/run/page.tsx, and app/run/run-asca-chat.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational. This is the MVP and has no dependency on other stories.
- **User Story 2 (P2)**: Can start after Foundational, but integrates with the assistant message lifecycle created for US1.
- **User Story 3 (P3)**: Can start after Foundational, but reuses the stream reader and message status model from US1 and US2.

### Within Each User Story

- Tests must be written and observed failing before implementation.
- Types and helpers before route/client implementation.
- Route streaming before client stream consumption for US1.
- State and accessibility tests before visual state implementation for US2.
- Failure tests before error and recovery implementation for US3.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001 starts.
- T007 and T008 can run in parallel after T005 and T006 are understood.
- US1 test tasks T009, T010, and T011 can run in parallel.
- US2 test tasks T017, T018, and T019 can run in parallel.
- US3 test tasks T025, T026, and T027 can run in parallel.
- Polish tests T034, T035, and T036 can run in parallel after US1-US3 implementation.

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tests together:
Task: "T009 [P] [US1] Add route unit tests for POST /api/asca/chat returning text/plain streamed chunks and using ASCA_MODEL in tests/unit/asca-chat-route.test.ts"
Task: "T010 [P] [US1] Add client unit tests for immediate user message rendering and chunk accumulation into one assistant message in tests/unit/run-asca-chat.test.tsx"
Task: "T011 [P] [US1] Add authenticated Playwright streaming chat test for partial text before final response in tests/e2e/run-asca.spec.ts"
```

## Parallel Example: User Story 2

```bash
# Launch all US2 tests together:
Task: "T017 [P] [US2] Add client unit tests for waiting-for-first-text processing state, streaming status, completion transition, and duplicate submit prevention in tests/unit/run-asca-chat.test.tsx"
Task: "T018 [P] [US2] Add accessibility assertions for status/error semantics and prompt/send disabled states in tests/unit/run-asca-chat.test.tsx"
Task: "T019 [P] [US2] Add Playwright assertions for processing state, in-progress marker removal, anchored prompt, and no duplicate route calls in tests/e2e/run-asca.spec.ts"
```

## Parallel Example: User Story 3

```bash
# Launch all US3 tests together:
Task: "T025 [P] [US3] Add route unit tests for malformed JSON, empty prompt, unsupported thread, signed-out session, missing ASCA_MODEL, and provider startup errors in tests/unit/asca-chat-route.test.ts"
Task: "T026 [P] [US3] Add client unit tests for non-OK JSON errors before stream text, stream read errors after partial text, incomplete status, and follow-up submission in tests/unit/run-asca-chat.test.tsx"
Task: "T027 [P] [US3] Add Playwright interrupted stream scenario covering partial text preservation, incomplete marking, and follow-up prompt submission in tests/e2e/run-asca.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate route streaming plus client chunk accumulation independently.

### Incremental Delivery

1. Setup + Foundational -> typed stream contracts and deterministic tests ready.
2. Add US1 -> progressive response text is visible before completion.
3. Add US2 -> users can distinguish waiting, streaming, and complete states.
4. Add US3 -> failures preserve prompt/partial text and conversation recovery.
5. Run Phase 6 quality gates before considering the feature complete.

### Parallel Team Strategy

After Phase 2, separate developers can write US1, US2, and US3 tests in parallel, but implementation should land in priority order because US2 and US3 integrate with the stream reader and message lifecycle introduced by US1.

## Notes

- [P] tasks use different files or can be performed independently before implementation begins.
- [US1], [US2], and [US3] labels map directly to the user stories in specs/004-stream-text/spec.md.
- Every user story phase includes a failing-first test checkpoint before production code changes.
- Avoid persistent threads, multimodal input, tool execution, backend agent orchestration, or direct client OpenAI access.
