"use client"

import { MessageSquarePlus } from "lucide-react"

import type { Thread, ThreadId } from "@/components/run-asca/types"
import { Button } from "@/components/ui/button"
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
      className="run-asca-thread-list flex min-h-0 flex-col border-b border-border bg-muted/30 md:w-72 md:border-r md:border-b-0"
      aria-label="Run A.S.C.A. threads"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border p-3">
        <h2 className="text-sm font-semibold">Threads</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          aria-label="Create New Thread unavailable"
        >
          <MessageSquarePlus className="size-4" />
          Create New Thread
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {threads.map((thread) => (
          <button
            key={thread.id}
            type="button"
            className={cn(
              "w-full rounded-lg border px-3 py-3 text-left transition-colors",
              thread.id === selectedThreadId
                ? "border-primary/20 bg-background text-foreground shadow-xs"
                : "border-transparent text-muted-foreground hover:bg-background/70 hover:text-foreground"
            )}
            aria-current={thread.id === selectedThreadId ? "page" : undefined}
            onClick={() => onSelectThread(thread.id)}
          >
            <span className="block text-sm font-medium">{thread.title}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {thread.messages.length} messages
            </span>
          </button>
        ))}
      </div>
    </aside>
  )
}
