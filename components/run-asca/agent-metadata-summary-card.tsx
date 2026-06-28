"use client"

import { BrainCircuitIcon } from "@/components/icons/lucide-brain-circuit"
import { PackageCheckIcon } from "@/components/icons/lucide-package-check"
import { ChartSplineIcon } from "@/components/icons/lucide-chart-spline"
import { ListTodoIcon } from "@/components/icons/lucide-list-todo"
import { useSyncExternalStore, type ReactNode } from "react"

import type { AgentMetadataSummary } from "@/components/run-asca/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const iconBySummaryId: Record<AgentMetadataSummary["id"], React.ElementType> = {
  tasks: ListTodoIcon,
  artifacts: PackageCheckIcon,
  knowledge: BrainCircuitIcon,
  tokens: ChartSplineIcon,
}

const toneClasses: Record<AgentMetadataSummary["tone"], string> = {
  sky: "border-sky-200 bg-sky-50/80 text-sky-950 dark:border-sky-900/90 dark:bg-sky-950/30 dark:text-sky-100",
  emerald:
    "border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900/90 dark:bg-emerald-950/30 dark:text-emerald-100",
  violet:
    "border-violet-200 bg-violet-50/80 text-violet-950 dark:border-violet-900/90 dark:bg-violet-950/30 dark:text-violet-100",
  amber:
    "border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900/90 dark:bg-amber-950/30 dark:text-amber-100",
}

function useIsSmViewport(smBreakpointQuery: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      if (!window.matchMedia) {
        return () => { }
      }

      const mediaQuery = window.matchMedia(smBreakpointQuery)
      mediaQuery.addEventListener("change", notify)

      return () => {
        mediaQuery.removeEventListener("change", notify)
      }
    },
    () => {
      if (!window.matchMedia) {
        return true
      }

      return window.matchMedia(smBreakpointQuery).matches
    },
    () => false
  )
}

/**
 * Props for one Run A.S.C.A. agent metadata summary.
 */
export type AgentMetadataSummaryCardProps = {
  summary: AgentMetadataSummary
  children?: ReactNode
}

/**
 * Renders one compact metadata summary with category symbol, count, and details.
 */
export function AgentMetadataSummaryCard({
  summary,
  children,
}: AgentMetadataSummaryCardProps) {
  const Icon = iconBySummaryId[summary.id]
  const shouldRenderContent = useIsSmViewport("(min-width: 768px)")

  return (
    <Card
      size="sm"
      aria-label={`${summary.label} summary`}
      data-testid="agent-metadata-summary"
      className={cn(
        "min-w-0 gap-1 rounded-lg border px-4 pt-3 pb-1 shadow-xs ring-0 [--card-spacing:--spacing(3)]",
        toneClasses[summary.tone]
      )}
    >
      <CardHeader className="flex min-w-0 items-center gap-4 rounded-t-lg px-0">
        <div className="flex items-center justify-center rounded-md bg-primary/10 p-1">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <CardTitle className="truncate text-xs font-semibold tracking-normal">
            {summary.label}
          </CardTitle>
          <CardDescription className="text-xl leading-none font-semibold text-current tabular-nums">
            {summary.primaryValue}
          </CardDescription>
        </div>
      </CardHeader>
      {shouldRenderContent ? (
        <CardContent className="min-w-0 px-0">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-current/75">
            {summary.supportingDetails.map((detail) => (
              <span key={detail} className="max-w-full truncate">
                {detail}
              </span>
            ))}
          </div>
          {children}
        </CardContent>
      ) : null}
    </Card>
  )
}
