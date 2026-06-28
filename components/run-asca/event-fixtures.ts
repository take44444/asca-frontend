import type {
  AgentEvent,
  AgentId,
  EventApp,
  EventsByAgent,
} from "@/components/run-asca/types"

const eventApps: readonly EventApp[] = [
  "slack",
  "microsoft-teams",
  "discord",
  "x",
  "github",
]

const nonDemoAgentIds: readonly Exclude<AgentId, "demo">[] = [
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
  "agent-list-accessibility-audit",
]

function createDemoEvent(index: number): AgentEvent {
  const eventNumber = index + 1
  return {
    id: `demo-event-${eventNumber}`,
    agentId: "demo",
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
        : `Demonstration event ${eventNumber} records deterministic activity for the selected A.S.C.A. agent.`,
    occurredAt: `2026-06-${String(27 - Math.floor(index / 4)).padStart(2, "0")}T${String(9 + (index % 8)).padStart(2, "0")}:00:00.000Z`,
  }
}

function createAgentEvents(
  agentId: Exclude<AgentId, "demo">,
  agentIndex: number
): AgentEvent[] {
  const readableAgent = agentId.replaceAll("-", " ")
  return Array.from({ length: 3 }, (_, index) => ({
    id: `${agentId}-event-${index + 1}`,
    agentId,
    app: eventApps[(agentIndex * 3 + index) % eventApps.length],
    sender: `Fixture contributor ${agentIndex + 1}.${index + 1}`,
    ...(index === 1 ? { externalThread: `#${agentId}` } : {}),
    content: `${readableAgent.charAt(0).toUpperCase()}${readableAgent.slice(1)} event ${index + 1} preserves activity associated with this agent.`,
    occurredAt: `2026-06-${String(26 - (agentIndex % 10)).padStart(2, "0")}T${String(10 + index).padStart(2, "0")}:00:00.000Z`,
  }))
}

const generatedAgentEvents = Object.fromEntries(
  nonDemoAgentIds.map((agentId, index) => [
    agentId,
    createAgentEvents(agentId, index),
  ])
) as Record<Exclude<AgentId, "demo">, AgentEvent[]>

/** Deterministic read-only event data for every demonstration agent. */
export const eventsByAgent: EventsByAgent = {
  demo: Array.from({ length: 20 }, (_, index) => createDemoEvent(index)),
  ...generatedAgentEvents,
}
