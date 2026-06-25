# Quickstart: Stream Text

## Prerequisites

- Install dependencies with `npm install` if needed.
- Ensure `.env.local` contains `OPENAI_API_KEY`.
- Ensure `ASCA_MODEL` is set for local testing; tests use `gpt-5.4-nano`.
- Review the contracts:
  - [API contract](./contracts/api-contract.md)
  - [UI contract](./contracts/ui-contract.md)
  - [Data model](./data-model.md)

## Validation Commands

Run these from the repository root:

```bash
npm run lint
npm run format
npm run typecheck
npm run test
npm run test:coverage
npm run test:e2e
npm run build
```

## Unit Validation Scenarios

### Route Streams Text

1. Mock an authenticated session.
2. Mock `streamText` to produce ordered chunks such as `["A.S.C.A.", " streams", "."]`.
3. Call `POST /api/asca/chat` with a valid `demo` request.
4. Assert status `200`, `Content-Type: text/plain; charset=utf-8`, and streamed body text `A.S.C.A. streams.`
5. Assert the OpenAI provider receives `ASCA_MODEL`.

### Route Keeps Pre-Stream JSON Errors

1. Send malformed JSON, empty prompt, unsupported thread, signed-out session, and missing model cases.
2. Assert existing JSON error payloads and status codes remain stable.
3. Assert provider calls are not made for rejected requests.

### Client Accumulates Streamed Chunks

1. Mock `fetch` with a delayed `ReadableStream`.
2. Submit a valid prompt.
3. Assert the user message appears immediately.
4. Release the first chunk and assert one in-progress A.S.C.A. message appears with partial text.
5. Release more chunks and assert the same message updates.
6. Close the stream and assert the message becomes complete and the input is enabled.

### Client Handles Stream Failures

1. Simulate a rejected fetch or non-OK JSON error before any stream body is read.
2. Assert the submitted user message remains and the route error is visible.
3. Simulate a stream read error after one text chunk.
4. Assert the partial A.S.C.A. message remains visible and is marked incomplete.
5. Assert the user can submit another prompt after failure.

### Copy and Scroll Behavior

1. While an A.S.C.A. message is streaming, copy it and assert clipboard receives the currently visible text.
2. Keep the user at the latest message and assert new chunks remain visible.
3. Set the user away from the bottom and assert new chunks do not force a scroll jump.
4. Assert the return-to-latest control returns the user to the latest streamed content.

## End-to-End Validation Scenarios

### Signed-In Streaming Chat

1. Start the app with `npm run dev`.
2. Sign in through the existing test session helper.
3. Intercept `**/api/asca/chat` with a streamed plain-text response.
4. Open `/run`, submit `Explain this workspace.`, and assert:
   - the prompt appears immediately
   - partial streamed text appears before the full response
   - the final response appears as one A.S.C.A. message
   - the prompt becomes available after completion

### Interrupted Stream

1. Intercept `**/api/asca/chat` with a stream that emits partial text and then errors or closes unexpectedly.
2. Assert partial text remains visible and is marked incomplete.
3. Assert a follow-up prompt can be submitted.

### Existing Layout Guarantees

1. Re-run the existing viewport and independent-scroll e2e checks.
2. Assert whole-page vertical scroll remains disabled.
3. Assert the prompt remains anchored while streamed text grows.
