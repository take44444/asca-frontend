# Research: Stream Text

## Decision: Use `streamText` for route-side generation

**Rationale**: The installed AI SDK documents `streamText` for interactive chat and real-time applications. It exposes `textStream`, `fullStream`, `toUIMessageStreamResponse`, and `toTextStreamResponse`; the current route already uses AI SDK Core with the OpenAI provider, so replacing `generateText` with `streamText` is the smallest change that delivers progressive output.

**Alternatives considered**:

- Keep `generateText` and simulate client streaming after the full response: rejected because users would not receive real response progress.
- Introduce AI SDK UI `useChat`: rejected for this scope because the app already has a custom thread/message model, custom scroll behavior, and a single demonstration thread.
- Build a custom OpenAI streaming client directly: rejected because AI SDK already owns provider integration and model abstraction.

## Decision: Return plain text deltas from `POST /api/asca/chat`

**Rationale**: The existing UI only needs assistant text content. AI SDK's `toTextStreamResponse` creates a `text/plain; charset=utf-8` streamed `Response` where each delta is a UTF-8 chunk. This avoids adopting the AI SDK UI message stream protocol while preserving the current typed request and message model.

**Alternatives considered**:

- Return a UI message stream with `toUIMessageStreamResponse`: rejected because it would require adopting UI message chunk parsing for no current need beyond text deltas.
- Return server-sent events with custom event names: rejected because the SDK already provides a simple text stream response and the feature does not require metadata events.
- Return JSON lines: rejected because the feature only needs ordered text deltas, and a custom protocol adds parsing work without additional value.

## Decision: Keep pre-stream validation errors as JSON

**Rationale**: Authentication, malformed request, unsupported thread, empty prompt, and missing model errors happen before a stream starts. Keeping the existing sanitized JSON error shape preserves current error handling and lets the client show clear messages before attempting to read a stream.

**Alternatives considered**:

- Encode all errors into the text stream: rejected because pre-stream errors should keep clear HTTP status codes and avoid ambiguous partial-message behavior.
- Use redirects from the route for unauthenticated requests: rejected because the client already maps a `401` route response to `/login`, and route handlers are public endpoints that should return explicit API status.

## Decision: Accumulate streamed chunks into one local assistant message

**Rationale**: The spec requires one visible A.S.C.A. response that grows as chunks arrive and becomes complete at the end. Adding one assistant message with a streaming status at the start of the stream keeps the thread stable and avoids creating one message per chunk.

**Alternatives considered**:

- Append each chunk as its own message: rejected because it breaks the chat transcript and copy behavior.
- Hide chunks until the stream closes: rejected because it would reproduce blocking behavior.
- Render streamed text outside the message list: rejected because users need the response to remain in the same conversation history.

## Decision: Preserve partial text and mark it incomplete on stream failure

**Rationale**: The user may already have useful content when a stream fails. The spec requires partial content to remain visible and distinguishable from completed answers. The client should mark the assistant message as incomplete/error and show a non-blocking error message.

**Alternatives considered**:

- Remove the partial response on failure: rejected because it discards visible user value.
- Mark partial failures as complete: rejected because users could mistake incomplete output for a finished answer.
- Retry automatically: rejected because retries can duplicate content and are not requested for this feature.

## Decision: Respect current scroll intent during streaming

**Rationale**: `use-stick-to-bottom` already supports the chat's independent scrolling model. Streaming should keep users at the latest content only when they are already at the bottom; if they scroll away, the UI should keep the return-to-latest control available without forcing jumps.

**Alternatives considered**:

- Always scroll on every chunk: rejected because it interrupts users reading earlier messages.
- Never scroll during streaming: rejected because users at the bottom would not see the live response continue.

## Decision: Test streaming with controlled `ReadableStream` helpers

**Rationale**: Jest and Playwright can verify progressive updates by fulfilling fetches with controlled streams. AI SDK also ships `simulateReadableStream`, which is useful for route-level stream mocks. Tests should assert behavior before implementation: first chunk visibility, later chunk append, stream completion, failure before text, failure after partial text, and duplicate submission blocking.

**Alternatives considered**:

- Use real provider calls in tests: rejected because tests must be deterministic and must not depend on network/provider availability.
- Only test the final completed text: rejected because it would not prove progressive behavior.
