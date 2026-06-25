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
export type ChatMessageStatus = "complete" | "streaming" | "error"

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
  state: "idle" | "streaming" | "succeeded" | "failed"
  errorMessage: string | null
}

/**
 * Lifecycle state for one streamed A.S.C.A. assistant response.
 */
export type StreamingAscaResponseState =
  | "waiting-for-first-text"
  | "streaming"
  | "complete"
  | "failed"

/**
 * Timing category for a stream failure relative to visible text chunks.
 */
export type StreamingAscaFailureTiming =
  | "before-first-text"
  | "after-partial-text"
  | "none"

/**
 * Runtime accumulator for the active streamed assistant response.
 */
export type StreamingAscaResponse = {
  messageId: string
  currentText: string
  state: StreamingAscaResponseState
  failureTiming: StreamingAscaFailureTiming
}

/**
 * Request payload for POST /api/asca/chat.
 */
export type AscaChatRequest = {
  threadId: ThreadId
  messages: UIMessage[]
}

/**
 * Successful response payload from POST /api/asca/chat.
 */
export type AscaChatStreamResponse = {
  contentType: "text/plain; charset=utf-8"
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
import type { UIMessage } from "ai"
