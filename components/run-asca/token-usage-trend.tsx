"use client"

import { useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import type { TokenUsagePoint } from "@/components/run-asca/types"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartConfig = {
  inputTokens: {
    label: "Input tokens",
    color: "var(--chart-2)",
  },
  outputTokens: {
    label: "Output tokens",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

/**
 * Props for the seven-day token usage trend.
 */
export type TokenUsageTrendProps = {
  points: TokenUsagePoint[]
}

function formatPointLabel(point: TokenUsagePoint): string {
  return `${point.dateLabel} token usage: ${point.inputTokens.toLocaleString()} input tokens, ${point.outputTokens.toLocaleString()} output tokens`
}

function TokenTrendTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload?: TokenUsagePoint }>
}) {
  const hoveredPoint = payload?.[0]?.payload as TokenUsagePoint | undefined
  const point = active ? hoveredPoint : null

  if (!point) {
    return null
  }

  return (
    <div className="grid min-w-32 gap-1 rounded-lg bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/5">
      <div className="font-medium">{point.dateLabel}</div>
      <div>Input tokens: {point.inputTokens.toLocaleString()}</div>
      <div>Output tokens: {point.outputTokens.toLocaleString()}</div>
    </div>
  )
}

/**
 * Renders distinguishable input/output token usage trends for the last seven days.
 */
export function TokenUsageTrend({ points }: TokenUsageTrendProps) {
  const [activePoint, setActivePoint] = useState<TokenUsagePoint | null>(null)
  const maxTokenValue = Math.max(
    ...points.flatMap((point) => [point.inputTokens, point.outputTokens]),
    1
  )

  return (
    <div className="mt-3 grid gap-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--chart-2)]" />
          Input tokens
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--chart-1)]" />
          Output tokens
        </span>
      </div>
      <div className="relative">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-24 w-full"
          initialDimension={{ width: 280, height: 96 }}
        >
          <LineChart
            data={points}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="dateLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              interval="preserveStartEnd"
              fontSize={10}
            />
            <YAxis hide domain={[0, maxTokenValue]} />
            <ChartTooltip cursor={false} content={<TokenTrendTooltip />} />
            <Line
              type="monotone"
              dataKey="inputTokens"
              stroke="var(--color-inputTokens)"
              strokeWidth={2}
              dot={{ r: 2.5 }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="outputTokens"
              stroke="var(--color-outputTokens)"
              strokeWidth={2}
              dot={{ r: 2.5 }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
        <div className="absolute inset-x-0 top-0 grid h-16 grid-cols-7">
          {points.map((point) => (
            <button
              key={point.dateLabel}
              type="button"
              className={cn(
                "h-full min-w-0 rounded-sm opacity-0 outline-none focus:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-1"
              )}
              aria-label={formatPointLabel(point)}
              onFocus={() => setActivePoint(point)}
              onBlur={() => setActivePoint(null)}
              onMouseEnter={() => setActivePoint(point)}
              onMouseLeave={() => setActivePoint(null)}
            />
          ))}
        </div>
      </div>
      {activePoint ? (
        <div
          role="tooltip"
          className="grid w-fit gap-1 rounded-lg bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/5"
        >
          <div className="font-medium">{activePoint.dateLabel}</div>
          <div>Input tokens: {activePoint.inputTokens.toLocaleString()}</div>
          <div>Output tokens: {activePoint.outputTokens.toLocaleString()}</div>
        </div>
      ) : null}
    </div>
  )
}
