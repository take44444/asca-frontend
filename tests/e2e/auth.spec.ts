import { expect, test } from "@playwright/test"

import {
  clearAuthenticatedSession,
  setAuthenticatedSession,
} from "./auth-test-helpers"

test.describe("authentication", () => {
  test("routes signed-out users from the header to login", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("link", { name: "Sign In" }).click()

    await expect(page).toHaveURL(/\/login$/)
    await expect(
      page.getByRole("heading", { name: "Sign in to your A.S.C.A. account" })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Sign in with Google" })
    ).toBeVisible()
  })

  test("uses a deterministic signed-in session for successful sign-in UI", async ({
    page,
    context,
  }) => {
    await setAuthenticatedSession(context)
    await page.goto("/")

    await expect(page.getByText("Ada Lovelace")).toBeVisible()
    await expect(page.getByText("ada@example.com")).toBeVisible()
  })

  test("opens the profile popover and signs out", async ({ page, context }) => {
    await setAuthenticatedSession(context)
    await page.goto("/")

    await page
      .getByRole("button", { name: "Account menu for Ada Lovelace" })
      .click()
    await page.getByRole("button", { name: "Sign Out" }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible()
  })

  test("redirects signed-out /run access to /login", async ({
    page,
    context,
  }) => {
    await clearAuthenticatedSession(context)

    await page.goto("/run")

    await expect(page).toHaveURL(/\/login$/)
    await expect(
      page.getByRole("heading", { name: "Sign in to your A.S.C.A. account" })
    ).toBeVisible()
  })

  test("allows signed-in /run access", async ({ page, context }) => {
    await setAuthenticatedSession(context, {
      name: "Grace Hopper",
      email: "grace@example.com",
      image: null,
    })

    await page.goto("/run")

    await expect(page).toHaveURL(/\/run$/)
    await expect(
      page.getByRole("heading", { name: "Run A.S.C.A." })
    ).toBeVisible()
    await expect(page.getByText("Grace Hopper")).toBeVisible()
  })
})
