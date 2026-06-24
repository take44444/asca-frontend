"use client"

import { AlertCircle, Check, Copy } from "lucide-react"
import { useEffect, useState } from "react"

import type { ChatMessage as ChatMessageModel } from "@/components/run-asca/types"
import { Button } from "@/components/ui/button"
import {
  Message,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"
import { cn } from "@/lib/utils"

type CopyState = "idle" | "copied" | "failed"

/**
 * Props for rendering a Run A.S.C.A. chat message.
 */
export type ChatMessageProps = {
  message: ChatMessageModel
}

/**
 * Renders a user or A.S.C.A. message with markdown display and clipboard copy.
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const [copyState, setCopyState] = useState<CopyState>(message.copyState)
  const sender = message.role === "assistant" ? "A.S.C.A." : "You"
  const fallback = message.role === "assistant" ? "AS" : "YO"

  useEffect(() => {
    if (copyState === "idle") {
      return
    }

    const timeoutId = window.setTimeout(() => setCopyState("idle"), 1800)
    return () => window.clearTimeout(timeoutId)
  }, [copyState])

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
  }

  return (
    <Message
      className={cn(
        "group/message w-full items-start",
        message.role === "user" && "flex-row-reverse"
      )}
      data-testid={`message-${message.role}`}
    >
      <MessageAvatar
        src=""
        alt={`${sender} avatar`}
        fallback={fallback}
        className={message.role === "assistant" ? "bg-primary/10" : ""}
      />
      <div
        className={cn(
          "flex max-w-[min(48rem,82%)] min-w-0 flex-col gap-1",
          message.role === "user" && "items-end"
        )}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span>{sender}</span>
          {message.status === "error" ? (
            <span className="inline-flex items-center gap-1 text-destructive">
              <AlertCircle className="size-3" />
              Failed
            </span>
          ) : null}
        </div>
        <MessageContent
          markdown={message.role === "assistant"}
          className={cn(
            "max-w-full rounded-lg px-3 py-2 leading-6 break-words whitespace-pre-wrap",
            message.role === "user"
              ? "prose-invert bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {message.content}
        </MessageContent>
        <MessageActions
          className={cn(
            "min-h-7 gap-2 text-xs",
            message.role === "user" && "justify-end"
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Copy ${sender} message`}
            onClick={handleCopy}
          >
            {copyState === "copied" ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>
          <span aria-live="polite">
            {copyState === "copied"
              ? "Copied"
              : copyState === "failed"
                ? "Copy failed"
                : ""}
          </span>
        </MessageActions>
      </div>
    </Message>
  )
}
