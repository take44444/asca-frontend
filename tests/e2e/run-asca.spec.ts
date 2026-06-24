import { expect, test } from "@playwright/test"

import {
  clearAuthenticatedSession,
  setAuthenticatedSession,
} from "./auth-test-helpers"

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
    await page.route("**/api/asca/chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: {
            role: "assistant",
            content: "A.S.C.A. e2e response.",
          },
          model: "gpt-5.4-nano",
        }),
      })
    })

    await page.goto("/run")
    await page.getByLabel("Prompt A.S.C.A.").fill("Explain this workspace.")
    await page.getByRole("button", { name: "Send prompt" }).click()

    await expect(page.getByText("Explain this workspace.")).toBeVisible()
    await expect(page.getByText("A.S.C.A. e2e response.")).toBeVisible()
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
