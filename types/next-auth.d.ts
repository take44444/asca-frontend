import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      name: string
      email: string
      image?: string | null
    }
    error?: "RefreshAccessTokenError"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpiresAt?: number
    authError?: "RefreshAccessTokenError"
  }
}
