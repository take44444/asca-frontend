import { act, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from "node:stream/web"
import { TextDecoder, TextEncoder } from "node:util"
import { MessagePort } from "node:worker_threads"

import { RunAscaChat } from "@/app/run/run-asca-chat"
import {
  demoThreadMetadataSummaries,
  demoTokenUsageSummary,
} from "@/components/run-asca/thread-metadata-fixtures"
import type { ChatMessage } from "@/components/run-asca/types"
import {
  createControlledUIMessageStream,
  createMockAscaUIStreamResponse,
  getConversationElements,
  mockClipboardWriteText,
  renderRunAscaChat,
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
        createMockAscaUIStreamResponse("A.S.C.A. test response.")
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

  it("appends a valid prompt, shows thinking before first text, and streams chunks into one assistant message", async () => {
    const user = userEvent.setup()
    const stream = createControlledUIMessageStream()
    jest.mocked(global.fetch).mockResolvedValueOnce(stream.response)

    render(<RunAscaChat />)

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Hello A.S.C.A.")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))

    expect(screen.getByText("Hello A.S.C.A.")).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent(
      "A.S.C.A. is thinking..."
    )

    await act(async () => {
      stream.enqueue("A.S.C.A.")
    })

    await waitFor(() => {
      expect(
        screen
          .getAllByText("A.S.C.A.")
          .some((element) => element.className.includes("prose"))
      ).toBe(true)
    })
    expect(screen.getByText("Streaming")).toBeVisible()

    await act(async () => {
      stream.enqueue(" test response.")
    })

    expect(await screen.findByText("A.S.C.A. test response.")).toBeVisible()

    await act(async () => {
      stream.close()
    })

    expect(
      screen.queryByText("A.S.C.A. is thinking...")
    ).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText("Streaming")).not.toBeInTheDocument()
    })
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

  it("marks partial assistant text incomplete when a stream read fails", async () => {
    const user = userEvent.setup()
    const stream = createControlledUIMessageStream()
    jest.mocked(global.fetch).mockResolvedValueOnce(stream.response)

    render(<RunAscaChat />)

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Fail later")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))

    await act(async () => {
      stream.enqueue("Partial answer")
    })

    expect(await screen.findByText("Partial answer")).toBeVisible()

    await act(async () => {
      stream.error(new Error("connection lost"))
    })

    expect(await screen.findByText("Partial answer")).toBeVisible()
    expect(await screen.findByText("Incomplete")).toBeVisible()
    expect(
      await screen.findByText(
        "A.S.C.A. could not complete the response. Try again."
      )
    ).toBeVisible()

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Next prompt")
    expect(screen.getByRole("button", { name: "Send prompt" })).toBeEnabled()
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

  it("falls back to generic route feedback when an error response is not JSON", async () => {
    const user = userEvent.setup()
    jest.mocked(global.fetch).mockResolvedValueOnce(
      new Response("not json", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      })
    )

    render(<RunAscaChat />)

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Bad payload")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))

    expect(await screen.findByText("Bad payload")).toBeVisible()
    expect(
      await screen.findByText(
        "A.S.C.A. could not return a response. Try again."
      )
    ).toBeVisible()
  })

  it("redirects to login when the chat route returns unauthorized", async () => {
    const user = userEvent.setup()
    jest.mocked(global.fetch).mockResolvedValueOnce(
      createResponse(
        {
          error: {
            code: "unauthorized",
            message: "Sign in to run A.S.C.A.",
          },
        },
        { status: 401 }
      )
    )

    render(<RunAscaChat />)

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Needs auth")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/login")
    })
    expect(await screen.findByText("Sign in to run A.S.C.A.")).toBeVisible()
  })

  it("shows fetch failure feedback before any assistant text", async () => {
    const user = userEvent.setup()
    jest
      .mocked(global.fetch)
      .mockRejectedValueOnce(new Error("network unavailable"))

    render(<RunAscaChat />)

    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Fail before")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))

    expect(await screen.findByText("Fail before")).toBeVisible()
    expect(
      await screen.findByText(
        "A.S.C.A. could not return a response. Try again."
      )
    ).toBeVisible()
    expect(screen.queryByText("Incomplete")).not.toBeInTheDocument()
  })

  it("renders the selected demonstration thread and unavailable create action", () => {
    render(<RunAscaChat />)

    expect(
      screen.getByRole("button", { name: /Demonstration Thread/ })
    ).toHaveAttribute("aria-current", "page")
    expect(
      screen.getByRole("button", { name: "Create New Thread" })
    ).toBeDisabled()
    expect(screen.getAllByText("Demonstration Thread")).toHaveLength(2)
    expect(
      screen.getByRole("complementary", { name: "Run A.S.C.A. threads" })
    ).toBeVisible()
  })

  it("renders 20 demonstration thread entries with titles and message counts without fetching threads", () => {
    render(<RunAscaChat />)

    const threadRegion = screen.getByRole("complementary", {
      name: "Run A.S.C.A. threads",
    })
    const threadButtons = within(threadRegion)
      .getAllByRole("button")
      .filter((button) => button.textContent !== "Create New Thread")

    expect(threadButtons).toHaveLength(20)
    expect(
      within(threadRegion).getByRole("button", {
        name: /Demonstration Thread\s+1 message/,
      })
    ).toHaveAttribute("aria-current", "page")
    expect(
      within(threadRegion).getByRole("button", {
        name: /Incident response rehearsal\s+3 messages/,
      })
    ).toBeVisible()
    expect(
      within(threadRegion).getByRole("button", {
        name: /Long-running research synthesis\s+12 messages/,
      })
    ).toBeVisible()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("keeps the create thread control visible, disabled, and unavailable for activation", () => {
    render(<RunAscaChat />)

    const createThread = screen.getByRole("button", {
      name: "Create New Thread",
    })

    expect(createThread).toBeVisible()
    expect(createThread).toBeDisabled()
    expect(createThread.querySelector("svg")).not.toBeNull()
  })

  it("switches to static demonstration threads and back to the live thread", async () => {
    const user = userEvent.setup()
    render(<RunAscaChat />)

    await user.click(
      screen.getByRole("button", { name: /Incident response rehearsal/ })
    )

    expect(
      screen.getByRole("heading", { name: "Incident response rehearsal" })
    ).toBeVisible()
    expect(
      within(screen.getByRole("region", { name: "Conversation" })).getByText(
        "3 messages"
      )
    ).toBeVisible()
    expect(
      screen.getByText("Confirm the escalation path and summarize owners.")
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: /Incident response rehearsal/ })
    ).toHaveAttribute("aria-current", "page")

    await user.click(
      screen.getByRole("button", { name: /Demonstration Thread/ })
    )

    expect(
      screen.getByRole("heading", { name: "Demonstration Thread" })
    ).toBeVisible()
    expect(
      screen.getByText("Ready for a focused A.S.C.A. demonstration thread.")
    ).toBeVisible()
  })

  it("submits prompts with the currently selected thread id", async () => {
    const user = userEvent.setup()
    render(<RunAscaChat />)

    await user.click(
      screen.getByRole("button", { name: /Incident response rehearsal/ })
    )
    await user.type(screen.getByLabelText("Prompt A.S.C.A."), "Use this thread")
    await user.click(screen.getByRole("button", { name: "Send prompt" }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    const [, init] = jest.mocked(global.fetch).mock.calls[0]
    expect(init?.body).toContain('"threadId":"incident-response-rehearsal"')
  })

  it("keeps the thread list header fixed while entries scroll independently", () => {
    render(<RunAscaChat />)

    const threadRegion = screen.getByRole("complementary", {
      name: "Run A.S.C.A. threads",
    })
    const card = within(threadRegion).getByTestId("thread-list-card")
    const content = card.querySelector("[data-testid='thread-list-scroll']")

    expect(threadRegion).not.toHaveClass("md:border-r", "bg-muted/30")
    expect(card).toHaveClass("bg-card", "shadow-lg")
    expect(content).not.toBeNull()
    expect(content).toHaveClass("min-h-0", "flex-1", "overflow-y-auto")
    expect(
      screen.getByRole("button", { name: "Create New Thread" })
    ).toBeVisible()
  })

  it("contains long titles and supports zero and multi-digit message counts", () => {
    render(<RunAscaChat />)

    const threadRegion = screen.getByRole("complementary", {
      name: "Run A.S.C.A. threads",
    })

    expect(
      within(threadRegion).getByRole("button", {
        name: /Quarterly planning notes with a deliberately long title that stays contained\s+0 messages/,
      })
    ).toBeVisible()
    expect(
      within(threadRegion).getByRole("button", {
        name: /Long-running research synthesis\s+12 messages/,
      })
    ).toBeVisible()
  })

  it("renders a bounded conversation panel with header, exact count, viewport, empty state, and anchored prompt", () => {
    renderRunAscaChat([])

    const conversation = getConversationElements()

    expect(conversation.region).toHaveClass("rounded-xl", "border")
    expect(
      screen.getByRole("heading", { name: "Demonstration Thread" })
    ).toBeVisible()
    expect(conversation.region).toHaveTextContent("0 messages")
    expect(
      screen.getByText("Start the demonstration thread with a text prompt.")
    ).toBeVisible()
    expect(conversation.viewport).toHaveClass("overflow-y-auto")
    expect(conversation.prompt).toBeVisible()
    expect(conversation.sendButton).toBeDisabled()
  })

  it("renders exactly four static metadata summaries without fetching metadata", async () => {
    renderRunAscaChat()

    const summaries = screen.getAllByTestId("thread-metadata-summary")

    expect(summaries).toHaveLength(4)
    expect(global.fetch).not.toHaveBeenCalled()
    expect(
      screen.getByRole("region", { name: "Thread metadata" })
    ).toBeVisible()
    expect(await screen.findByText("8 completed")).toBeVisible()
    expect(screen.getByText("3 pending")).toBeVisible()
    expect(screen.getByText("4 research")).toBeVisible()
    expect(screen.getByText("2 documents")).toBeVisible()
    expect(screen.getByText("1 images")).toBeVisible()
    expect(screen.getByText("14 acquired items")).toBeVisible()
  })

  it("renders seven chronological token points, includes zero values, and keeps derived totals consistent", async () => {
    renderRunAscaChat()

    const expectedTotal =
      demoTokenUsageSummary.totalInputTokens +
      demoTokenUsageSummary.totalOutputTokens

    expect(
      await screen.findByText(expectedTotal.toLocaleString())
    ).toBeVisible()
    expect(demoTokenUsageSummary.points).toHaveLength(7)
    expect(demoTokenUsageSummary.points[1]).toMatchObject({
      dateLabel: "Jun 21",
      inputTokens: 0,
      outputTokens: 0,
    })
    expect(
      demoTokenUsageSummary.points.map((point) => point.dateLabel)
    ).toEqual([
      "Jun 20",
      "Jun 21",
      "Jun 22",
      "Jun 23",
      "Jun 24",
      "Jun 25",
      "Jun 26",
    ])
  })

  it("keeps compact metadata labels, symbols, and primary counts available", () => {
    renderRunAscaChat()

    for (const summary of demoThreadMetadataSummaries) {
      const card = screen.getByLabelText(`${summary.label} summary`)

      expect(card).toBeVisible()
      expect(card).toHaveTextContent(summary.label)
      expect(card).toHaveTextContent(summary.primaryValue)
      expect(card.querySelector("[aria-hidden='true']")).not.toBeNull()
    }
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
      screen.getByRole("button", { name: "Create New Thread" })
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
        createMockAscaUIStreamResponse("A.S.C.A. accessibility response.")
      )
    })
  })
})
