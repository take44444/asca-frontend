"use client"

import { Line, LineChart, XAxis, YAxis } from "recharts"

import type { TokenUsagePoint } from "@/components/run-asca/types"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

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

/**
 * Renders distinguishable input/output token usage trends for the last seven days.
 */
export function TokenUsageTrend({ points }: TokenUsageTrendProps) {
  const maxTokenValue = Math.max(
    ...points.flatMap((point) => [point.inputTokens, point.outputTokens]),
    1
  )

  return (
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
        <XAxis
          dataKey="dateLabel"
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          interval="preserveStartEnd"
          fontSize={10}
        />
        <YAxis hide domain={[0, maxTokenValue]} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
  )
}
