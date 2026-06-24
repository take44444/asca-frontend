"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { ConversationPanel } from "@/components/run-asca/conversation-panel"
import { ThreadList } from "@/components/run-asca/thread-list"
import type {
  AscaChatErrorPayload,
  AscaChatResponse,
  ChatMessage,
  Thread,
  ThreadId,
} from "@/components/run-asca/types"
import { Button } from "@/components/ui/button"

const DEMO_THREAD_ID: ThreadId = "demo"
const DEMO_THREAD_TITLE = "Demonstration Thread"

function createMessageId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

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
    return "A.S.C.A. could not return a response. Try again."
  }
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
  initialMessages = [createAssistantGreeting()],
}: RunAscaChatProps) {
  const router = useRouter()
  const [selectedThreadId, setSelectedThreadId] =
    useState<ThreadId>(DEMO_THREAD_ID)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [prompt, setPrompt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const threads: Thread[] = useMemo(
    () => [
      {
        id: DEMO_THREAD_ID,
        title: DEMO_THREAD_TITLE,
        isSelected: selectedThreadId === DEMO_THREAD_ID,
        messages,
      },
    ],
    [messages, selectedThreadId]
  )
  const selectedThread = threads[0]

  async function handleSubmit(): Promise<void> {
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt) {
      setErrorMessage("Enter a prompt before sending.")
      return
    }

    if (isSubmitting) {
      return
    }

    const userMessage: ChatMessage = {
      id: createMessageId("user"),
      role: "user",
      content: trimmedPrompt,
      createdAt: new Date().toISOString(),
      status: "complete",
      copyState: "idle",
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setPrompt("")
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/asca/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId: selectedThreadId,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (!response.ok) {
        setErrorMessage(await readRouteError(response))
        return
      }

      const payload = (await response.json()) as AscaChatResponse
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content: payload.message.content,
          createdAt: new Date().toISOString(),
          status: "complete",
          copyState: "idle",
        },
      ])
    } catch {
      setErrorMessage("A.S.C.A. could not return a response. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="run-asca-workspace relative bg-background">
      <ThreadList
        threads={threads}
        selectedThreadId={selectedThreadId}
        onSelectThread={setSelectedThreadId}
      />
      <ConversationPanel
        thread={selectedThread}
        prompt={prompt}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onPromptChange={(value) => {
          setPrompt(value)
          if (errorMessage) {
            setErrorMessage(null)
          }
        }}
        onSubmit={handleSubmit}
      />
      {process.env.NODE_ENV !== "production" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute top-3 right-3"
          onClick={() => setMessages(createLongConversationMessages())}
        >
          Seed long conversation
        </Button>
      ) : null}
    </div>
  )
}
