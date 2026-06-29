"use client"

import { SettingsIcon } from "@/components/icons/lucide-settings"
import type { Agent } from "@/components/run-asca/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Markdown } from "@/components/ui/markdown"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** Props for the selected Run A.S.C.A. agent card. */
export type AgentCardProps = {
  agent: Agent
}

/** Displays the selected agent's identity, role, and future configuration entry. */
export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card
      size="sm"
      role="region"
      aria-label="Agent details"
      className="h-[min(6rem,12svh)] shrink-0 gap-0 rounded-lg border border-border bg-background p-2 shadow-xs ring-0"
    >
      <CardHeader className="shrink-0 gap-0 items-center px-4 pt-1 pb-0">
        <CardTitle>
          <h2 className="truncate text-lg font-semibold text-foreground">
            {agent.name}
          </h2>
        </CardTitle>
        <CardAction className="self-start">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Configure Agent"
                  aria-disabled="true"
                >
                  <SettingsIcon className="size-4" aria-hidden="true" />
                </Button>
              }
            />
            <TooltipContent>Configure Agent</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4"
        data-testid="agent-role-viewport"
      >
        <Markdown className="prose prose-sm dark:prose-invert max-w-none">
          {agent.role}
        </Markdown>
      </CardContent>
    </Card>
  )
}
