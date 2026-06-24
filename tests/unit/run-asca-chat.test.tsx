import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from "node:stream/web"
import { TextDecoder, TextEncoder } from "node:util"
import { MessagePort } from "node:worker_threads"

import { RunAscaChat } from "@/app/run/run-asca-chat"
import type { ChatMessage } from "@/components/run-asca/types"
import {
  createMockAscaResponse,
  mockClipboardWriteText,
} from "@/tests/unit/run-asca-test-helpers"

globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder
globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder
globalThis.ReadableStream =
  ReadableStream as unknown as typeof globalThis.ReadableStream
globalThis.WritableStream =
  WritableStream as unknown as typeof globalThis.WritableStream
globalThis.TransformStream =
  TransformStream as unknown as typeof globalThis.TransformStream
globalThis.MessagePort = MessagePort as unknown as typeof globalThis.MessagePort

const fetchPrimitives = jest.requireActual("undici") as {
  Response: typeof Response
}

globalThis.Response = fetchPrimitives.Response

const mockRouterPush = jest.fn()
const mockScrollToBottom = jest.fn()
let mockIsAtBottom = true

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

jest.mock("@/components/ui/markdown", () => ({
  Markdown: ({
    children,
    className,
  }: {
    children: string
    className?: string
  }) => <div className={className}>{children}</div>,
}))

jest.mock("use-stick-to-bottom", () => {
  const React = jest.requireActual("react")

  function StickToBottom({
    children,
    className,
    ...props
  }: {
    children:
      | React.ReactNode
      | ((context: {
          scrollRef: React.RefCallback<HTMLElement>
          contentRef: React.RefCallback<HTMLElement>
        }) => React.ReactNode)
    className?: string
  }) {
    const context = {
      scrollRef: jest.fn(),
      contentRef: jest.fn(),
    }

    return (
      <div className={className} {...props}>
        {typeof children === "function" ? children(context) : children}
      </div>
    )
  }

  StickToBottom.Content = function Content({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) {
    return <div className={className}>{children}</div>
  }

  return {
    StickToBottom,
    useStickToBottomContext: () => ({
      isAtBottom: mockIsAtBottom,
      scrollToBottom: mockScrollToBottom,
    }),
  }
})

function createDeferredResponse(): {
  promise: Promise<Response>
  resolve: (response: Response) => void
} {
  let resolvePromise: (response: Response) => void = () => {}
  const promise = new Promise<Response>((resolve) => {
    resolvePromise = resolve
  })

  return {
    promise,
    resolve: resolvePromise,
  }
}

function createResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { "Content-Type": "application/json" },
  })
}

function longMessages(): ChatMessage[] {
  return Array.from({ length: 16 }, (_, index) => ({
    id: `message-${index}`,
    role: index % 2 === 0 ? "user" : "assistant",
    content: `Long message ${index} with enough content to wrap and remain readable in the conversation panel.`,
    createdAt: `2026-06-25T00:${String(index).padStart(2, "0")}:00.000Z`,
    status: "complete",
    copyState: "idle",
  }))
}

