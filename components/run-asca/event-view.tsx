import type { ComponentType } from "react"

import { DiscordIconIcon } from "@/components/icons/logos-discord-icon"
import { GithubIconIcon } from "@/components/icons/logos-github-icon"
import { MicrosoftTeamsIcon } from "@/components/icons/logos-microsoft-teams"
import { SlackIconIcon } from "@/components/icons/logos-slack-icon"
import { XIcon } from "@/components/icons/logos-x"
import type { EventApp, EventViewProps } from "@/components/run-asca/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

type EventSource = {
  name: string
  Icon: ComponentType<{
    className?: string
    "aria-hidden"?: boolean | "true" | "false"
  }>
}

const eventSources: Record<EventApp, EventSource> = {
  slack: { name: "Slack", Icon: SlackIconIcon },
  "microsoft-teams": { name: "Microsoft Teams", Icon: MicrosoftTeamsIcon },
  discord: { name: "Discord", Icon: DiscordIconIcon },
  x: { name: "X", Icon: XIcon },
  github: { name: "GitHub", Icon: GithubIconIcon },
}

const eventDateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
})

/** Renders the selected thread's local events as an accessible, bounded list. */
export function EventView({ events }: EventViewProps) {
  return (
    <Card
      aria-label="Events for current thread"
      size="sm"
      className="h-[28rem] min-h-0 shrink-0 gap-0 rounded-lg border border-border bg-background p-0 shadow-xs xl:h-auto xl:flex-1"
      role="complementary"
    >
      <CardHeader className="shrink-0 rounded-t-lg border-b border-border px-4 py-3">
        <CardTitle>
          <h2 className="text-lg font-semibold text-foreground">Events</h2>
        </CardTitle>
      </CardHeader>
      <CardContent
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
        data-testid="event-viewport"
      >
        <ItemGroup>
          {events.map((event) => {
            const source = eventSources[event.app]
            const SourceIcon = source.Icon

            return (
              <Item
                key={event.id}
                role="listitem"
                size="sm"
                variant="muted"
                className="flex-nowrap items-start overflow-hidden"
              >
                <ItemMedia
                  role="img"
                  aria-label={source.name}
                  className="mt-0.5 size-8 rounded-lg bg-background p-1.5 ring-1 ring-border"
                >
                  <SourceIcon aria-hidden="true" className="size-5" />
                </ItemMedia>
                <ItemContent className="min-w-0 gap-1.5">
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <ItemTitle className="max-w-full min-w-0 break-words whitespace-normal">
                      {event.sender}
                    </ItemTitle>
                    {event.externalThread ? (
                      <Badge
                        variant="outline"
                        className="h-auto max-w-full break-all whitespace-normal"
                      >
                        in: {event.externalThread}
                      </Badge>
                    ) : null}
                  </div>
                  <ItemDescription className="line-clamp-none break-words">
                    {event.content}
                  </ItemDescription>
                  <time
                    dateTime={event.occurredAt}
                    className="text-xs text-muted-foreground tabular-nums"
                  >
                    {eventDateFormatter.format(new Date(event.occurredAt))}
                  </time>
                </ItemContent>
              </Item>
            )
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
