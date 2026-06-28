import type {
  ArtifactSummary,
  Agent,
  AgentId,
  AgentMetadataSummary,
  ChatMessage,
  KnowledgeSummary,
  StaticDemonstrationAgent,
  TaskSummary,
  TokenUsagePoint,
  TokenUsageSummary,
} from "@/components/run-asca/types"

/**
 * Stable id for the live demonstration agent backed by the chat transport.
 */
export const DEMO_AGENT_ID: AgentId = "demo"

/**
 * User-visible name for the live demonstration agent.
 */
export const DEMO_AGENT_NAME = "Demonstration Agent"

/** Markdown role for the live demonstration agent. */
export const DEMO_AGENT_ROLE =
  "## General-purpose assistant\n\nCoordinates research, planning, and execution for the active demonstration."

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
 * Static task summary used by the demonstration Run A.S.C.A. agent.
 */
export const demoTaskSummary: TaskSummary = {
  completedCount: 8,
  pendingCount: 3,
}

/**
 * Static artifact summary used by the demonstration Run A.S.C.A. agent.
 */
export const demoArtifactSummary: ArtifactSummary = {
  researchCount: 4,
  documentCount: 2,
  imageCount: 1,
}

/**
 * Static knowledge summary used by the demonstration Run A.S.C.A. agent.
 */
export const demoKnowledgeSummary: KnowledgeSummary = {
  itemCount: 14,
}

/**
 * Static seven-day token usage summary used by the demonstration Run A.S.C.A. agent.
 */
export const demoTokenUsageSummary: TokenUsageSummary = {
  totalInputTokens,
  totalOutputTokens,
  points: tokenUsagePoints,
}

/**
 * Static metadata summaries rendered above the demonstration conversation.
 */
