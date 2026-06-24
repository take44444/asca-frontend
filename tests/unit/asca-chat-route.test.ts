import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from "node:stream/web"
import { TextDecoder, TextEncoder } from "node:util"
import { MessagePort } from "node:worker_threads"

jest.mock("ai", () => ({
  generateText: jest.fn(),
}))

jest.mock("@ai-sdk/openai", () => ({
  openai: jest.fn((model: string) => ({ model })),
}))

jest.mock("@/lib/auth-session", () => ({
  getCurrentUserSession: jest.fn(),
}))

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
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

async function readJson(response: Response): Promise<unknown> {
  return response.json()
}

describe("POST /api/asca/chat", () => {
  const originalModel = process.env.ASCA_MODEL

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ASCA_MODEL = "gpt-5.4-nano"
    jest
      .mocked(getCurrentUserSession)
      .mockResolvedValue(createAuthenticatedSession())
    jest.mocked(generateText).mockResolvedValue({
      text: "A.S.C.A. response text.",
      // The route only consumes text; tests keep the rest of AI SDK's result opaque.
    } as Awaited<ReturnType<typeof generateText>>)
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
        messages: [{ role: "user", content: "Hello" }],
      })
    )

    expect(response.status).toBe(401)
    expect(await readJson(response)).toEqual({
      error: {
        code: "unauthorized",
        message: "Sign in to run A.S.C.A.",
      },
    })
    expect(generateText).not.toHaveBeenCalled()
  })

  it("returns 400 for invalid empty requests", async () => {
    const response = await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [{ role: "user", content: "   " }],
      })
    )

    expect(response.status).toBe(400)
    expect(await readJson(response)).toEqual({
      error: {
        code: "invalid_request",
        message: "Enter a prompt before sending.",
      },
    })
    expect(generateText).not.toHaveBeenCalled()
  })

  it("uses ASCA_MODEL for a valid provider call", async () => {
    await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [{ role: "user", content: "Summarize this project." }],
      })
    )

    expect(openai).toHaveBeenCalledWith("gpt-5.4-nano")
    expect(generateText).toHaveBeenCalledWith({
      model: { model: "gpt-5.4-nano" },
      messages: [{ role: "user", content: "Summarize this project." }],
    })
  })

  it("maps successful provider text to the success payload", async () => {
    const response = await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [{ role: "user", content: "Hello" }],
      })
    )

    expect(response.status).toBe(200)
    expect(await readJson(response)).toEqual({
      message: {
        role: "assistant",
        content: "A.S.C.A. response text.",
      },
      model: "gpt-5.4-nano",
    })
  })

  it("maps provider failures to a sanitized unavailable response", async () => {
    jest
      .mocked(generateText)
      .mockRejectedValueOnce(new Error("secret provider detail"))

    const response = await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [{ role: "user", content: "Hello" }],
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
        messages: [{ role: "user", content: "Hello" }],
      })
    )

    expect(response.status).toBe(500)
    expect(generateText).not.toHaveBeenCalled()
  })

  it("returns 500 for empty assistant text", async () => {
    jest.mocked(generateText).mockResolvedValueOnce({
      text: "   ",
    } as Awaited<ReturnType<typeof generateText>>)

    const response = await POST(
      createJsonRequest({
        threadId: "demo",
        messages: [{ role: "user", content: "Hello" }],
      })
    )

    expect(response.status).toBe(500)
  })

  it("returns 400 for unsupported thread id", async () => {
    const response = await POST(
      createJsonRequest({
        threadId: "other",
        messages: [{ role: "user", content: "Hello" }],
      })
    )

    expect(response.status).toBe(400)
  })
})
