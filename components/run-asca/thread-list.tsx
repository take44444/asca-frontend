"use client"

import { MessageSquarePlusIcon } from "@/components/icons/lucide-message-square-plus"
import type { Thread, ThreadId } from "@/components/run-asca/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Props for the Run A.S.C.A. thread navigation list.
 */
export type ThreadListProps = {
  threads: Thread[]
  selectedThreadId: ThreadId
  onSelectThread: (threadId: ThreadId) => void
}

/**
 * Renders the demonstration thread list and unavailable thread creation action.
 */
export function ThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
}: ThreadListProps) {
  return (
    <aside
      className="run-asca-thread-list flex min-h-0 flex-col bg-background pt-3 px-3 sm:py-4 sm:pl-3 sm:pr-0 md:w-[22rem]"
      aria-label="Run A.S.C.A. threads"
    >
      <Card
        size="sm"
        className="min-h-0 flex-1 rounded-lg border border-border bg-card p-2 shadow-lg gap-2 ring-7"
        data-testid="thread-list-card"
      >
        <CardHeader className="flex shrink-0 flex-col rounded-t-lg p-2 border-b border-border">
          <div className="w-full flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="xl"
              className="w-full justify-center rounded-lg bg-card"
              disabled
            >
              <MessageSquarePlusIcon className="size-4" aria-hidden="true" />
              <span>Create New Thread</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent
          className="min-h-0 flex-1 overflow-y-auto bg-muted/15 p-2"
          data-testid="thread-list-scroll"
        >
          <div className="flex flex-col gap-2">
            {threads.map((thread) => (
              <Button
                type="button"
                variant="outline"
                size="xl"
                key={thread.id}
                className={cn(
                  "grid w-full grid-cols-[minmax(0,1fr)_auto] text-left rounded-lg",
                  thread.id === selectedThreadId
                    ? "border-primary/60 text-foreground ring-2 ring-primary/10"
                    : "text-muted-foreground"
                )}
                aria-current={
                  thread.id === selectedThreadId ? "page" : undefined
                }
                onClick={() => onSelectThread(thread.id)}
              >
                <span className="min-w-0 truncate text-sm font-medium">
                  {thread.title}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {thread.messages.length}{" "}
                  {thread.messages.length === 1 ? "message" : "messages"}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
