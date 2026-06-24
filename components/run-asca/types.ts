/**
 * Stable identifier for the only supported demonstration thread.
 */
export type ThreadId = "demo"

/**
 * Sender role accepted by the Run A.S.C.A. chat surface and route contract.
 */
export type ChatRole = "user" | "assistant"

/**
 * Lifecycle state for a locally rendered chat message.
 */
export type ChatMessageStatus = "complete" | "pending" | "error"

/**
 * Temporary clipboard feedback state for an individual message.
 */
export type MessageCopyState = "idle" | "copied" | "failed"

/**
 * One ordered message in the demonstration chat thread.
 */
export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  status: ChatMessageStatus
  copyState: MessageCopyState
}

/**
 * Conversation container shown in the Run A.S.C.A. thread list.
 */
export type Thread = {
  id: ThreadId
  title: string
  isSelected: boolean
  messages: ChatMessage[]
}

/**
 * Current prompt input and submission lifecycle for the active thread.
 */
export type PromptSubmission = {
  threadId: ThreadId
  input: string
  trimmedInput: string
  state: "idle" | "submitting" | "succeeded" | "failed"
  errorMessage: string | null
}

/**
 * Text-only message shape accepted by the chat Route Handler.
 */
export type AscaChatMessageInput = {
  role: ChatRole
  content: string
}

/**
 * Request payload for POST /api/asca/chat.
 */
export type AscaChatRequest = {
  threadId: ThreadId
  messages: AscaChatMessageInput[]
}

/**
 * Successful response payload from POST /api/asca/chat.
 */
export type AscaChatResponse = {
  message: {
    role: "assistant"
    content: string
  }
  model: string
}

/**
 * Supported public API error codes for the chat Route Handler.
 */
export type AscaChatErrorCode =
  | "invalid_request"
  | "unauthorized"
  | "asca_unavailable"

/**
 * Error response payload from POST /api/asca/chat.
 */
export type AscaChatErrorPayload = {
  error: {
    code: AscaChatErrorCode
    message: string
  }
}
