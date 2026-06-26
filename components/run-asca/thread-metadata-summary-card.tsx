"use client"

import { Boxes, Brain, CheckSquare, Sigma, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import type { ThreadMetadataSummary } from "@/components/run-asca/types"
import { cn } from "@/lib/utils"

const iconBySummaryId: Record<ThreadMetadataSummary["id"], LucideIcon> = {
  tasks: CheckSquare,
  artifacts: Boxes,
  knowledge: Brain,
  tokens: Sigma,
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
    <article
      aria-label={`${summary.label} summary`}
      data-testid="thread-metadata-summary"
      className={cn(
        "min-w-0 rounded-lg border p-3 shadow-xs",
        "grid content-start gap-2 overflow-hidden",
        toneClasses[summary.tone]
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background/80 text-sm font-semibold shadow-xs"
          >
            {summary.label.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-xs font-semibold tracking-normal">
              {summary.label}
            </h2>
            <p className="text-2xl leading-none font-semibold tabular-nums">
              {summary.primaryValue}
            </p>
          </div>
        </div>
        <Icon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-current/75">
        {summary.supportingDetails.map((detail) => (
          <span key={detail} className="max-w-full truncate">
            {detail}
          </span>
        ))}
      </div>
      {children}
    </article>
  )
}
