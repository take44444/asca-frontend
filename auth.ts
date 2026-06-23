import NextAuth, {
  type Account,
  type NextAuthConfig,
  type Session,
} from "next-auth"
import type { JWT } from "next-auth/jwt"
import Google from "next-auth/providers/google"

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"

type JWTCallbackParams = {
  token: JWT
  account?: Account | null
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

type SessionCallbackParams = {
  session: Session
  token: JWT
}

type GoogleRefreshResponse = {
  access_token: string
  expires_in: number
  refresh_token?: string
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isGoogleRefreshResponse(
  value: unknown
): value is GoogleRefreshResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    isNonEmptyString((value as { access_token?: unknown }).access_token) &&
    typeof (value as { expires_in?: unknown }).expires_in === "number"
  )
}

function hasValidAccessToken(token: JWT): boolean {
  return (
    typeof token.accessTokenExpiresAt === "number" &&
    Date.now() < token.accessTokenExpiresAt
  )
}

/**
 * Refreshes an expired Google access token while preserving the existing
 * refresh token when Google does not return a replacement.
 */
export async function refreshGoogleAccessToken(token: JWT): Promise<JWT> {
  if (!isNonEmptyString(token.refreshToken)) {
    return {
      ...token,
      authError: "RefreshAccessTokenError",
    }
  }

  const body = new URLSearchParams({
    client_id: process.env.AUTH_GOOGLE_ID ?? "",
    client_secret: process.env.AUTH_GOOGLE_SECRET ?? "",
    grant_type: "refresh_token",
    refresh_token: token.refreshToken,
  })

  try {
    const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })
    const payload: unknown = await response.json()

    if (!response.ok || !isGoogleRefreshResponse(payload)) {
      return {
        ...token,
        authError: "RefreshAccessTokenError",
      }
    }

    return {
      ...token,
      accessToken: payload.access_token,
      accessTokenExpiresAt: Date.now() + payload.expires_in * 1000,
      refreshToken: payload.refresh_token ?? token.refreshToken,
      authError: undefined,
    }
  } catch {
    return {
      ...token,
      authError: "RefreshAccessTokenError",
    }
  }
}

/**
 * Auth.js JWT callback that stores Google OAuth credentials and refreshes
 * expired access tokens when a refresh token is available.
 */
export async function updateGoogleJWT({
  token,
  account,
  user,
}: JWTCallbackParams): Promise<JWT> {
  if (account?.provider === "google") {
    return {
      ...token,
      name: user?.name ?? token.name,
      email: user?.email ?? token.email,
      picture: user?.image ?? token.picture,
      accessToken: account.access_token,
      refreshToken: account.refresh_token ?? token.refreshToken,
      accessTokenExpiresAt:
        typeof account.expires_at === "number"
          ? account.expires_at * 1000
          : undefined,
      authError: undefined,
    }
  }

  if (hasValidAccessToken(token)) {
    return token
  }

  return refreshGoogleAccessToken(token)
}

/**
 * Auth.js session callback that exposes only the minimum profile data needed by
 * the frontend header and protected route checks.
 */
export async function updateGoogleSession({
  session,
  token,
}: SessionCallbackParams): Promise<Session> {
  if (token.authError) {
    return {
      ...session,
      error: token.authError,
    }
  }

  if (isNonEmptyString(token.name) && isNonEmptyString(token.email)) {
    return {
      ...session,
      user: {
        name: token.name,
        email: token.email,
        image: isNonEmptyString(token.picture) ? token.picture : null,
      },
    }
  }

  return session
}

/**
 * Shared Auth.js configuration for App Router handlers, Server Components, and
 * server actions.
 */
export const authConfig = {
  providers: [
    Google({
      authorization: {
        params: {
          scope: "openid email profile",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt: updateGoogleJWT,
    session: updateGoogleSession,
  },
  trustHost: true,
} satisfies NextAuthConfig

const nextAuth = NextAuth(authConfig)

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = nextAuth
