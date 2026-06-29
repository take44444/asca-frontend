import type { UIMessage } from "ai"

/**
 * Stable identifier for one of the supported demonstration agents.
 */
export type AgentId =
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
  | "agent-list-accessibility-audit"

/** External application that produced an agent event. */
export type EventApp = "slack" | "microsoft-teams" | "discord" | "x" | "github"

/** One read-only external event associated with a demonstration agent. */
export type AgentEvent = {
  id: string
  agentId: AgentId
  app: EventApp
  sender: string
  externalThread?: string
  content: string
  occurredAt: string
}

/** Complete local event fixture collection keyed by demonstration agent. */
export type EventsByAgent = Record<AgentId, AgentEvent[]>

/** Props for the selected agent's event presentation. */
export type EventViewProps = {
  events: AgentEvent[]
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
 * One ordered message in the demonstration agent conversation.
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
 * Conversation container shown in the Run A.S.C.A. agent list.
 */
export type Agent = {
  id: AgentId
  name: string
  role: string
  isSelected: boolean
  messages: ChatMessage[]
}

/**
 * Static non-live demonstration agent data projected into the agent list.
 */
export type StaticDemonstrationAgent = {
  id: Exclude<AgentId, "demo">
  name: string
  role: string
  messages: ChatMessage[]
}

/**
 * Current prompt input and submission lifecycle for the active agent.
 */
export type PromptSubmission = {
  agentId: AgentId
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
  agentId: AgentId
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
export type AgentMetadataSummaryId =
  | "knowledge"
  | "social"
  | "artifacts"
  | "tokens"

/**
 * Visual tone used to distinguish one metadata summary category.
 */
export type AgentMetadataTone = "sky" | "emerald" | "violet" | "amber"

/**
 * One compact contextual summary for the active Run A.S.C.A. agent.
 */
export type AgentMetadataSummary = {
  id: AgentMetadataSummaryId
  label: string
  primaryValue: string
  supportingDetails: string[]
  tone: AgentMetadataTone
}

/**
 * Static player counts with whom the demonstration agent has social interactions.
 */
export type SocialSummary = {
  playerCount: number
}

/**
 * Static artifact counts grouped by artifact category.
 */
export type ArtifactSummary = {
  documentCount: number
  imageCount: number
}

/**
 * Static count of knowledge items.
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
 * Static token usage summary for the last seven days of the demonstration agent.
 */
export type TokenUsageSummary = {
  totalInputTokens: number
  totalOutputTokens: number
  points: TokenUsagePoint[]
}
