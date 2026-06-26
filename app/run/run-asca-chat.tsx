"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { ConversationPanel } from "@/components/run-asca/conversation-panel"
import {
  buildDemonstrationThreads,
  DEMO_THREAD_ID,
  demoThreadMetadataSummaries,
  demoTokenUsageSummary,
} from "@/components/run-asca/thread-metadata-fixtures"
import { ThreadMetadataSummaryCard } from "@/components/run-asca/thread-metadata-summary-card"
import { ThreadList } from "@/components/run-asca/thread-list"
import { TokenUsageTrend } from "@/components/run-asca/token-usage-trend"
import type {
  AscaChatErrorPayload,
  ChatMessage,
  Thread,
  ThreadId,
} from "@/components/run-asca/types"
import { Button } from "@/components/ui/button"

const ROUTE_FAILURE_MESSAGE = "A.S.C.A. could not return a response. Try again."
const STREAM_FAILURE_MESSAGE =
  "A.S.C.A. could not complete the response. Try again."

function createAssistantGreeting(): ChatMessage {
  return {
    id: "assistant-welcome",
    role: "assistant",
    content: "Ready for a focused A.S.C.A. demonstration thread.",
    createdAt: "2026-06-25T00:00:00.000Z",
    status: "complete",
    copyState: "idle",
  }
}

const DEFAULT_INITIAL_MESSAGES = [createAssistantGreeting()]

function createLongConversationMessages(): ChatMessage[] {
  return Array.from({ length: 18 }, (_, index) => {
    const role = index % 2 === 0 ? "user" : "assistant"
    return {
      id: `seed-${index}`,
      role,
      content:
        role === "user"
          ? `Long conversation prompt ${index + 1}: explain the current workspace state with enough detail to wrap across multiple lines.`
          : `A.S.C.A. response ${index + 1}: **Summary** with markdown formatting and enough text to exercise independent scrolling in the conversation panel.`,
      createdAt: `2026-06-25T00:${String(index).padStart(2, "0")}:00.000Z`,
      status: "complete",
      copyState: "idle",
    }
  })
}

async function readRouteError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as AscaChatErrorPayload
    return payload.error.message
  } catch {
    return ROUTE_FAILURE_MESSAGE
  }
}

function chatMessageToUIMessage(message: ChatMessage): UIMessage {
  return {
    id: message.id,
    role: message.role,
    parts: [{ type: "text", text: message.content }],
  }
}

function getUIMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
}

function uiMessageToChatMessage(
  message: UIMessage,
  index: number,
  isActiveAssistant: boolean,
  isIncompleteAssistant: boolean
): ChatMessage | null {
  if (message.role !== "user" && message.role !== "assistant") {
    return null
  }

  const content = getUIMessageText(message)
  if (!content && message.role === "assistant") {
    return null
  }

  return {
    id: message.id,
    role: message.role,
    content,
    createdAt: `2026-06-25T00:${String(index).padStart(2, "0")}:00.000Z`,
    status: isIncompleteAssistant
      ? "error"
      : isActiveAssistant
        ? "streaming"
        : "complete",
    copyState: "idle",
  }
}

function toDisplayMessages(
  uiMessages: UIMessage[],
  status: ReturnType<typeof useChat>["status"]
): ChatMessage[] {
  const lastMessage = uiMessages.at(-1)
  const isStreaming = status === "submitted" || status === "streaming"
  const isError = status === "error"

  return uiMessages.flatMap((message, index) => {
    const isLastAssistant =
      lastMessage?.id === message.id && message.role === "assistant"
    const chatMessage = uiMessageToChatMessage(
      message,
      index,
      isStreaming && isLastAssistant && Boolean(getUIMessageText(message)),
      isError && isLastAssistant && Boolean(getUIMessageText(message))
    )

    return chatMessage ? [chatMessage] : []
  })
}

function hasPartialAssistantError(
  uiMessages: UIMessage[],
  status: ReturnType<typeof useChat>["status"]
): boolean {
  const lastMessage = uiMessages.at(-1)
  return (
    status === "error" &&
    lastMessage?.role === "assistant" &&
    getUIMessageText(lastMessage).trim().length > 0
  )
}

