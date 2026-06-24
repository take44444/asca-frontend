"use client"

import { Send } from "lucide-react"
import { StickToBottom } from "use-stick-to-bottom"

import { ChatMessage } from "@/components/run-asca/chat-message"
import type { Thread } from "@/components/run-asca/types"
import { Button } from "@/components/ui/button"
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { ScrollButton } from "@/components/ui/scroll-button"

/**
 * Props for the Run A.S.C.A. conversation panel.
 */
export type ConversationPanelProps = {
  thread: Thread
  prompt: string
  isSubmitting: boolean
  errorMessage: string | null
  onPromptChange: (value: string) => void
  onSubmit: () => void
}

/**
 * Renders the active conversation, anchored prompt, loading, error, and scroll controls.
 */
export function ConversationPanel({
  thread,
  prompt,
  isSubmitting,
  errorMessage,
  onPromptChange,
  onSubmit,
}: ConversationPanelProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label="Conversation">
      <header className="shrink-0 border-b border-border px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">
          {thread.title}
        </p>
        <h1 className="text-xl font-semibold tracking-normal">Run A.S.C.A.</h1>
      </header>
      <div className="relative min-h-0 flex-1">
        <StickToBottom className="h-full" resize="smooth" initial="instant">
          {(context) => (
            <>
              <div
                ref={context.scrollRef}
                className="h-full overflow-y-auto"
                data-testid="message-viewport"
              >
                <div
                  ref={context.contentRef}
                  className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6"
                >
                  {thread.messages.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                      Start the demonstration thread with a text prompt.
                    </div>
                  ) : (
                    thread.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))
                  )}
                  {isSubmitting ? (
                    <div
                      className="text-sm font-medium text-muted-foreground"
                      role="status"
                    >
                      A.S.C.A. is thinking...
                    </div>
                  ) : null}
                </div>
              </div>
              <ScrollButton
                className="absolute right-5 bottom-5"
                aria-label="Return to latest message"
              />
            </>
          )}
        </StickToBottom>
      </div>
      <div className="shrink-0 border-t border-border bg-background p-3">
        <div className="mx-auto w-full max-w-4xl">
          {errorMessage ? (
            <p
              className="mb-2 text-sm font-medium text-destructive"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
          <PromptInput
            value={prompt}
            onValueChange={onPromptChange}
            onSubmit={onSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="rounded-lg"
          >
            <PromptInputTextarea
              aria-label="Prompt A.S.C.A."
              placeholder="Message A.S.C.A."
              maxLength={4000}
            />
            <PromptInputActions className="justify-end">
              <Button
                type="button"
                size="icon-sm"
                aria-label="Send prompt"
                disabled={isSubmitting || prompt.trim().length === 0}
                onClick={onSubmit}
              >
                <Send className="size-4" />
              </Button>
            </PromptInputActions>
          </PromptInput>
        </div>
      </div>
    </section>
  )
}
