import { expect, test } from "@playwright/test"

test.describe("shared layout", () => {
  test("keeps a fixed header visible and main content below it", async ({
    page,
  }) => {
    await page.goto("/")

    const header = page.getByRole("banner")
    const main = page.getByRole("main")

    await expect(header).toBeVisible()
    await expect(
      header.getByRole("link", { name: "A.S.C.A.", exact: true })
    ).toBeVisible()
    await expect(header).toHaveCSS("position", "fixed")

    const headerBox = await header.boundingBox()
    const mainBox = await main.boundingBox()
    expect(headerBox).not.toBeNull()
    expect(mainBox).not.toBeNull()
    expect(mainBox!.y).toBeGreaterThanOrEqual(headerBox!.height)

    await page.mouse.wheel(0, 700)
    await expect(header).toBeInViewport()
  })

  test("navigates to About and Run with active desktop state", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto("/")

    await page.getByRole("link", { name: "About A.S.C.A." }).first().click()
    await expect(page).toHaveURL(/\/about$/)
    await expect(
      page.getByRole("heading", { name: "About A.S.C.A." })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "About A.S.C.A." }).first()
    ).toHaveAttribute("aria-current", "page")

    await page.getByRole("link", { name: "Run A.S.C.A." }).first().click()
    await expect(page).toHaveURL(/\/run$/)
    await expect(
      page.getByRole("heading", { name: "Run A.S.C.A." })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Run A.S.C.A." }).first()
    ).toHaveAttribute("aria-current", "page")
  })

  test("uses collapsed navigation below the sm breakpoint", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")

    await page.getByRole("button", { name: "Open navigation menu" }).click()
    const mobileNav = page.getByRole("navigation", {
      name: "Mobile navigation",
    })
    await expect(
      mobileNav.getByRole("link", { name: "About A.S.C.A." })
    ).toBeVisible()
    await mobileNav.getByRole("link", { name: "Run A.S.C.A." }).click()

    await expect(page).toHaveURL(/\/run$/)
    await expect(
      page.getByRole("heading", { name: "Run A.S.C.A." })
    ).toBeVisible()
  })

  test("keeps header actions visible on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")

    await expect(
      page.getByRole("link", { name: "Visit GitHub Repository" })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: /Switch to .* theme/ })
    ).toBeVisible()
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible()
  })

  test("opens GitHub in a new tab without replacing the app", async ({
    page,
    context,
  }) => {
    await page.goto("/")

    const popupPromise = context.waitForEvent("page")
    await page.getByRole("link", { name: "Visit GitHub Repository" }).click()
    const popup = await popupPromise

    await expect(popup).toHaveURL("https://github.com/take44444/asca")
    await expect(page).toHaveURL("/")
  })

  test("switches between readable light and dark themes", async ({ page }) => {
    await page.goto("/")

    const themeButton = page.getByRole("button", { name: /Switch to .* theme/ })
    await expect(themeButton).toHaveAttribute("title", "Switch to dark theme")
    await themeButton.click()
    await expect(page.locator("html")).toHaveClass(/dark/)
    await expect(themeButton).toHaveAttribute("title", "Switch to light theme")
  })

  test("Login is a placeholder and does not navigate", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("button", { name: "Login" }).click()

    await expect(page).toHaveURL("/")
  })
})
