import type {
  ArtifactSummary,
  ChatMessage,
  KnowledgeSummary,
  StaticDemonstrationThread,
  TaskSummary,
  Thread,
  ThreadId,
  ThreadMetadataSummary,
  TokenUsagePoint,
  TokenUsageSummary,
} from "@/components/run-asca/types"

/**
 * Stable id for the live demonstration thread backed by the chat transport.
 */
export const DEMO_THREAD_ID: ThreadId = "demo"

/**
 * User-visible title for the live demonstration thread.
 */
export const DEMO_THREAD_TITLE = "Demonstration Thread"

const tokenUsagePoints = [
  { dateLabel: "Jun 20", inputTokens: 420, outputTokens: 880 },
  { dateLabel: "Jun 21", inputTokens: 0, outputTokens: 0 },
  { dateLabel: "Jun 22", inputTokens: 760, outputTokens: 1280 },
  { dateLabel: "Jun 23", inputTokens: 540, outputTokens: 940 },
  { dateLabel: "Jun 24", inputTokens: 980, outputTokens: 1760 },
  { dateLabel: "Jun 25", inputTokens: 620, outputTokens: 1140 },
  { dateLabel: "Jun 26", inputTokens: 840, outputTokens: 1540 },
] satisfies TokenUsagePoint[]

const totalInputTokens = tokenUsagePoints.reduce(
  (total, point) => total + point.inputTokens,
  0
)
const totalOutputTokens = tokenUsagePoints.reduce(
  (total, point) => total + point.outputTokens,
  0
)

/**
 * Static task summary used by the demonstration Run A.S.C.A. thread.
 */
export const demoTaskSummary: TaskSummary = {
  completedCount: 8,
  pendingCount: 3,
}

/**
 * Static artifact summary used by the demonstration Run A.S.C.A. thread.
 */
export const demoArtifactSummary: ArtifactSummary = {
  researchCount: 4,
  documentCount: 2,
  imageCount: 1,
}

/**
 * Static knowledge summary used by the demonstration Run A.S.C.A. thread.
 */
export const demoKnowledgeSummary: KnowledgeSummary = {
  itemCount: 14,
}

/**
 * Static seven-day token usage summary used by the demonstration Run A.S.C.A. thread.
 */
export const demoTokenUsageSummary: TokenUsageSummary = {
  totalInputTokens,
  totalOutputTokens,
  points: tokenUsagePoints,
}

/**
 * Static metadata summaries rendered above the demonstration conversation.
 */
export const demoThreadMetadataSummaries: ThreadMetadataSummary[] = [
  {
    id: "tasks",
    label: "Tasks",
    primaryValue: `${demoTaskSummary.completedCount + demoTaskSummary.pendingCount}`,
    supportingDetails: [
      `${demoTaskSummary.completedCount} completed`,
      `${demoTaskSummary.pendingCount} pending`,
    ],
    tone: "emerald",
  },
  {
    id: "artifacts",
    label: "Artifacts",
    primaryValue: `${demoArtifactSummary.researchCount +
      demoArtifactSummary.documentCount +
      demoArtifactSummary.imageCount
      }`,
    supportingDetails: [
      `${demoArtifactSummary.researchCount} research`,
      `${demoArtifactSummary.documentCount} documents`,
      `${demoArtifactSummary.imageCount} images`,
    ],
    tone: "sky",
  },
  {
    id: "knowledge",
    label: "Knowledge",
    primaryValue: `${demoKnowledgeSummary.itemCount}`,
    supportingDetails: [`${demoKnowledgeSummary.itemCount} acquired items`],
    tone: "violet",
  },
  {
    id: "tokens",
    label: "Total Tokens",
    primaryValue: `${(
      demoTokenUsageSummary.totalInputTokens +
      demoTokenUsageSummary.totalOutputTokens
    ).toLocaleString()}`,
    supportingDetails: [
      `${demoTokenUsageSummary.totalInputTokens.toLocaleString()} input`,
      `${demoTokenUsageSummary.totalOutputTokens.toLocaleString()} output`,
    ],
    tone: "amber",
  },
]

function createFixtureMessage(
  threadId: ThreadId,
  index: number,
  role: ChatMessage["role"],
  content: string
): ChatMessage {
  return {
    id: `${threadId}-message-${index}`,
    role,
    content,
    createdAt: `2026-06-24T${String(index).padStart(2, "0")}:00:00.000Z`,
    status: "complete",
    copyState: "idle",
  }
}

function createFixtureMessages(
  threadId: ThreadId,
  contents: string[]
): ChatMessage[] {
  return contents.map((content, index) =>
    createFixtureMessage(
      threadId,
      index,
      index % 2 === 0 ? "user" : "assistant",
      content
    )
  )
}

const longRunningResearchMessages = Array.from(
  { length: 12 },
  (_, index) =>
    `Research note ${index + 1}: ${index === 11
      ? "final recommendation and tradeoffs."
      : "capture evidence, risks, and source confidence."
    }`
)

/**
 * Static non-live demonstration threads shown in the Run A.S.C.A. thread list.
 */
