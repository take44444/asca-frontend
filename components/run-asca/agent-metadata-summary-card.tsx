"use client"

import { BrainCircuitIcon } from "@/components/icons/lucide-brain-circuit"
import { FileImageIcon } from "@/components/icons/lucide-file-image"
import { FileTextIcon } from "@/components/icons/lucide-file-text"
import { PackageCheckIcon } from "@/components/icons/lucide-package-check"
import { ChartSplineIcon } from "@/components/icons/lucide-chart-spline"
import { UsersIcon } from "@/components/icons/lucide-users"
import { useSyncExternalStore, type ReactNode } from "react"

import type {
  AgentMetadataSummary,
  ArtifactCollection,
  ArtifactType,
  KnowledgeCollection,
  SocialPlayerCollection,
} from "@/components/run-asca/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const iconBySummaryId: Record<AgentMetadataSummary["id"], React.ElementType> = {
  knowledge: BrainCircuitIcon,
  social: UsersIcon,
  artifacts: PackageCheckIcon,
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

/** Props for the read-only knowledge-record list. */
export type KnowledgeSummaryContentProps = {
  items: KnowledgeCollection
}

/** Renders knowledge records in a bounded, independently scrolling list. */
export function KnowledgeSummaryContent({
  items,
}: KnowledgeSummaryContentProps) {
  return (
    <div
      data-testid="knowledge-viewport"
      className="mt-1 max-h-26 min-h-0 min-w-0 overflow-y-auto"
    >
      <ItemGroup aria-label="Agent knowledge" className="min-w-0 gap-1">
        {items.map((item) => (
          <Item
            key={item.id}
            role="listitem"
            size="xs"
            className="min-w-0 flex-nowrap rounded-sm bg-primary/10 px-2 py-1"
          >
            <ItemContent className="min-w-0">
              <ItemTitle className="w-full min-w-0 truncate text-xs">
                {item.title}
              </ItemTitle>
              <ItemDescription className="w-full min-w-0 truncate text-[11px] text-current/70">
                {item.description}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}

const GENERIC_PLAYER_INITIALS = "?"

/** Derives at most two uppercase initials from Unicode name segments. */
export function getPlayerInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/u)
    .flatMap((segment) => {
      const character = Array.from(segment).find((value) =>
        /[\p{L}\p{N}]/u.test(value)
      )
      if (!character) {
        return []
      }

      return [Array.from(character.toLocaleUpperCase())[0]]
    })

  if (initials.length === 0) {
    return GENERIC_PLAYER_INITIALS
  }

  return initials.length === 1
    ? initials[0]
    : `${initials[0]}${initials.at(-1)}`
}

/** Props for the read-only social-player list. */
export type SocialSummaryContentProps = {
  players: SocialPlayerCollection
}

/** Renders social players with deterministic initials-only avatars. */
export function SocialSummaryContent({ players }: SocialSummaryContentProps) {
  return (
    <div
      data-testid="social-viewport"
      className="mt-1 max-h-26 min-h-0 min-w-0 overflow-y-auto"
    >
      <ItemGroup aria-label="Social players" className="min-w-0 gap-1">
        {players.map((player) => {
          const initials = getPlayerInitials(player.name)
          const accessibleName = player.name || "Unnamed player"

          return (
            <Item
              key={player.id}
              role="listitem"
              size="xs"
              className="min-w-0 flex-nowrap rounded-xl bg-primary/10 px-1 py-1"
            >
              <ItemMedia>
                <Avatar
                  size="sm"
                  aria-label={`${accessibleName} avatar: ${initials}`}
                >
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemTitle className="w-full min-w-0 truncate text-xs">
                  {player.name}
                </ItemTitle>
              </ItemContent>
            </Item>
          )
        })}
      </ItemGroup>
    </div>
  )
}

type ArtifactTypePresentation = {
  Icon: React.ElementType
  accessibleName: string
}

const artifactPresentationByType: Record<
  ArtifactType,
  ArtifactTypePresentation
> = {
  document: { Icon: FileTextIcon, accessibleName: "Document artifact" },
  image: { Icon: FileImageIcon, accessibleName: "Image artifact" },
}

/** Props for the read-only artifact list. */
export type ArtifactSummaryContentProps = {
  artifacts: ArtifactCollection
}

/** Renders artifacts with an exhaustive accessible type-icon mapping. */
export function ArtifactSummaryContent({
  artifacts,
}: ArtifactSummaryContentProps) {
  return (
    <div
      data-testid="artifact-viewport"
      className="mt-1 max-h-26 min-h-0 min-w-0 overflow-y-auto"
    >
      <ItemGroup aria-label="Agent artifacts" className="min-w-0">
        {artifacts.map((artifact) => {
          const { Icon, accessibleName } =
            artifactPresentationByType[artifact.type]

          return (
            <Item
              key={artifact.id}
              role="listitem"
              variant="muted"
              size="xs"
              className="min-w-0 flex-nowrap rounded-sm bg-primary/10 px-2 py-1"
            >
              <ItemMedia variant="icon">
                <Icon
                  role="img"
                  aria-label={accessibleName}
                  className="size-4"
                />
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemTitle className="w-full min-w-0 truncate text-xs">
                  {artifact.name}
                </ItemTitle>
                <ItemDescription className="w-full min-w-0 truncate text-[11px] text-current/70">
                  {artifact.dataSize}
                </ItemDescription>
              </ItemContent>
            </Item>
          )
        })}
      </ItemGroup>
    </div>
  )
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
        "min-w-0 gap-1 rounded-lg border px-3 pt-2 pb-1 shadow-xs ring-0 [--card-spacing:--spacing(3)]",
        toneClasses[summary.tone]
      )}
    >
      <CardHeader className="flex min-w-0 items-center gap-4 rounded-t-lg px-0">
        <div className="flex items-center justify-center rounded-md bg-primary/10 p-1">
          <Icon className="size-7" aria-hidden="true" />
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
