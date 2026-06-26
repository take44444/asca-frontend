"use client"

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
import { GradientText } from "@/components/animate-ui/primitives/texts/gradient"
import { SendIcon } from "@/components/icons/lucide-send"

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
    <section
      className="flex min-h-[28rem] flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background shadow-xs"
      aria-label="Conversation"
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 bg-muted/50 px-4 py-3">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-foreground">
            {thread.title}
          </h1>
          <p className="text-xs font-medium text-muted-foreground">
            {thread.messages.length} messages
          </p>
        </div>
      </header>
      <div className="relative min-h-0 flex-1 bg-background">
        <StickToBottom className="h-full" resize="smooth" initial="instant">
          {(context) => (
            <>
              <div
                ref={context.scrollRef}
                className="h-full overflow-y-auto overscroll-contain"
                data-testid="message-viewport"
              >
                <div
                  ref={context.contentRef}
                  className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 sm:px-6"
                >
                  {thread.messages.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
                      Start the demonstration thread with a text prompt.
                    </div>
                  ) : (
                    thread.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))
                  )}
                </div>
              </div>
              <ScrollButton
                className="absolute right-5 bottom-5 shadow-md"
                aria-label="Return to latest message"
              />
            </>
          )}
        </StickToBottom>
      </div>
      <form
        className="shrink-0 bg-background p-3 sm:p-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <div className="mx-auto w-full max-w-4xl">
          {errorMessage ? (
            <p
              className="mb-2 text-sm font-medium text-destructive"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
          <GradientText
            neon
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="mb-2 text-sm font-bold"
            role="status"
            text={isSubmitting ? "A.S.C.A. is thinking..." : ""}
          />
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-400 group-hover:duration-400"></div>
            <PromptInput
              value={prompt}
              onValueChange={onPromptChange}
              onSubmit={onSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="relative rounded-lg"
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
                  <SendIcon />
                </Button>
              </PromptInputActions>
            </PromptInput>
          </div>
        </div>
      </form>
    </section>
  )
}
