# Data Model: Run A.S.C.A.

## Thread

Represents a conversation container shown in the thread list.

**Fields**:

- `id: "demo"`: Stable identifier for the only supported demonstration thread.
- `title: string`: Visible thread title.
- `isSelected: boolean`: Whether the thread is active in the conversation panel.
- `messages: ChatMessage[]`: Ordered message history.

**Validation rules**:

- At least one demonstration thread must exist.
- Create New Thread is visible but unavailable and must not create another thread.
- Selecting a thread must render that thread's title, messages, and prompt input.

## ChatMessage

Represents one message in the conversation.

**Fields**:

- `id: string`: Client-generated stable message identifier.
- `role: "user" | "assistant"`: Sender identity.
- `content: string`: Original text used for rendering and copying.
- `createdAt: string`: ISO timestamp or deterministic test value for ordering.
- `status: "complete" | "pending" | "error"`: Message lifecycle state.
- `copyState: "idle" | "copied" | "failed"`: Temporary copy feedback state.

**Validation rules**:

- `content` must preserve the original text for clipboard copying.
- Empty or whitespace-only user messages must not be added.
- Very long content must wrap without breaking the page layout.
- Assistant content may render markdown but copying must use original text.

## PromptSubmission

Represents a user's attempt to send text to A.S.C.A.

**Fields**:

- `threadId: "demo"`: Target thread.
- `input: string`: Current prompt field value.
- `trimmedInput: string`: Validation input.
- `state: "idle" | "submitting" | "succeeded" | "failed"`: Submission lifecycle.
- `errorMessage: string | null`: Non-blocking user-facing error.

**Validation rules**:

- Whitespace-only input is rejected locally.
- Send is disabled while `state` is `submitting`.
- Submitted user text appears immediately in the thread.
- Failed submissions preserve submitted context and allow continued use.

**State transitions**:

- `idle` -> `submitting` after a valid prompt.
- `submitting` -> `succeeded` when an assistant response is appended.
- `submitting` -> `failed` when the route returns an error or network failure.
- `failed` -> `idle` after a subsequent edit or retry path.

## AscaChatRequest

Represents the route handler request body for `POST /api/asca/chat`.

**Fields**:

- `threadId: "demo"`: Supported thread id.
- `messages: AscaChatMessageInput[]`: Ordered text-only messages to send.

**Validation rules**:

- Request must be authenticated.
- `threadId` must be `demo`.
- `messages` must contain at least one non-empty user message.
- Each message role must be `user` or `assistant`.
- Message content must be a non-empty string after trimming.

## AscaChatResponse

Represents the route handler success payload.

**Fields**:

- `message.role: "assistant"`: Response sender.
- `message.content: string`: Text returned by A.S.C.A.
- `model: string`: Model id read from `ASCA_MODEL`.

**Validation rules**:

- Assistant content must be non-empty before returning success.
- Provider errors return a failure payload without exposing secrets or internal provider details.
