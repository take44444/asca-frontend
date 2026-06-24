import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

import {
  createAscaChatErrorResponse,
  createAscaChatResponse,
  createAscaUnavailableResponse,
  getAscaModelId,
  parseAscaChatRequest,
  readRequestJson,
  toProviderMessages,
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
    const result = await generateText({
      model: openai(modelId),
      messages: toProviderMessages(parsed.request.messages),
    })
    const text = result.text.trim()

    if (!text) {
      return createAscaUnavailableResponse()
    }

    return createAscaChatResponse(text, modelId)
  } catch {
    return createAscaUnavailableResponse()
  }
}
