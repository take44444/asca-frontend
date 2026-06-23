import {
  createE2ETestSessionCookieValue,
  getCurrentUserSession,
  normalizeAuthenticatedUser,
  normalizeUserSession,
  readE2ETestSessionCookieValue,
} from "@/lib/auth-session"
import { refreshGoogleAccessToken, updateGoogleJWT } from "@/auth"

// eslint-disable-next-line no-var
var mockAuth = jest.fn()
const mockCookieGet = jest.fn()

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    handlers: { GET: jest.fn(), POST: jest.fn() },
    auth: () => mockAuth(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  })),
}))

jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: jest.fn((config: object) => ({ id: "google", ...config })),
}))

jest.mock("next/headers", () => ({
  cookies: jest.fn(async () => ({
    get: mockCookieGet,
  })),
}))

describe("auth session normalization", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ASCA_E2E_AUTH = undefined
  })

  it("requires name and email for authenticated users", () => {
    expect(normalizeAuthenticatedUser({ name: "Ada", email: "" })).toBeNull()
    expect(
      normalizeAuthenticatedUser({
        name: "Ada Lovelace",
        email: "ada@example.com",
        image: "",
      })
    ).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      image: null,
    })
  })

  it("normalizes active and expired sessions", () => {
    expect(
      normalizeUserSession({
        expires: "2099-01-01T00:00:00.000Z",
        user: {
          name: "Ada Lovelace",
          email: "ada@example.com",
          image: "https://example.com/ada.png",
        },
      })
    ).toEqual({
      status: "authenticated",
      expiresAt: "2099-01-01T00:00:00.000Z",
      user: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        image: "https://example.com/ada.png",
      },
    })

    expect(
      normalizeUserSession({
        expires: "2020-01-01T00:00:00.000Z",
        error: "RefreshAccessTokenError",
      })
    ).toEqual({
      status: "expired",
      expiresAt: "2020-01-01T00:00:00.000Z",
      user: null,
    })
  })

  it("renews expired Google credentials when a refresh token is available", async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "new-access-token",
        expires_in: 3600,
        refresh_token: "new-refresh-token",
      }),
    } satisfies Partial<Response>)
    globalThis.fetch = fetchMock

    await expect(
      refreshGoogleAccessToken({
        accessToken: "old-access-token",
        refreshToken: "old-refresh-token",
        accessTokenExpiresAt: 1,
      })
    ).resolves.toEqual(
      expect.objectContaining({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        authError: undefined,
      })
    )

    expect(fetchMock).toHaveBeenCalledWith(
      "https://oauth2.googleapis.com/token",
      expect.objectContaining({ method: "POST" })
    )
  })

  it("marks renewal failure so protected features require sign-in", async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "invalid_grant" }),
    } satisfies Partial<Response>)

    await expect(
      refreshGoogleAccessToken({
        accessToken: "old-access-token",
        refreshToken: "old-refresh-token",
        accessTokenExpiresAt: 1,
      })
    ).resolves.toEqual(
      expect.objectContaining({ authError: "RefreshAccessTokenError" })
    )
  })

  it("marks missing refresh tokens as renewal failures", async () => {
    await expect(
      refreshGoogleAccessToken({
        accessToken: "old-access-token",
        accessTokenExpiresAt: 1,
      })
    ).resolves.toEqual(
      expect.objectContaining({ authError: "RefreshAccessTokenError" })
    )
  })

  it("returns unexpired JWT credentials without refreshing", async () => {
    const token = {
      accessToken: "access-token",
      accessTokenExpiresAt: Date.now() + 60_000,
    }

    await expect(updateGoogleJWT({ token })).resolves.toBe(token)
  })

  it("updates JWT credentials on sign-in and refreshes expired access tokens", async () => {
    const token = await updateGoogleJWT({
      token: {},
      account: {
        provider: "google",
        type: "oauth",
        providerAccountId: "account-id",
        access_token: "access-token",
        refresh_token: "refresh-token",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      },
      user: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        image: "https://example.com/ada.png",
      },
    })

    expect(token).toEqual(
      expect.objectContaining({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      })
    )
  })

  it("reads deterministic e2e session cookies only when enabled", () => {
    const originalNodeEnv = process.env.NODE_ENV
    process.env.ASCA_E2E_AUTH = "1"
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "test",
      configurable: true,
    })
    const value = encodeURIComponent(
      JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com" })
    )

    expect(readE2ETestSessionCookieValue(value)).toEqual({
      status: "authenticated",
      expiresAt: null,
      user: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        image: null,
      },
    })

    process.env.ASCA_E2E_AUTH = undefined
    Object.defineProperty(process.env, "NODE_ENV", {
      value: originalNodeEnv,
      configurable: true,
    })
  })

  it("gets the deterministic e2e session before calling Auth.js", async () => {
    process.env.ASCA_E2E_AUTH = "1"
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "test",
      configurable: true,
    })
    mockCookieGet.mockReturnValueOnce({
      value: createE2ETestSessionCookieValue({
        name: "Ada Lovelace",
        email: "ada@example.com",
        image: null,
      }),
    })

    await expect(getCurrentUserSession()).resolves.toEqual({
      status: "authenticated",
      expiresAt: null,
      user: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        image: null,
      },
    })
    expect(mockAuth).not.toHaveBeenCalled()
  })

  it("falls back to Auth.js when no e2e session exists", async () => {
    mockAuth.mockResolvedValueOnce(null)

    await expect(getCurrentUserSession()).resolves.toEqual({
      status: "signed-out",
      expiresAt: null,
      user: null,
    })
  })
})
