import { expect, type Page, test } from "@playwright/test"

import {
  clearAuthenticatedSession,
  setAuthenticatedSession,
} from "./auth-test-helpers"

type StreamingFetchScenario = {
  chunks: string[]
  delayMs?: number
  failAfterChunks?: boolean
}

declare global {
  interface Window {
    __ascaChatCallCount: number
  }
}

async function installStreamingFetchMock(
  page: Page,
  scenarios: StreamingFetchScenario[]
): Promise<void> {
  await page.addInitScript((mockScenarios) => {
    const originalFetch = window.fetch.bind(window)
    let callCount = 0
    const encodeStreamPart = (part: unknown) =>
      new TextEncoder().encode(`data: ${JSON.stringify(part)}\n\n`)

    Object.defineProperty(window, "__ascaChatCallCount", {
      configurable: true,
      get: () => callCount,
    })

    window.fetch = async (input, init) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof Request
            ? input.url
            : input.toString()

      if (!url.includes("/api/asca/chat")) {
        return originalFetch(input, init)
      }

      const scenario =
        mockScenarios[Math.min(callCount, mockScenarios.length - 1)]
      callCount += 1

      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const messageId = `mock-assistant-${callCount}`
          const textId = `mock-text-${callCount}`
          controller.enqueue(encodeStreamPart({ type: "start", messageId }))
          controller.enqueue(encodeStreamPart({ type: "text-start", id: textId }))

          for (const chunk of scenario.chunks) {
            await new Promise((resolve) =>
              window.setTimeout(resolve, scenario.delayMs ?? 40)
            )
            controller.enqueue(
              encodeStreamPart({ type: "text-delta", id: textId, delta: chunk })
            )
          }

          if (scenario.failAfterChunks) {
            controller.error(new Error("interrupted test stream"))
            return
          }

          controller.enqueue(encodeStreamPart({ type: "text-end", id: textId }))
          controller.enqueue(encodeStreamPart({ type: "finish" }))
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
          controller.close()
        },
      })

      return new Response(stream, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "x-vercel-ai-ui-message-stream": "v1",
        },
      })
    }
  }, scenarios)
}

