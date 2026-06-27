import type {
  EventApp,
  EventsByThread,
  ThreadEvent,
  ThreadId,
} from "@/components/run-asca/types"

const eventApps: readonly EventApp[] = [
  "slack",
  "microsoft-teams",
  "discord",
  "x",
  "github",
]

const nonDemoThreadIds: readonly Exclude<ThreadId, "demo">[] = [
  "incident-response-rehearsal",
  "release-readiness-review",
  "knowledge-base-grooming",
  "customer-onboarding-draft",
  "long-running-research-synthesis",
  "quarterly-planning-notes",
  "architecture-decision-log",
  "agent-evaluation-notes",
  "support-ticket-clustering",
  "sales-discovery-summary",
  "security-review-follow-up",
  "documentation-gap-analysis",
  "experiment-results-review",
  "partner-integration-plan",
  "budget-scenario-modeling",
  "hiring-scorecard-review",
  "design-critique-capture",
  "retrospective-action-items",
  "thread-list-accessibility-audit",
]

function createDemoEvent(index: number): ThreadEvent {
  const eventNumber = index + 1
  return {
    id: `demo-event-${eventNumber}`,
    threadId: "demo",
    app: eventApps[index % eventApps.length],
    sender:
      index === 0
        ? "A deliberately long event sender name that remains contained"
        : `Demo collaborator ${eventNumber}`,
    ...(index % 2 === 0
      ? {
          externalThread:
            index === 0
              ? "#a-deliberately-long-external-thread-name-that-remains-contained"
              : "#asca-demo",
        }
      : {}),
    content:
      index === 0
        ? "A deliberately long event description verifies that imported activity wraps cleanly without overlapping its source, sender, badge, or date."
        : `Demonstration event ${eventNumber} records deterministic activity for the selected A.S.C.A. thread.`,
    occurredAt: `2026-06-${String(27 - Math.floor(index / 4)).padStart(2, "0")}T${String(9 + (index % 8)).padStart(2, "0")}:00:00.000Z`,
  }
}

function createThreadEvents(
  threadId: Exclude<ThreadId, "demo">,
  threadIndex: number
): ThreadEvent[] {
  const readableThread = threadId.replaceAll("-", " ")
  return Array.from({ length: 3 }, (_, index) => ({
    id: `${threadId}-event-${index + 1}`,
    threadId,
    app: eventApps[(threadIndex * 3 + index) % eventApps.length],
    sender: `Fixture contributor ${threadIndex + 1}.${index + 1}`,
    ...(index === 1 ? { externalThread: `#${threadId}` } : {}),
    content: `${readableThread.charAt(0).toUpperCase()}${readableThread.slice(1)} event ${index + 1} preserves activity associated with this thread.`,
    occurredAt: `2026-06-${String(26 - (threadIndex % 10)).padStart(2, "0")}T${String(10 + index).padStart(2, "0")}:00:00.000Z`,
  }))
}

const generatedThreadEvents = Object.fromEntries(
  nonDemoThreadIds.map((threadId, index) => [
    threadId,
    createThreadEvents(threadId, index),
  ])
) as Record<Exclude<ThreadId, "demo">, ThreadEvent[]>

/** Deterministic read-only event data for every demonstration thread. */
export const eventsByThread: EventsByThread = {
  demo: Array.from({ length: 20 }, (_, index) => createDemoEvent(index)),
  ...generatedThreadEvents,
}