describe("RunAscaChat", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsAtBottom = true
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        createResponse(createMockAscaResponse("A.S.C.A. test response."))
      )
  })

  it("rejects whitespace prompts without calling the route", async () => {
    const user = userEvent.setup()
    render(<RunAscaChat />)

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "   {enter}")

    expect(
      screen.getByText("Enter a prompt before sending.")
    ).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("appends a valid prompt, shows thinking within the pending state, and appends the response", async () => {
    const user = userEvent.setup()
    const deferred = createDeferredResponse()
    jest.mocked(global.fetch).mockReturnValueOnce(deferred.promise)

    render(<RunAscaChat />)

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Hello A.S.C.A.")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))

    expect(screen.getByText("Hello A.S.C.A.")).toBeInTheDocument()
    expect(screen.getByText("A.S.C.A. is thinking...")).toBeInTheDocument()

    await act(async () => {
      deferred.resolve(
        createResponse(createMockAscaResponse("A.S.C.A. test response."))
      )
    })

    expect(await screen.findByText("A.S.C.A. test response.")).toBeVisible()
    expect(
      screen.queryByText("A.S.C.A. is thinking...")
    ).not.toBeInTheDocument()
  })

  it("prevents duplicate submissions while a response is pending", async () => {
    const user = userEvent.setup()
    const deferred = createDeferredResponse()
    jest.mocked(global.fetch).mockReturnValueOnce(deferred.promise)

    render(<RunAscaChat />)

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Only once")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))
    await user.keyboard("{Enter}")

    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it("shows route failure feedback and keeps the submitted message visible", async () => {
    const user = userEvent.setup()
    jest.mocked(global.fetch).mockResolvedValueOnce(
      createResponse(
        {
          error: {
            code: "asca_unavailable",
            message: "A.S.C.A. could not return a response. Try again.",
          },
        },
        { status: 500 }
      )
    )

    render(<RunAscaChat />)

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Fail visibly")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))

    expect(await screen.findByText("Fail visibly")).toBeVisible()
    expect(
      await screen.findByText(
        "A.S.C.A. could not return a response. Try again."
      )
    ).toBeVisible()
  })

  it("renders the selected demonstration thread and unavailable create action", () => {
    render(<RunAscaChat />)

    expect(
      screen.getByRole("button", { name: /Demonstration Thread/ })
    ).toHaveAttribute("aria-current", "page")
    expect(
      screen.getByRole("button", { name: "Create New Thread unavailable" })
    ).toBeDisabled()
    expect(screen.getAllByText("Demonstration Thread")).toHaveLength(2)
    expect(screen.getByRole("heading", { name: "Run A.S.C.A." })).toBeVisible()
  })

  it("supports selecting the demonstration thread without losing the conversation", async () => {
    const user = userEvent.setup()
    render(<RunAscaChat />)

    await user.click(
      screen.getByRole("button", { name: /Demonstration Thread/ })
    )

    expect(
      screen.getByText("Ready for a focused A.S.C.A. demonstration thread.")
    ).toBeVisible()
  })

  it("renders long conversations with an anchored prompt and a return-to-latest control", async () => {
    const user = userEvent.setup()
    mockIsAtBottom = false

    render(<RunAscaChat initialMessages={longMessages()} />)

    expect(screen.getByTestId("message-viewport")).toBeInTheDocument()
    expect(screen.getByLabelText("Prompt A.S.C.A.")).toBeVisible()

    await user.click(
      screen.getByRole("button", { name: "Return to latest message" })
    )

    expect(mockScrollToBottom).toHaveBeenCalled()
  })

  it("moves to the latest message after a new assistant response", async () => {
    const user = userEvent.setup()
    render(<RunAscaChat initialMessages={longMessages()} />)

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Latest please")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))

    expect(await screen.findByText("A.S.C.A. test response.")).toBeVisible()
  })

  it("shows copy success feedback and writes original message text", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboardWriteText()
    render(
      <RunAscaChat
        initialMessages={[
          {
            id: "markdown-message",
            role: "assistant",
            content: "**Original** markdown",
            createdAt: "2026-06-25T00:00:00.000Z",
            status: "complete",
            copyState: "idle",
          },
        ]}
      />
    )

    await user.click(
      screen.getByRole("button", { name: "Copy A.S.C.A. message" })
    )

    expect(writeText).toHaveBeenCalledWith("**Original** markdown")
    expect(await screen.findByText("Copied")).toBeVisible()
  })

  it("shows copy failure feedback", async () => {
    const user = userEvent.setup()
    mockClipboardWriteText(() => Promise.reject(new Error("denied")))
    render(<RunAscaChat />)

    await user.click(
      screen.getByRole("button", { name: "Copy A.S.C.A. message" })
    )

    expect(await screen.findByText("Copy failed")).toBeVisible()
  })

  it("exposes accessible controls and states", async () => {
    const user = userEvent.setup()
    const deferred = createDeferredResponse()
    jest.mocked(global.fetch).mockReturnValueOnce(deferred.promise)
    render(<RunAscaChat />)

    expect(screen.getByLabelText("Prompt A.S.C.A.")).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Copy A.S.C.A. message" })
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Create New Thread unavailable" })
    ).toBeDisabled()

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Loading state")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "A.S.C.A. is thinking..."
      )
    })

    await act(async () => {
      deferred.resolve(
        createResponse(
          createMockAscaResponse("A.S.C.A. accessibility response.")
        )
      )
    })
  })
})
