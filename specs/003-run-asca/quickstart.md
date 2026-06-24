# Quickstart: Run A.S.C.A.

## Prerequisites

- Install dependencies with `npm install`.
- Configure auth variables required by the existing authentication feature.
- Configure `OPENAI_API_KEY` for real A.S.C.A. responses.
- Configure `ASCA_MODEL`; use `ASCA_MODEL=gpt-5.4-nano` for tests.

## Validate Design Contracts

Review:

- [API contract](./contracts/api-contract.md)
- [UI contract](./contracts/ui-contract.md)
- [Data model](./data-model.md)

## Test-First Implementation Flow

1. Add failing unit tests for `POST /api/asca/chat`:
   - signed-out request returns `401`
   - invalid or empty request returns `400`
   - valid request passes `ASCA_MODEL` to AI SDK
   - successful AI response maps to the success contract
   - provider failure maps to `asca_unavailable`
2. Add failing component tests for `/run` chat behavior:
   - authenticated page renders the chat workspace
   - whitespace prompt is rejected
   - valid prompt appends a user message and shows `A.S.C.A. is thinking...`
   - successful response appends an A.S.C.A. message
   - pending state prevents duplicate sends
   - copy success and failure feedback are visible
3. Add failing Playwright tests for the end-to-end user stories:
   - signed-out `/run` redirects to `/login`
   - signed-in user can submit a prompt and see a response
   - page has no whole-page vertical scroll at supported desktop size
   - message area and thread list scroll independently
   - scroll-to-latest control appears when away from the bottom

## Manual Validation

The implemented `/run` workspace is a protected two-pane chat surface. It shows
one selected demonstration thread, a disabled Create New Thread action, a
conversation panel with markdown-capable messages, anchored prompt input,
pending/error states, copy feedback, and return-to-latest behavior for long
threads.

1. Start the app:

   ```bash
   ASCA_MODEL=gpt-5.4-nano npm run dev
   ```

2. Sign in using the existing authentication flow.
3. Open `/run`.
4. Verify the thread list, selected demonstration thread, conversation area, and prompt input are visible.
5. Submit a non-empty prompt.
6. Verify the user message appears immediately.
7. Verify `A.S.C.A. is thinking...` appears while pending.
8. Verify the assistant response appears as the latest message.
9. Copy a user and assistant message and verify temporary success feedback.
10. Scroll away from the latest message and verify the return-to-bottom control works.
11. Confirm the browser page itself does not vertically scroll at supported desktop sizes while the message viewport scrolls independently.

## Quality Gates

Run all gates before completion:

```bash
npm run lint
npm run format
npm run typecheck
npm run test
npm run test:coverage
npm run test:e2e
npm run build
```

If a gate cannot run because real credentials are unavailable, record the limitation and keep deterministic route tests mocked.
