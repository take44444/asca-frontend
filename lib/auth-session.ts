import { cookies } from "next/headers"
import type { Session } from "next-auth"

import { auth } from "@/auth"

export type AuthenticatedUser = {
  name: string
  email: string
  image: string | null
}

export type UserSessionStatus =
  | "signed-out"
  | "authenticating"
  | "authenticated"
  | "refreshing"
  | "expired"

export type UserSession =
  | {
      status: "authenticated"
      user: AuthenticatedUser
      expiresAt: string | null
    }
  | {
      status: Exclude<UserSessionStatus, "authenticated">
      user: null
      expiresAt: string | null
    }

const E2E_AUTH_COOKIE = "asca-e2e-auth"

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

export function normalizeAuthenticatedUser(
  user: Session["user"] | null | undefined
): AuthenticatedUser | null {
  if (!isNonEmptyString(user?.name) || !isNonEmptyString(user?.email)) {
    return null
  }

  return {
    name: user.name,
    email: user.email,
    image: isNonEmptyString(user.image) ? user.image : null,
  }
}

export function normalizeUserSession(session: Session | null): UserSession {
  const expiresAt = session?.expires ?? null

  if (session?.error === "RefreshAccessTokenError") {
    return {
      status: "expired",
      user: null,
      expiresAt,
    }
  }

  const user = normalizeAuthenticatedUser(session?.user)

  if (!user) {
    return {
      status: "signed-out",
      user: null,
      expiresAt,
    }
  }

  return {
    status: "authenticated",
    user,
    expiresAt,
  }
}

export function isE2EAuthEnabled(): boolean {
  return (
    process.env.ASCA_E2E_AUTH === "1" && process.env.NODE_ENV !== "production"
  )
}

export function readE2ETestSessionCookieValue(
  value: string | undefined
): UserSession | null {
  if (!isE2EAuthEnabled() || !value) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(value))
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "name" in parsed &&
      "email" in parsed
    ) {
      const name = (parsed as { name?: unknown }).name
      const email = (parsed as { email?: unknown }).email
      const image = (parsed as { image?: unknown }).image
      const user = normalizeAuthenticatedUser({
        name: isNonEmptyString(name) ? name : "",
        email: isNonEmptyString(email) ? email : "",
        image: isNonEmptyString(image) ? image : null,
      })

      if (user) {
        return {
          status: "authenticated",
          user,
          expiresAt: null,
        }
      }
    }
  } catch {
    return null
  }

  return null
}

export function createE2ETestSessionCookieValue(
  user: AuthenticatedUser
): string {
  return encodeURIComponent(JSON.stringify(user))
}

export async function getCurrentUserSession(): Promise<UserSession> {
  if (isE2EAuthEnabled()) {
    const cookieStore = await cookies()
    const testSession = readE2ETestSessionCookieValue(
      cookieStore.get(E2E_AUTH_COOKIE)?.value
    )

    if (testSession) {
      return testSession
    }
  }

  return normalizeUserSession(await auth())
}

export { E2E_AUTH_COOKIE }
