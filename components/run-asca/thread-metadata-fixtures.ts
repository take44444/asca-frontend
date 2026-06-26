import type {
  ArtifactSummary,
  KnowledgeSummary,
  TaskSummary,
  ThreadMetadataSummary,
  TokenUsagePoint,
  TokenUsageSummary,
} from "@/components/run-asca/types"

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
