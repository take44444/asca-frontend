# UI Contract: Stream Text

## Scope

The Stream Text feature updates the existing Run A.S.C.A. workspace. It does not add new threads, persistence, multimodal input, or backend agent orchestration.

## Required User-Facing States

### Idle

- Prompt input is enabled.
- Send button is disabled when the prompt is empty or whitespace-only.
- Existing messages remain readable and copyable.

### Waiting For First Text

- Begins immediately after a valid prompt is submitted.
- User prompt appears in the thread.
- A.S.C.A. shows the existing `A.S.C.A. is thinking...` processing state or an empty assistant message with a clear in-progress indication.
- Prompt input and send action are disabled to prevent overlapping submissions.

### Streaming

- One A.S.C.A. message appears and grows as text chunks arrive.
- The message is visually marked as in progress.
- Common markdown formatting remains readable while content is partial.
- Copying the message copies the currently visible text.
- Users at the latest message continue seeing new chunks.
- Users who scroll away are not forced back to the bottom.
- The return-to-latest control remains available when the user is away from the latest content.

### Complete

- The in-progress indication is removed.
- The final A.S.C.A. message remains in the conversation.
- Prompt input and send action become available again.
- Copying the message copies the final text.

### Failed Before Text

- The user's submitted prompt remains visible.
- No empty completed assistant answer is shown.
- A visible error explains that A.S.C.A. could not return a response.
- Prompt input and send action become available again.

### Failed After Partial Text

- Partial A.S.C.A. text remains visible in the thread.
- The partial message is marked incomplete or failed.
- A visible error explains that A.S.C.A. could not complete the response.
- Prompt input and send action become available again.

## Accessibility Expectations

- Processing, streaming, and error states are exposed through appropriate live regions or status/error semantics.
- The prompt input keeps its accessible label: `Prompt A.S.C.A.`
- The send button keeps its accessible name: `Send prompt`
- The return-to-latest control keeps its accessible name: `Return to latest message`
- Copy actions keep sender-specific labels, such as `Copy A.S.C.A. message`

## Interaction Rules

- Pressing Enter or clicking Send with a valid prompt starts exactly one active stream.
- Sending while a stream is active is ignored or disabled; it must not create duplicate route calls.
- Navigating to login after a `401` response remains client-side behavior.
- Clipboard failure remains non-blocking and does not alter stream state.
- Long streamed responses must not resize the page or unanchor the prompt area.
