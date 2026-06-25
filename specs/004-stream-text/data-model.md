# Data Model: Stream Text

## PromptSubmission

Represents a user's valid attempt to send text to A.S.C.A.

**Fields**:

- `threadId`: the selected demonstration thread identifier; valid value is `demo`
- `input`: raw prompt text currently in the input field
- `trimmedInput`: prompt text after trimming surrounding whitespace
- `state`: `idle`, `streaming`, `succeeded`, or `failed`
- `errorMessage`: user-facing error text when validation, request, or streaming fails

**Validation Rules**:

- `threadId` must be `demo`
- `trimmedInput` must be non-empty
- submissions are rejected while `state` is `streaming`
- prompt content remains text-only

## ChatMessage

Represents one ordered message rendered in the demonstration thread.

**Fields**:

- `id`: stable client-side message identifier
- `role`: `user` or `assistant`
- `content`: current visible text for the message
- `createdAt`: timestamp string for message ordering
- `status`: `complete`, `streaming`, or `error`
- `copyState`: `idle`, `copied`, or `failed`

**Validation Rules**:

- user messages are created only from valid prompt submissions
- assistant streaming messages may have empty content while waiting for the first chunk
- assistant messages with `status: streaming` must transition to `complete` or `error`
- assistant messages with `status: error` may retain partial content and must be visually distinguishable from complete messages

## StreamingAscaResponse

Represents the lifecycle of one assistant answer produced by a streamed route response.

**Fields**:

- `messageId`: id of the assistant `ChatMessage` receiving chunks
- `currentText`: accumulated visible response text
- `state`: `waiting-for-first-text`, `streaming`, `complete`, or `failed`
- `failureTiming`: `before-first-text`, `after-partial-text`, or `none`

**State Transitions**:

```text
waiting-for-first-text
├── first text chunk received -> streaming
├── stream closes with text -> complete
└── stream fails before text -> failed

streaming
├── additional text chunk received -> streaming
├── stream closes -> complete
└── stream fails -> failed
```

**Validation Rules**:

- response state starts after a valid prompt submission
- chunks append in arrival order
- completion requires the response stream to close without a read error
- failure after partial text preserves `currentText`

## ResponseStreamEvent

Represents an observable stream event consumed by the client.

**Fields**:

- `type`: `text-delta`, `complete`, or `error`
- `text`: text content for `text-delta` events
- `message`: sanitized user-facing error text for `error` events

**Validation Rules**:

- text deltas append to the active assistant message
- complete events mark the active assistant message complete
- error events mark the active assistant message failed and stop active streaming

## ConversationViewState

Represents the user's scroll relationship to the conversation while streaming text arrives.

**Fields**:

- `isAtLatest`: whether the user is currently viewing the bottom of the message list
- `hasActiveStream`: whether an assistant response is currently streaming
- `showReturnToLatest`: whether the return-to-latest control should be visible

**Validation Rules**:

- if `isAtLatest` is true, new streamed text should remain visible
- if `isAtLatest` is false, streamed text must not force the user's scroll position to jump
- `showReturnToLatest` is true when the user is away from the latest content
