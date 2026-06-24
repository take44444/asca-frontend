import type {
  AscaChatErrorCode,
  AscaChatErrorPayload,
  AscaChatMessageInput,
  AscaChatRequest,
  AscaChatResponse,
} from "@/components/run-asca/types"

type ParseResult =
  | {
      ok: true
      request: AscaChatRequest
    }
  | {
      ok: false
      message: string
    }

const SUPPORTED_THREAD_ID = "demo"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isValidRole(value: unknown): value is AscaChatMessageInput["role"] {
  return value === "user" || value === "assistant"
}

/**
 * Reads JSON from a request and returns null when the body is malformed.
 */
export async function readRequestJson(
  request: Request
): Promise<unknown | null> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

/**
 * Validates and normalizes an unknown POST body into the typed chat request.
 */
export function parseAscaChatRequest(body: unknown): ParseResult {
  if (!isRecord(body)) {
    return { ok: false, message: "Enter a prompt before sending." }
  }

  if (body.threadId !== SUPPORTED_THREAD_ID) {
    return { ok: false, message: "Select the demonstration thread." }
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return { ok: false, message: "Enter a prompt before sending." }
  }

  const messages: AscaChatMessageInput[] = []

  for (const message of body.messages) {
    if (!isRecord(message) || !isValidRole(message.role)) {
      return { ok: false, message: "Enter a prompt before sending." }
    }

    if (typeof message.content !== "string") {
      return { ok: false, message: "Enter a prompt before sending." }
    }

    const content = message.content.trim()
    if (!content) {
      return { ok: false, message: "Enter a prompt before sending." }
    }

    messages.push({
      role: message.role,
      content,
    })
  }

  if (!messages.some((message) => message.role === "user")) {
    return { ok: false, message: "Enter a prompt before sending." }
  }

  return {
    ok: true,
    request: {
      threadId: SUPPORTED_THREAD_ID,
      messages,
    },
  }
}

/**
 * Returns the configured A.S.C.A. model id or null when it is unavailable.
 */
export function getAscaModelId(): string | null {
  const model = process.env.ASCA_MODEL?.trim()
  return model ? model : null
}

/**
 * Converts client chat messages into the text-only format sent to AI SDK.
 */
export function toProviderMessages(
  messages: AscaChatMessageInput[]
): AscaChatMessageInput[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }))
}

/**
 * Creates a typed JSON success response for a generated assistant message.
 */
export function createAscaChatResponse(
  content: string,
  model: string
): Response {
  const payload: AscaChatResponse = {
    message: {
      role: "assistant",
      content,
    },
    model,
  }

  return Response.json(payload)
}

/**
 * Creates a sanitized typed JSON error response for public route failures.
 */
export function createAscaChatErrorResponse(
  code: AscaChatErrorCode,
  message: string,
  status: number
): Response {
  const payload: AscaChatErrorPayload = {
    error: {
      code,
      message,
    },
  }

  return Response.json(payload, { status })
}

/**
 * Maps unknown provider or configuration failures to a stable public response.
 */
export function createAscaUnavailableResponse(): Response {
  return createAscaChatErrorResponse(
    "asca_unavailable",
    "A.S.C.A. could not return a response. Try again.",
    500
  )
}
