"use client"

import { BrainCircuitIcon } from "@/components/icons/lucide-brain-circuit"
import { PackageCheckIcon } from "@/components/icons/lucide-package-check"
import { ChartSplineIcon } from "@/components/icons/lucide-chart-spline"
import { ListTodoIcon } from "@/components/icons/lucide-list-todo"
import type { ReactNode } from "react"

import type { ThreadMetadataSummary } from "@/components/run-asca/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const iconBySummaryId: Record<ThreadMetadataSummary["id"], React.ElementType> = {
  tasks: ListTodoIcon,
  artifacts: PackageCheckIcon,
  knowledge: BrainCircuitIcon,
  tokens: ChartSplineIcon,
}

const toneClasses: Record<ThreadMetadataSummary["tone"], string> = {
  sky: "border-sky-200 bg-sky-50/80 text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/20 dark:text-sky-100",
  emerald:
    "border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-100",
  violet:
    "border-violet-200 bg-violet-50/80 text-violet-950 dark:border-violet-900/60 dark:bg-violet-950/20 dark:text-violet-100",
  amber:
    "border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100",
}

/**
 * Props for one Run A.S.C.A. thread metadata summary.
 */
export type ThreadMetadataSummaryCardProps = {
  summary: ThreadMetadataSummary
  children?: ReactNode
}

/**
 * Renders one compact metadata summary with category symbol, count, and details.
 */
export function ThreadMetadataSummaryCard({
  summary,
  children,
}: ThreadMetadataSummaryCardProps) {
  const Icon = iconBySummaryId[summary.id]

  return (
    <Card
      size="sm"
      aria-label={`${summary.label} summary`}
      data-testid="thread-metadata-summary"
      className={cn(
        "min-w-0 gap-2 rounded-lg border py-3 shadow-xs ring-0 [--card-spacing:--spacing(3)]",
        toneClasses[summary.tone]
      )}
    >
      <CardHeader className="min-w-0 gap-1 rounded-t-lg">
        <div className="flex min-w-0 items-center gap-6">
          <Icon className="size-8" aria-hidden="true" />
          <div className="min-w-0">
            <CardTitle className="truncate text-xs font-semibold tracking-normal">
              {summary.label}
            </CardTitle>
            <CardDescription className="text-2xl leading-none font-semibold text-current tabular-nums">
              {summary.primaryValue}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-current/75">
          {summary.supportingDetails.map((detail) => (
            <span key={detail} className="max-w-full truncate">
              {detail}
            </span>
          ))}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
