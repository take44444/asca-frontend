import { openai } from "@ai-sdk/openai"
import { convertToModelMessages, streamText } from "ai"

import {
  createAscaChatErrorResponse,
  createAscaUnavailableResponse,
  getAscaModelId,
  parseAscaChatRequest,
  readRequestJson,
} from "@/lib/asca-chat"
import { getCurrentUserSession } from "@/lib/auth-session"

/**
 * Handles authenticated text-only A.S.C.A. chat requests.
 */
export async function POST(request: Request): Promise<Response> {
  const session = await getCurrentUserSession()

  if (session.status !== "authenticated") {
    return createAscaChatErrorResponse(
      "unauthorized",
      "Sign in to run A.S.C.A.",
      401
    )
  }

  const body = await readRequestJson(request)
  const parsed = parseAscaChatRequest(body)

  if (!parsed.ok) {
    return createAscaChatErrorResponse("invalid_request", parsed.message, 400)
  }

  const modelId = getAscaModelId()
  if (!modelId) {
    return createAscaUnavailableResponse()
  }

  try {
    const result = streamText({
      model: openai(modelId),
      messages: await convertToModelMessages(parsed.request.messages),
      abortSignal: request.signal,
    })

    return result.toUIMessageStreamResponse({
      originalMessages: parsed.request.messages,
    })
  } catch {
    return createAscaUnavailableResponse()
  }
}