export const demoAgentMetadataSummaries: AgentMetadataSummary[] = [
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
    primaryValue: `${
      demoArtifactSummary.researchCount +
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
  agentId: AgentId,
  index: number,
  role: ChatMessage["role"],
  content: string
): ChatMessage {
  return {
    id: `${agentId}-message-${index}`,
    role,
    content,
    createdAt: `2026-06-24T${String(index).padStart(2, "0")}:00:00.000Z`,
    status: "complete",
    copyState: "idle",
  }
}

function createFixtureMessages(
  agentId: AgentId,
  contents: string[]
): ChatMessage[] {
  return contents.map((content, index) =>
    createFixtureMessage(
      agentId,
      index,
      index % 2 === 0 ? "user" : "assistant",
      content
    )
  )
}

const longRunningResearchMessages = Array.from(
  { length: 12 },
  (_, index) =>
    `Research note ${index + 1}: ${
      index === 11
        ? "final recommendation and tradeoffs."
        : "capture evidence, risks, and source confidence."
    }`
)

/**
 * Static non-live demonstration agents shown in the Run A.S.C.A. agent list.
 */
const staticAgentFixtures = [
  {
    id: "incident-response-rehearsal",
    name: "Incident response rehearsal",
    messages: createFixtureMessages("incident-response-rehearsal", [
      "Confirm the escalation path and summarize owners.",
      "Escalation owners are grouped by severity and service boundary.",
      "Draft a tabletop agenda for the on-call leads.",
    ]),
  },
  {
    id: "release-readiness-review",
    name: "Release readiness review",
    messages: createFixtureMessages("release-readiness-review", [
      "List blockers by severity before the release window.",
      "Two high-severity blockers need owner confirmation before Thursday.",
      "Prepare a rollback checklist for the coordinator.",
      "Rollback checklist drafted with validation and comms checkpoints.",
    ]),
  },
  {
    id: "knowledge-base-grooming",
    name: "Knowledge base grooming",
    messages: createFixtureMessages("knowledge-base-grooming", [
      "Group stale articles by owner and last reviewed date.",
      "Articles are grouped into platform, support, and onboarding queues.",
    ]),
  },
  {
    id: "customer-onboarding-draft",
    name: "Customer onboarding draft",
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
    name: "Long-running research synthesis",
    messages: createFixtureMessages(
      "long-running-research-synthesis",
      longRunningResearchMessages
    ),
  },
  {
    id: "quarterly-planning-notes",
    name: "Quarterly planning notes with a deliberately long title that stays contained",
    messages: [],
  },
  {
    id: "architecture-decision-log",
    name: "Architecture decision log",
    messages: createFixtureMessages("architecture-decision-log", [
      "Summarize the tradeoffs for the queueing decision.",
      "The decision favors managed queues to reduce operational load.",
      "Record the migration risk separately.",
    ]),
  },
  {
    id: "agent-evaluation-notes",
    name: "Agent evaluation notes",
    messages: createFixtureMessages("agent-evaluation-notes", [
      "Compare answer accuracy across the latest evaluation batch.",
      "Accuracy improved, but citation coverage still needs attention.",
    ]),
  },
  {
    id: "support-ticket-clustering",
    name: "Support ticket clustering",
    messages: createFixtureMessages("support-ticket-clustering", [
      "Cluster this week's support tickets by root cause.",
      "The top clusters are permissions, billing state, and import retries.",
      "Create a short summary for support leads.",
    ]),
  },
  {
    id: "sales-discovery-summary",
    name: "Sales discovery summary",
    messages: createFixtureMessages("sales-discovery-summary", [
      "Extract pain points from the discovery transcript.",
      "The strongest themes are response time, auditability, and rollout risk.",
    ]),
  },
  {
    id: "security-review-follow-up",
    name: "Security review follow-up",
    messages: createFixtureMessages("security-review-follow-up", [
      "Turn review comments into actionable remediation items.",
      "Remediation items are sorted by control area and target date.",
      "Highlight anything requiring policy review.",
      "Policy review is required for data retention language.",
    ]),
  },
  {
    id: "documentation-gap-analysis",
    name: "Documentation gap analysis",
    messages: createFixtureMessages("documentation-gap-analysis", [
      "Find gaps between the implementation notes and public docs.",
      "Public docs are missing retry behavior and permission examples.",
    ]),
  },
  {
    id: "experiment-results-review",
    name: "Experiment results review",
    messages: createFixtureMessages("experiment-results-review", [
      "Summarize the experiment outcome and confidence level.",
      "The variant improved completion but sample size remains limited.",
      "Call out follow-up experiments.",
    ]),
  },
  {
    id: "partner-integration-plan",
    name: "Partner integration plan",
    messages: createFixtureMessages("partner-integration-plan", [
      "Draft integration milestones from the partner notes.",
      "Milestones cover sandbox access, mapping, pilot, and launch readiness.",
    ]),
  },
  {
    id: "budget-scenario-modeling",
    name: "Budget scenario modeling",
    messages: createFixtureMessages("budget-scenario-modeling", [
      "Create a conservative and expected budget scenario.",
      "Expected spend stays within target when support volume is flat.",
      "Conservative scenario needs a hiring freeze assumption.",
    ]),
  },
  {
    id: "hiring-scorecard-review",
    name: "Hiring scorecard review",
    messages: createFixtureMessages("hiring-scorecard-review", [
      "Normalize interviewer notes into scorecard themes.",
      "Themes are technical depth, collaboration, product judgment, and risk.",
    ]),
  },
  {
    id: "design-critique-capture",
    name: "Design critique capture",
    messages: createFixtureMessages("design-critique-capture", [
      "Capture critique notes for the settings redesign.",
      "The primary concern is hierarchy between defaults and overrides.",
      "Add a decision log entry.",
    ]),
  },
  {
    id: "retrospective-action-items",
    name: "Retrospective action items",
    messages: createFixtureMessages("retrospective-action-items", [
      "Convert retrospective notes into owned action items.",
      "Five actions have clear owners and two need follow-up assignments.",
    ]),
  },
  {
    id: "agent-list-accessibility-audit",
    name: "Agent list accessibility audit",
    messages: createFixtureMessages("agent-list-accessibility-audit", [
      "Audit labels, selected state, and keyboard reachability.",
      "The selected agent uses aria-current and all controls expose names.",
      "Verify the disabled create action remains unavailable.",
    ]),
  },
] satisfies Omit<StaticDemonstrationAgent, "role">[]

function createAgentRole(name: string, isLong: boolean): string {
  const introduction = `## ${name}\n\nThis agent organizes relevant context, produces actionable summaries, and tracks follow-up work.`

  if (!isLong) {
    return introduction
  }

  const responsibilities = Array.from(
    { length: 12 },
    (_, index) => `- Research responsibility ${index + 1}`
  ).join("\n")
  return `${introduction}\n\n### Responsibilities\n\n${responsibilities}`
}

/** Static non-live demonstration agents with deterministic Markdown roles. */
export const staticDemonstrationAgents: StaticDemonstrationAgent[] =
  staticAgentFixtures.map((agent) => ({
    ...agent,
    role: createAgentRole(
      agent.name,
      agent.id === "long-running-research-synthesis"
    ),
  }))

/**
 * Builds the complete 20-agent demonstration set from live chat messages.
 */
export function buildDemonstrationAgents(
  liveMessages: ChatMessage[],
  selectedAgentId: AgentId
): Agent[] {
  return [
    {
      id: DEMO_AGENT_ID,
      name: DEMO_AGENT_NAME,
      role: DEMO_AGENT_ROLE,
      messages: liveMessages,
    },
    ...staticDemonstrationAgents,
  ].map((agent) => ({
    ...agent,
    isSelected: agent.id === selectedAgentId,
  }))
}