test.describe("Run A.S.C.A.", () => {
  test("redirects signed-out users to login", async ({ page, context }) => {
    await clearAuthenticatedSession(context)

    await page.goto("/run")

    await expect(page).toHaveURL(/\/login$/)
    await expect(
      page.getByRole("heading", { name: "Sign in to your A.S.C.A. account" })
    ).toBeVisible()
  })

  test("lets a signed-in user submit a prompt and see a response", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await installStreamingFetchMock(page, [
      { chunks: ["A.S.C.A.", " e2e response."], delayMs: 75 },
    ])

    await page.goto("/run")
    await page.getByLabel("Prompt A.S.C.A.").fill("Explain this workspace.")
    await page.getByRole("button", { name: "Send prompt" }).click()

    await expect(page.getByText("Explain this workspace.")).toBeVisible()
    await expect(page.getByText("A.S.C.A.", { exact: true }).first()).toBeVisible()
    await expect(page.getByText("Streaming")).toBeVisible()
    await expect(page.getByText("A.S.C.A. e2e response.")).toBeVisible()
    await expect(page.getByText("Streaming")).toHaveCount(0)
    await expect(page.getByLabel("Prompt A.S.C.A.")).toBeEnabled()
  })

  test("shows processing, blocks duplicate sends, and keeps prompt anchored while streaming", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await page.setViewportSize({ width: 1280, height: 760 })
    await installStreamingFetchMock(page, [
      { chunks: ["Streaming", " response"], delayMs: 100 },
    ])

    await page.goto("/run")
    await page.getByLabel("Prompt A.S.C.A.").fill("No duplicates")
    await page.getByRole("button", { name: "Send prompt" }).click()

    await expect(page.getByRole("status")).toContainText(
      "A.S.C.A. is thinking..."
    )
    await expect(page.getByLabel("Prompt A.S.C.A.")).toBeDisabled()
    await expect(
      page.getByRole("button", { name: "Send prompt" })
    ).toBeDisabled()

    await page.keyboard.press("Enter")
    await expect
      .poll(() => page.evaluate(() => window.__ascaChatCallCount))
      .toBe(1)

    await expect(page.getByText("Streaming response")).toBeVisible()
    await expect(page.getByLabel("Prompt A.S.C.A.")).toBeEnabled()
    await expect(page.getByLabel("Prompt A.S.C.A.")).toBeVisible()
  })

  test("preserves partial text after an interrupted stream and allows a follow-up prompt", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await installStreamingFetchMock(page, [
      { chunks: ["Partial A.S.C.A. text"], delayMs: 60, failAfterChunks: true },
      { chunks: ["Recovered response."], delayMs: 20 },
    ])

    await page.goto("/run")
    await page.getByLabel("Prompt A.S.C.A.").fill("Interrupt this")
    await page.getByRole("button", { name: "Send prompt" }).click()

    await expect(page.getByText("Partial A.S.C.A. text")).toBeVisible()
    await expect(page.getByText("Incomplete")).toBeVisible()
    await expect(
      page.getByText("A.S.C.A. could not complete the response. Try again.")
    ).toBeVisible()

    await page.getByLabel("Prompt A.S.C.A.").fill("Follow up")
    await page.getByRole("button", { name: "Send prompt" }).click()

    await expect(page.getByText("Follow up")).toBeVisible()
    await expect(page.getByText("Recovered response.")).toBeVisible()
  })

  test("keeps the desktop workspace inside the page viewport", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await page.setViewportSize({ width: 1280, height: 800 })

    await page.goto("/run")

    await page.mouse.wheel(0, 900)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden")

    const threadList = page.getByLabel("Run A.S.C.A. threads")
    const conversation = page.getByRole("region", { name: "Conversation" })
    const threadBox = await threadList.boundingBox()
    const conversationBox = await conversation.boundingBox()

    expect(threadBox).not.toBeNull()
    expect(conversationBox).not.toBeNull()
    expect(threadBox!.x).toBeLessThan(conversationBox!.x)
    await expect(
      page.getByRole("button", { name: /Demonstration Thread/ })
    ).toHaveAttribute("aria-current", "page")
  })

  test("scrolls messages independently while the prompt stays anchored", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await page.setViewportSize({ width: 1280, height: 760 })

    await page.goto("/run")
    await page.getByRole("button", { name: "Seed long conversation" }).click()
    await expect(page.getByText(/Long conversation prompt 17/)).toBeVisible()

    const viewport = page.getByTestId("message-viewport")
    await expect(viewport).toBeVisible()
    await expect(page.getByLabel("Prompt A.S.C.A.")).toBeVisible()

    const canScroll = await viewport.evaluate(
      (node) => node.scrollHeight > node.clientHeight
    )
    expect(canScroll).toBe(true)

    await viewport.evaluate((node) => {
      node.scrollTop = 0
      node.dispatchEvent(new Event("scroll", { bubbles: true }))
    })

    await expect(
      page.getByRole("button", { name: "Return to latest message" })
    ).toBeVisible()
    await page.getByRole("button", { name: "Return to latest message" }).click()

    await expect
      .poll(() =>
        viewport.evaluate(
          (node) => node.scrollTop + node.clientHeight >= node.scrollHeight - 2
        )
      )
      .toBe(true)
  })

  test("copies message text with success feedback", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await context.grantPermissions(["clipboard-write"], {
      origin: "http://127.0.0.1:3100",
    })
    await page.goto("/run")
    await page
      .getByRole("button", { name: "Copy A.S.C.A. message" })
      .first()
      .click()

    await expect(page.getByText("Copied")).toBeVisible()
  })
})
