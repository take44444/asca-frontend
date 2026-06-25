import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessageStreamWriter,
} from "ai"

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
