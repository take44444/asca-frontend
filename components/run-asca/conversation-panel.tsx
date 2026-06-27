"use client"

import { StickToBottom } from "use-stick-to-bottom"

import { ChatMessage } from "@/components/run-asca/chat-message"
import type { Thread } from "@/components/run-asca/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
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
    <Card
      size="sm"
      className="min-h-[28rem] flex-1 gap-0 rounded-lg border border-border bg-background p-0 px-2 shadow-xs"
      aria-label="Conversation"
    >
      <CardHeader className="shrink-0 rounded-t-lg border-b border-border px-4 py-[var(--card-spacing)]">
        <CardTitle className="truncate text-lg font-semibold text-foreground">
          {thread.title}
        </CardTitle>
        <CardAction className="row-span-0 row-start-0 self-center leading-none text-xs tabular-nums">
          {thread.messages.length}{" "}
          {thread.messages.length === 1 ? "message" : "messages"}
        </CardAction>
      </CardHeader>
      <CardContent className="relative min-h-0 flex-1 p-0">
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
      </CardContent>
      <CardFooter className="mx-auto w-full max-w-4xl shrink-0 flex-col items-start pt-2 pb-4">
        {errorMessage ? (
          <p className="mb-2 text-sm font-medium text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <GradientText
          neon
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="mb-2 min-h-[1.3rem] text-sm font-bold"
          role="status"
          text={isSubmitting ? "A.S.C.A. is thinking..." : ""}
        />
        <form
          className="w-full"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 opacity-30 blur transition duration-400 group-hover:opacity-50 group-hover:duration-400"></div>
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
        </form>
      </CardFooter>
    </Card>
  )
}
