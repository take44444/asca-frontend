import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessageStreamWriter,
} from "ai"
import { render, screen } from "@testing-library/react"
import { createElement } from "react"

import { RunAscaChat } from "@/app/run/run-asca-chat"
import type { ChatMessage } from "@/components/run-asca/types"

/**
 * Builds a successful mocked A.S.C.A. UI message stream response.
 */
export function createMockAscaUIStreamResponse(
  content = "A.S.C.A. test response."
): Response {
  const stream = createUIMessageStream({
    execute({ writer }) {
      writer.write({ type: "text-start", id: "text-1" })
      writer.write({ type: "text-delta", id: "text-1", delta: content })
      writer.write({ type: "text-end", id: "text-1" })
      writer.write({ type: "finish" })
    },
  })

  return createUIMessageStreamResponse({ stream })
}

/**
 * Creates a controlled UI message stream for progressive client tests.
 */
export function createControlledUIMessageStream(): {
  response: Response
  enqueue: (chunk: string) => void
  close: () => void
  error: (reason: unknown) => void
} {
  let writer: UIMessageStreamWriter | null = null
  let didStartText = false
  let resolveClose: () => void = () => {}
  let rejectClose: (reason: unknown) => void = () => {}
  const closePromise = new Promise<void>((resolve, reject) => {
    resolveClose = resolve
    rejectClose = reject
  })

  const stream = createUIMessageStream({
    async execute({ writer: streamWriter }) {
      writer = streamWriter
      await closePromise
    },
  })

  return {
    response: createUIMessageStreamResponse({ stream }),
    enqueue(chunk: string) {
      if (!writer) {
        throw new Error("UI message stream writer is not ready.")
      }

      if (!didStartText) {
        writer.write({ type: "text-start", id: "text-1" })
        didStartText = true
      }

      writer.write({ type: "text-delta", id: "text-1", delta: chunk })
    },
    close() {
      if (writer && didStartText) {
        writer.write({ type: "text-end", id: "text-1" })
      }
      writer?.write({ type: "finish" })
      resolveClose()
    },
    error(reason: unknown) {
      rejectClose(reason)
    },
  }
}

/**
 * Installs a controllable clipboard mock for component tests.
 */
export function mockClipboardWriteText(
  implementation: (text: string) => Promise<void> = jest
    .fn()
    .mockResolvedValue(undefined)
): jest.MockedFunction<(text: string) => Promise<void>> {
  const writeText = jest.fn(implementation)

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText,
    },
  })

  return writeText
}

/**
 * Renders Run A.S.C.A. with optional custom messages for focused layout tests.
 */
export function renderRunAscaChat(initialMessages?: ChatMessage[]) {
  return render(createElement(RunAscaChat, { initialMessages }))
}

/**
 * Returns the stable landmarks and controls for the active conversation.
 */
export function getConversationElements() {
  return {
    region: screen.getByLabelText("Conversation"),
    prompt: screen.getByLabelText("Prompt A.S.C.A."),
    sendButton: screen.getByRole("button", { name: "Send prompt" }),
    viewport: screen.getByTestId("message-viewport"),
  }
}
