import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from "node:stream/web"
import { TextDecoder, TextEncoder } from "node:util"
import { MessagePort } from "node:worker_threads"

jest.mock("ai", () => ({
  convertToModelMessages: jest.fn(),
  streamText: jest.fn(),
}))

jest.mock("@ai-sdk/openai", () => ({
  openai: jest.fn((model: string) => ({ model })),
}))

jest.mock("@/lib/auth-session", () => ({
  getCurrentUserSession: jest.fn(),
}))

import { openai } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { POST } from "@/app/api/asca/chat/route"
import { getCurrentUserSession } from "@/lib/auth-session"
import { createAuthenticatedSession } from "@/tests/unit/auth-test-helpers"

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
  Request: typeof Request
  Response: typeof Response
}

globalThis.Request = fetchPrimitives.Request
globalThis.Response = fetchPrimitives.Response

function createJsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/asca/chat", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

function createUserMessage(content: string): UIMessage {
  return {
    id: "user-1",
    role: "user",
    parts: [{ type: "text", text: content }],
  }
}

async function readJson(response: Response): Promise<unknown> {
  return response.json()
}

function createStreamTextResult(
  chunks: string[]
): ReturnType<typeof streamText> {
  const result = {
    toUIMessageStreamResponse: () =>
      new Response(chunks.join(""), {
        headers: {
          "Content-Type": "text/event-stream",
          "x-vercel-ai-ui-message-stream": "v1",
        },
      }),
  }

  return result as unknown as ReturnType<typeof streamText>
}

describe("POST /api/asca/chat", () => {
  const originalModel = process.env.ASCA_MODEL

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ASCA_MODEL = "gpt-5.4-nano"
    jest
      .mocked(getCurrentUserSession)
      .mockResolvedValue(createAuthenticatedSession())
    jest
      .mocked(streamText)
      .mockReturnValue(createStreamTextResult(["A.S.C.A.", " response text."]))
    jest
      .mocked(convertToModelMessages)
      .mockResolvedValue([
        { role: "user", content: "Summarize this project." },
      ] as Awaited<ReturnType<typeof convertToModelMessages>>)
  })

  afterAll(() => {
    process.env.ASCA_MODEL = originalModel
  })

  it("returns 401 for signed-out requests", async () => {
    jest.mocked(getCurrentUserSession).mockResolvedValueOnce({
      status: "signed-out",
      user: null,
      expiresAt: null,
    })

    const response = await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [createUserMessage("Hello")],
      })
    )

    expect(response.status).toBe(401)
    expect(await readJson(response)).toEqual({
      error: {
        code: "unauthorized",
        message: "Sign in to run A.S.C.A.",
      },
    })
    expect(streamText).not.toHaveBeenCalled()
  })

  it("returns 400 for invalid empty requests", async () => {
    const response = await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [createUserMessage("   ")],
      })
    )

    expect(response.status).toBe(400)
    expect(await readJson(response)).toEqual({
      error: {
        code: "invalid_request",
        message: "Enter a prompt before sending.",
      },
    })
    expect(streamText).not.toHaveBeenCalled()
  })

  it("uses ASCA_MODEL for a valid provider call", async () => {
    const userMessage = createUserMessage("Summarize this project.")
    jest
      .mocked(convertToModelMessages)
      .mockResolvedValueOnce([
        { role: "user", content: "Summarize this project." },
      ] as Awaited<ReturnType<typeof convertToModelMessages>>)

    await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [userMessage],
      })
    )

    expect(convertToModelMessages).toHaveBeenCalledWith([userMessage])
    expect(openai).toHaveBeenCalledWith("gpt-5.4-nano")
    expect(streamText).toHaveBeenCalledWith({
      model: { model: "gpt-5.4-nano" },
      messages: [{ role: "user", content: "Summarize this project." }],
      abortSignal: expect.any(AbortSignal),
    })
  })

  it("returns a UI message stream for a valid request", async () => {
    const response = await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [createUserMessage("Hello")],
      })
    )

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/event-stream")
    expect(response.headers.get("x-vercel-ai-ui-message-stream")).toBe("v1")
  })

  it("maps provider failures to a sanitized unavailable response", async () => {
    jest.mocked(streamText).mockImplementationOnce(() => {
      throw new Error("secret provider detail")
    })

    const response = await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [createUserMessage("Hello")],
      })
    )

    expect(response.status).toBe(500)
    expect(await readJson(response)).toEqual({
      error: {
        code: "asca_unavailable",
        message: "A.S.C.A. could not return a response. Try again.",
      },
    })
  })

  it("returns 400 for malformed JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/asca/chat", {
        method: "POST",
        body: "{",
      })
    )

    expect(response.status).toBe(400)
  })

  it("returns 500 when ASCA_MODEL is missing", async () => {
    delete process.env.ASCA_MODEL

    const response = await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [createUserMessage("Hello")],
      })
    )

    expect(response.status).toBe(500)
    expect(streamText).not.toHaveBeenCalled()
  })

  it("returns 400 for unsupported thread id", async () => {
    const response = await POST(
      createJsonRequest({
        threadId: "other",
        messages: [createUserMessage("Hello")],
      })
    )

    expect(response.status).toBe(400)
  })
})