export const staticDemonstrationThreads: StaticDemonstrationThread[] = [
  {
    id: "incident-response-rehearsal",
    title: "Incident response rehearsal",
    messages: createFixtureMessages("incident-response-rehearsal", [
      "Confirm the escalation path and summarize owners.",
      "Escalation owners are grouped by severity and service boundary.",
      "Draft a tabletop agenda for the on-call leads.",
    ]),
  },
  {
    id: "release-readiness-review",
    title: "Release readiness review",
    messages: createFixtureMessages("release-readiness-review", [
      "List blockers by severity before the release window.",
      "Two high-severity blockers need owner confirmation before Thursday.",
      "Prepare a rollback checklist for the coordinator.",
      "Rollback checklist drafted with validation and comms checkpoints.",
    ]),
  },
  {
    id: "knowledge-base-grooming",
    title: "Knowledge base grooming",
    messages: createFixtureMessages("knowledge-base-grooming", [
      "Group stale articles by owner and last reviewed date.",
      "Articles are grouped into platform, support, and onboarding queues.",
    ]),
  },
  {
    id: "customer-onboarding-draft",
    title: "Customer onboarding draft",
    messages: createFixtureMessages("customer-onboarding-draft", [
      "Turn the kickoff notes into a first-week checklist.",
      "The checklist now separates access, training, and success metrics.",
      "Add a concise stakeholder handoff note.",
      "Stakeholder handoff note added for account and implementation leads.",
      "Flag any missing prerequisites.",
    ]),
  },
  {
    id: "long-running-research-synthesis",
    title: "Long-running research synthesis",
    messages: createFixtureMessages(
      "long-running-research-synthesis",
      longRunningResearchMessages
    ),
  },
  {
    id: "quarterly-planning-notes",
    title:
      "Quarterly planning notes with a deliberately long title that stays contained",
    messages: [],
  },
  {
    id: "architecture-decision-log",
    title: "Architecture decision log",
    messages: createFixtureMessages("architecture-decision-log", [
      "Summarize the tradeoffs for the queueing decision.",
      "The decision favors managed queues to reduce operational load.",
      "Record the migration risk separately.",
    ]),
  },
  {
    id: "agent-evaluation-notes",
    title: "Agent evaluation notes",
    messages: createFixtureMessages("agent-evaluation-notes", [
      "Compare answer accuracy across the latest evaluation batch.",
      "Accuracy improved, but citation coverage still needs attention.",
    ]),
  },
  {
    id: "support-ticket-clustering",
    title: "Support ticket clustering",
    messages: createFixtureMessages("support-ticket-clustering", [
      "Cluster this week's support tickets by root cause.",
      "The top clusters are permissions, billing state, and import retries.",
      "Create a short summary for support leads.",
    ]),
  },
  {
    id: "sales-discovery-summary",
    title: "Sales discovery summary",
    messages: createFixtureMessages("sales-discovery-summary", [
      "Extract pain points from the discovery transcript.",
      "The strongest themes are response time, auditability, and rollout risk.",
    ]),
  },
  {
    id: "security-review-follow-up",
    title: "Security review follow-up",
    messages: createFixtureMessages("security-review-follow-up", [
      "Turn review comments into actionable remediation items.",
      "Remediation items are sorted by control area and target date.",
      "Highlight anything requiring policy review.",
      "Policy review is required for data retention language.",
    ]),
  },
  {
    id: "documentation-gap-analysis",
    title: "Documentation gap analysis",
    messages: createFixtureMessages("documentation-gap-analysis", [
      "Find gaps between the implementation notes and public docs.",
      "Public docs are missing retry behavior and permission examples.",
    ]),
  },
  {
    id: "experiment-results-review",
    title: "Experiment results review",
    messages: createFixtureMessages("experiment-results-review", [
      "Summarize the experiment outcome and confidence level.",
      "The variant improved completion but sample size remains limited.",
      "Call out follow-up experiments.",
    ]),
  },
  {
    id: "partner-integration-plan",
    title: "Partner integration plan",
    messages: createFixtureMessages("partner-integration-plan", [
      "Draft integration milestones from the partner notes.",
      "Milestones cover sandbox access, mapping, pilot, and launch readiness.",
    ]),
  },
  {
    id: "budget-scenario-modeling",
    title: "Budget scenario modeling",
    messages: createFixtureMessages("budget-scenario-modeling", [
      "Create a conservative and expected budget scenario.",
      "Expected spend stays within target when support volume is flat.",
      "Conservative scenario needs a hiring freeze assumption.",
    ]),
  },
  {
    id: "hiring-scorecard-review",
    title: "Hiring scorecard review",
    messages: createFixtureMessages("hiring-scorecard-review", [
      "Normalize interviewer notes into scorecard themes.",
      "Themes are technical depth, collaboration, product judgment, and risk.",
    ]),
  },
  {
    id: "design-critique-capture",
    title: "Design critique capture",
    messages: createFixtureMessages("design-critique-capture", [
      "Capture critique notes for the settings redesign.",
      "The primary concern is hierarchy between defaults and overrides.",
      "Add a decision log entry.",
    ]),
  },
  {
    id: "retrospective-action-items",
    title: "Retrospective action items",
    messages: createFixtureMessages("retrospective-action-items", [
      "Convert retrospective notes into owned action items.",
      "Five actions have clear owners and two need follow-up assignments.",
    ]),
  },
  {
    id: "thread-list-accessibility-audit",
    title: "Thread list accessibility audit",
    messages: createFixtureMessages("thread-list-accessibility-audit", [
      "Audit labels, selected state, and keyboard reachability.",
      "The selected thread uses aria-current and all controls expose names.",
      "Verify the disabled create action remains unavailable.",
    ]),
  },
]

/**
 * Builds the complete 20-thread demonstration set from live chat messages.
 */
export function buildDemonstrationThreads(
  liveMessages: ChatMessage[],
  selectedThreadId: ThreadId
): Thread[] {
  return [
    {
      id: DEMO_THREAD_ID,
      title: DEMO_THREAD_TITLE,
      messages: liveMessages,
    },
    ...staticDemonstrationThreads,
  ].map((thread) => ({
    ...thread,
    isSelected: thread.id === selectedThreadId,
  }))
}
