"use client"

import { MessageSquarePlusIcon } from "@/components/icons/lucide-message-square-plus"
import type { Agent, AgentId } from "@/components/run-asca/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item"
import { cn } from "@/lib/utils"

/**
 * Props for the Run A.S.C.A. agent navigation list.
 */
export type AgentListProps = {
  agents: Agent[]
  selectedAgentId: AgentId
  onSelectAgent: (agentId: AgentId) => void
}

/**
 * Renders the demonstration agent list and unavailable agent creation action.
 */
export function AgentList({
  agents,
  selectedAgentId,
  onSelectAgent,
}: AgentListProps) {
  return (
    <aside
      className="run-asca-agent-list flex min-h-0 flex-col px-3 pt-3 sm:py-4 sm:pr-0 sm:pl-3 md:w-[22rem]"
      aria-label="Run A.S.C.A. agents"
    >
      <Card
        size="sm"
        className="min-h-0 flex-1 gap-2 rounded-lg border border-border bg-card p-2 shadow-lg ring-7"
        data-testid="agent-list-card"
      >
        <CardHeader className="flex shrink-0 flex-col rounded-t-lg border-b border-border p-2">
          <div className="flex w-full items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="xl"
              className="w-full justify-center rounded-lg bg-card"
              disabled
            >
              <MessageSquarePlusIcon className="size-4" aria-hidden="true" />
              <span>Create New Agent</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent
          className="min-h-0 flex-1 overflow-y-auto p-2"
          data-testid="agent-list-scroll"
        >
          <ItemGroup className="gap-1 has-data-[size=sm]:gap-1">
            {agents.map((agent) => (
              <Item
                render={<button type="button" />}
                variant="outline"
                size="sm"
                key={agent.id}
                className={cn(
                  "w-full flex-nowrap rounded-lg bg-background text-left",
                  agent.id === selectedAgentId
                    ? "border-primary/60 text-foreground ring-2 ring-primary/10"
                    : "text-muted-foreground"
                )}
                aria-current={agent.id === selectedAgentId ? "page" : undefined}
                onClick={() => onSelectAgent(agent.id)}
              >
                <ItemContent className="min-w-0">
                  <ItemTitle className="max-w-full truncate">
                    {agent.name}
                  </ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
    </aside>
  )
}
