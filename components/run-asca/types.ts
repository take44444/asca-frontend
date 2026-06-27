import type { UIMessage } from "ai"

/**
 * Stable identifier for one of the supported demonstration threads.
 */
export type ThreadId =
  | "demo"
  | "incident-response-rehearsal"
  | "release-readiness-review"
  | "knowledge-base-grooming"
  | "customer-onboarding-draft"
  | "long-running-research-synthesis"
  | "quarterly-planning-notes"
  | "architecture-decision-log"
  | "agent-evaluation-notes"
  | "support-ticket-clustering"
  | "sales-discovery-summary"
  | "security-review-follow-up"
  | "documentation-gap-analysis"
  | "experiment-results-review"
  | "partner-integration-plan"
  | "budget-scenario-modeling"
  | "hiring-scorecard-review"
  | "design-critique-capture"
  | "retrospective-action-items"
  | "thread-list-accessibility-audit"

/** External application that produced a thread event. */
export type EventApp = "slack" | "microsoft-teams" | "discord" | "x" | "github"

/** One read-only external event associated with a demonstration thread. */
export type ThreadEvent = {
  id: string
  threadId: ThreadId
  app: EventApp
  sender: string
  externalThread?: string
  content: string
  occurredAt: string
}

/** Complete local event fixture collection keyed by demonstration thread. */
export type EventsByThread = Record<ThreadId, ThreadEvent[]>

/** Props for the selected thread's event presentation. */
export type EventViewProps = {
  events: ThreadEvent[]
}

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
 * Static non-live demonstration thread data projected into the thread list.
 */
export type StaticDemonstrationThread = {
  id: Exclude<ThreadId, "demo">
  title: string
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

/**
 * Compact metadata categories rendered above the active conversation.
 */
export type ThreadMetadataSummaryId =
  | "tasks"
  | "artifacts"
  | "knowledge"
  | "tokens"

/**
 * Visual tone used to distinguish one metadata summary category.
 */
export type ThreadMetadataTone = "sky" | "emerald" | "violet" | "amber"

/**
 * One compact contextual summary for the active Run A.S.C.A. thread.
 */
export type ThreadMetadataSummary = {
  id: ThreadMetadataSummaryId
  label: string
  primaryValue: string
  supportingDetails: string[]
  tone: ThreadMetadataTone
}

/**
 * Static task counts associated with the demonstration thread.
 */
export type TaskSummary = {
  completedCount: number
  pendingCount: number
}

/**
 * Static artifact counts grouped by artifact category.
 */
export type ArtifactSummary = {
  researchCount: number
  documentCount: number
  imageCount: number
}

/**
 * Static count of knowledge items acquired in the demonstration thread.
 */
export type KnowledgeSummary = {
  itemCount: number
}

/**
 * One chronological daily point in the token usage trend.
 */
export type TokenUsagePoint = {
  dateLabel: string
  inputTokens: number
  outputTokens: number
}

/**
 * Static token usage summary for the last seven days of the demonstration thread.
 */
export type TokenUsageSummary = {
  totalInputTokens: number
  totalOutputTokens: number
  points: TokenUsagePoint[]
}
