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
      className="run-asca-thread-list flex min-h-0 flex-col border-b border-border bg-muted/30 md:w-80 md:border-r md:border-b-0"
      aria-label="Run A.S.C.A. threads"
    >
      <Card
        size="sm"
        className="min-h-0 rounded-lg bg-transparent py-0 shadow-none ring-0"
      >
        <CardHeader className="flex shrink-0 flex-col gap-3 rounded-t-lg border-b border-border p-3">
          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="outline" size="sm" disabled>
              <MessageSquarePlusIcon className="size-4" aria-hidden="true" />
              <span>Create New Thread</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent
          className="min-h-0 flex-1 overflow-y-auto p-2"
          data-testid="thread-list-scroll"
        >
          <div className="flex flex-col gap-1">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                className={cn(
                  "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors",
                  thread.id === selectedThreadId
                    ? "border-primary/30 bg-background text-foreground shadow-xs"
                    : "border-transparent text-muted-foreground hover:bg-background/70 hover:text-foreground"
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
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
