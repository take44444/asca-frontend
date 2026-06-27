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
          controller.enqueue(
            encodeStreamPart({ type: "text-start", id: textId })
          )

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

async function expectNoOverlap(page: Page, selectors: string[]): Promise<void> {
  const boxes = []

  for (const selector of selectors) {
    const box = await page.locator(selector).boundingBox()
    expect(box, `${selector} should be visible`).not.toBeNull()
    boxes.push({ selector, box: box! })
  }

  for (let index = 0; index < boxes.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < boxes.length; nextIndex += 1) {
      const first = boxes[index]
      const second = boxes[nextIndex]
      const overlaps =
        first.box.x < second.box.x + second.box.width &&
        first.box.x + first.box.width > second.box.x &&
        first.box.y < second.box.y + second.box.height &&
        first.box.y + first.box.height > second.box.y

      expect(
        overlaps,
        `${first.selector} should not overlap ${second.selector}`
      ).toBe(false)
    }
  }
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
      { chunks: ["A.S.C.A.", " e2e response."], delayMs: 300 },
    ])

    await page.goto("/run")
    await page.getByLabel("Prompt A.S.C.A.").fill("Explain this workspace.")
    await page.getByRole("button", { name: "Send prompt" }).click()

    await expect(page.getByText("Explain this workspace.")).toBeVisible()
    await expect(
      page.getByText("A.S.C.A.", { exact: true }).first()
    ).toBeVisible()
    await expect(page.getByTestId("message-viewport")).toContainText(
      "Streaming"
    )
    await expect(page.getByText("A.S.C.A. e2e response.")).toBeVisible()
    await expect(page.getByText("Streaming")).toHaveCount(0)
    await expect(page.getByLabel("Prompt A.S.C.A.")).toBeEnabled()
  })

  test("shows a bounded conversation panel and preserves prompt submit flow", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await installStreamingFetchMock(page, [
      { chunks: ["Bounded", " response."], delayMs: 50 },
    ])

    await page.goto("/run")

    const conversation = page.getByLabel("Conversation")
    await expect(conversation).toContainText("Demonstration Thread")
    await expect(conversation).toContainText("1 message")
    await expect(page.getByTestId("message-viewport")).toBeVisible()
    await expect(page.getByLabel("Prompt A.S.C.A.")).toBeVisible()

    await page.getByLabel("Prompt A.S.C.A.").fill("Check bounded panel")
    await page.getByRole("button", { name: "Send prompt" }).click()

    await expect(page.getByText("Check bounded panel")).toBeVisible()
    await expect(page.getByText("Bounded response.")).toBeVisible()
  })

  test("shows four metadata summaries in one desktop row", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await page.setViewportSize({ width: 1280, height: 800 })

    await page.goto("/run")

    const summaries = page.getByTestId("thread-metadata-summary")
    await expect(summaries).toHaveCount(4)
    await expect(page.getByLabel("Tasks summary")).toContainText("8 completed")
    await expect(page.getByLabel("Tasks summary")).toContainText("3 pending")
    await expect(page.getByLabel("Artifacts summary")).toContainText(
      "4 research"
    )
    await expect(page.getByLabel("Artifacts summary")).toContainText(
      "2 documents"
    )
    await expect(page.getByLabel("Artifacts summary")).toContainText("1 images")
    await expect(page.getByLabel("Knowledge summary")).toContainText(
      "14 acquired items"
    )

    const firstTop = await summaries
      .nth(0)
      .evaluate((node) => Math.round(node.getBoundingClientRect().top))

    for (let index = 1; index < 4; index += 1) {
      await expect
        .poll(() =>
          summaries
            .nth(index)
            .evaluate((node) => Math.round(node.getBoundingClientRect().top))
        )
        .toBe(firstTop)
    }
  })

  test("reveals exact token values by keyboard focus", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await page.setViewportSize({ width: 1280, height: 800 })

    await page.goto("/run")
    const tokenChart = page.getByRole("application")
    await tokenChart.focus()
    await expect(tokenChart).toBeFocused()
    await page.keyboard.press("ArrowRight")

    const tooltip = page.locator(".recharts-tooltip-wrapper")
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toContainText("Jun 21")
    await expect(tooltip).toContainText(/Input tokens\s*0/)
    await expect(tooltip).toContainText(/Output tokens\s*0/)
  })

  test("keeps metadata, conversation, viewport, and prompt non-overlapping responsively", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)

    for (const size of [
      { width: 390, height: 844 },
      { width: 1280, height: 800 },
    ]) {
      await page.setViewportSize(size)
      await page.goto("/run")

      await expect(page.getByLabel("Tasks summary")).toBeVisible()
      await expect(page.getByLabel("Artifacts summary")).toBeVisible()
      await expect(page.getByLabel("Knowledge summary")).toBeVisible()
      await expect(page.getByLabel("Total Tokens summary")).toBeVisible()
      await expect(page.getByLabel("Conversation")).toBeVisible()
      await expect(page.getByTestId("message-viewport")).toBeVisible()
      await expect(page.getByLabel("Prompt A.S.C.A.")).toBeVisible()

      await expectNoOverlap(page, [
        "[aria-label='Thread metadata']",
        "[aria-label='Conversation'] [data-slot='card-header']",
        "[data-testid='message-viewport']",
        "[aria-label='Conversation'] form",
      ])
    }
  })

  test("shows processing, blocks duplicate sends, and keeps prompt anchored while streaming", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await page.setViewportSize({ width: 1280, height: 760 })
    await installStreamingFetchMock(page, [
      { chunks: ["Streaming", " response"], delayMs: 1000 },
    ])

    await page.goto("/run")
    await page.getByLabel("Prompt A.S.C.A.").fill("No duplicates")
    await page.getByRole("button", { name: "Send prompt" }).click()

    await expect(page.locator("[data-slot='gradient-text']")).toContainText(
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
    const conversation = page.getByLabel("Conversation")
    const threadBox = await threadList.boundingBox()
    const conversationBox = await conversation.boundingBox()

    expect(threadBox).not.toBeNull()
    expect(conversationBox).not.toBeNull()
    expect(threadBox!.x).toBeLessThan(conversationBox!.x)
    await expect(
      page.getByRole("button", { name: /Demonstration Thread/ })
    ).toHaveAttribute("aria-current", "page")
  })

  test("shows the redesigned thread list with 20 accessible entries and a disabled create control", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await page.setViewportSize({ width: 1280, height: 800 })

    await page.goto("/run")

    const threadRegion = page.getByRole("complementary", {
      name: "Run A.S.C.A. threads",
    })
    const threadCard = threadRegion.getByTestId("thread-list-card")
    await expect(threadRegion).toBeVisible()
    await expect(threadRegion).not.toHaveClass(/md:border-r/)
    await expect(threadCard).toBeVisible()
    await expect(threadCard).toHaveClass(/bg-card/)
    await expect(threadCard).toHaveClass(/shadow-lg/)
    await expect(
      page.getByRole("button", { name: "Create New Thread" })
    ).toBeDisabled()
    await expect(threadRegion.getByRole("button")).toHaveCount(21)
    await expect(
      page.getByRole("button", { name: /Demonstration Thread\s+1 message/ })
    ).toHaveAttribute("aria-current", "page")
    await expect(
      page.getByRole("button", {
        name: /Incident response rehearsal\s+3 messages/,
      })
    ).toBeVisible()
  })

  test("switches through static threads and updates the conversation content", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await page.setViewportSize({ width: 1280, height: 800 })

    await page.goto("/run")

    for (const thread of [
      {
        title: "Incident response rehearsal",
        message: "Confirm the escalation path and summarize owners.",
      },
      {
        title: "Release readiness review",
        message: "List blockers by severity before the release window.",
      },
      {
        title: "Knowledge base grooming",
        message: "Group stale articles by owner and last reviewed date.",
      },
      {
        title: "Customer onboarding draft",
        message: "Turn the kickoff notes into a first-week checklist.",
      },
      {
        title: "Long-running research synthesis",
        message: "Research note 12: final recommendation and tradeoffs.",
      },
    ]) {
      await page.getByRole("button", { name: new RegExp(thread.title) }).click()
      await expect(
        page
          .getByLabel("Conversation")
          .locator("[data-slot='card-title']", { hasText: thread.title })
      ).toBeVisible()
      await expect(page.getByText(thread.message)).toBeVisible()
      await expect(
        page.getByRole("button", { name: new RegExp(thread.title) })
      ).toHaveAttribute("aria-current", "page")
    }
  })

  test("scrolls the long thread list independently while the conversation remains visible", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await page.setViewportSize({ width: 1280, height: 560 })

    await page.goto("/run")

    const scrollArea = page.getByTestId("thread-list-scroll")
    const canScroll = await scrollArea.evaluate(
      (node) => node.scrollHeight > node.clientHeight
    )
    expect(canScroll).toBe(true)

    await scrollArea.evaluate((node) => {
      node.scrollTop = node.scrollHeight
      node.dispatchEvent(new Event("scroll", { bubbles: true }))
    })

    await expect(
      page.getByRole("button", { name: /Thread list accessibility audit/ })
    ).toBeVisible()
    await expect(page.getByLabel("Conversation")).toBeVisible()
    await expect(page.getByLabel("Prompt A.S.C.A.")).toBeVisible()
    await expect(page).toHaveURL(/\/run$/)
  })

  test("keeps thread title, count, create control, and conversation content non-overlapping", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)

    for (const size of [
      { width: 390, height: 844 },
      { width: 1280, height: 800 },
    ]) {
      await page.setViewportSize(size)
      await page.goto("/run")

      await expect(page.getByLabel("Run A.S.C.A. threads")).toBeVisible()
      await expect(
        page.getByRole("button", { name: "Create New Thread" })
      ).toBeVisible()
      await expect(
        page.getByRole("button", { name: /Demonstration Thread/ })
      ).toBeVisible()
      await expect(page.getByLabel("Conversation")).toBeVisible()

      await expectNoOverlap(page, [
        "[aria-label='Run A.S.C.A. threads'] [data-slot='card-header']",
        "[aria-label='Run A.S.C.A. threads'] [data-testid='thread-list-scroll']",
        "[aria-label='Conversation'] [data-slot='card-header']",
        "[data-testid='message-viewport']",
        "[aria-label='Conversation'] form",
      ])
    }
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
