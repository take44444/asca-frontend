import type { AscaChatResponse } from "@/components/run-asca/types"

/**
 * Builds a successful mocked A.S.C.A. chat fetch response.
 */
export function createMockAscaResponse(
  content = "A.S.C.A. test response."
): AscaChatResponse {
  return {
    message: {
      role: "assistant",
      content,
    },
    model: "gpt-5.4-nano",
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