/**
 * Props for the interactive Run A.S.C.A. chat workspace.
 */
export type RunAscaChatProps = {
  initialMessages?: ChatMessage[]
}

/**
 * Owns the local demonstration thread state and route calls for /run.
 */
export function RunAscaChat({
  initialMessages = DEFAULT_INITIAL_MESSAGES,
}: RunAscaChatProps) {
  const router = useRouter()
  const [selectedThreadId, setSelectedThreadId] =
    useState<ThreadId>(DEMO_THREAD_ID)
  const [prompt, setPrompt] = useState("")
  const [inputErrorMessage, setInputErrorMessage] = useState<string | null>(
    null
  )
  const initialUiMessages = useMemo(
    () => initialMessages.map(chatMessageToUIMessage),
    [initialMessages]
  )
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/asca/chat",
        fetch: async (input, init) => {
          let response: Response

          try {
            response = await fetch(input, init)
          } catch {
            throw new Error(ROUTE_FAILURE_MESSAGE)
          }

          if (response.status === 401) {
            router.push("/login")
            throw new Error("Sign in to run A.S.C.A.")
          }

          if (!response.ok) {
            throw new Error(await readRouteError(response))
          }

          return response
        },
      }),
    [router]
  )
  const {
    messages: uiMessages,
    sendMessage,
    setMessages,
    status,
    error: chatError,
    clearError,
  } = useChat({
    messages: initialUiMessages,
    transport,
  })
  const isSubmitting = status === "submitted" || status === "streaming"
  const messages = useMemo(
    () => toDisplayMessages(uiMessages, status),
    [status, uiMessages]
  )

  const threads: Thread[] = useMemo(
    () => buildDemonstrationThreads(messages, selectedThreadId),
    [messages, selectedThreadId]
  )
  const selectedThread =
    threads.find((thread) => thread.id === selectedThreadId) ?? threads[0]
  const chatErrorMessage = useMemo(() => {
    if (status === "submitted" || status === "streaming") {
      return null
    }

    if (status !== "error" || !chatError) {
      return null
    }

    return hasPartialAssistantError(uiMessages, status)
      ? STREAM_FAILURE_MESSAGE
      : chatError.message || ROUTE_FAILURE_MESSAGE
  }, [chatError, status, uiMessages])
  const errorMessage = inputErrorMessage ?? chatErrorMessage

  async function handleSubmit(): Promise<void> {
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt) {
      setInputErrorMessage("Enter a prompt before sending.")
      return
    }

    if (isSubmitting) {
      return
    }

    setPrompt("")
    setInputErrorMessage(null)
    clearError()

    void sendMessage(
      { text: trimmedPrompt },
      { body: { threadId: selectedThreadId } }
    ).catch(() => {
      // useChat exposes the failure through status/error; chatErrorMessage maps it.
    })
  }

  return (
    <div className="run-asca-workspace relative bg-background">
      <ThreadList
        threads={threads}
        selectedThreadId={selectedThreadId}
        onSelectThread={setSelectedThreadId}
      />
      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3 sm:p-4">
        <h1 className="sr-only">Run A.S.C.A.</h1>
        <section
          aria-label="Thread metadata"
          className="grid shrink-0 grid-cols-4 gap-2"
        >
          {demoThreadMetadataSummaries.map((summary) => (
            <ThreadMetadataSummaryCard key={summary.id} summary={summary}>
              {summary.id === "tokens" ? (
                <TokenUsageTrend points={demoTokenUsageSummary.points} />
              ) : null}
            </ThreadMetadataSummaryCard>
          ))}
        </section>
        <ConversationPanel
          thread={selectedThread}
          prompt={prompt}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onPromptChange={(value) => {
            setPrompt(value)
            if (inputErrorMessage) {
              setInputErrorMessage(null)
            }
          }}
          onSubmit={handleSubmit}
        />
      </main>
      {process.env.NODE_ENV !== "production" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute right-3 bottom-3 z-10"
          onClick={() =>
            setMessages(
              createLongConversationMessages().map(chatMessageToUIMessage)
            )
          }
        >
          Seed long conversation
        </Button>
      ) : null}
    </div>
  )
}
