import type { BrowserContext } from "@playwright/test"

type E2EUser = {
  name: string
  email: string
  image?: string | null
}

const TEST_SESSION_COOKIE = "asca-e2e-auth"

export function encodeTestSessionCookie(user: E2EUser): string {
  return encodeURIComponent(JSON.stringify(user))
}

export async function setAuthenticatedSession(
  context: BrowserContext,
  user: E2EUser = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    image: "https://example.com/ada.png",
  }
): Promise<void> {
  await context.addCookies([
    {
      name: TEST_SESSION_COOKIE,
      value: encodeTestSessionCookie(user),
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    },
  ])
}

export async function clearAuthenticatedSession(
  context: BrowserContext
): Promise<void> {
  await context.clearCookies({ name: TEST_SESSION_COOKIE })
}
