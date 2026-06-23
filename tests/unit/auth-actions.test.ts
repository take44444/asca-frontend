import { AuthError } from "next-auth"

import { signIn, signOut } from "@/auth"
import { signInWithGoogle, signOutOfGoogle } from "@/lib/auth-actions"

const mockCookieSet = jest.fn()
const mockCookieDelete = jest.fn()

jest.mock("next-auth", () => {
  class MockAuthError extends Error {}

  return {
    __esModule: true,
    AuthError: MockAuthError,
  }
})

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock("next/headers", () => ({
  cookies: jest.fn(async () => ({
    set: mockCookieSet,
    delete: mockCookieDelete,
  })),
}))

const mockRedirect = jest.fn((url: string) => {
  throw new Error(`redirect:${url}`)
})

jest.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}))

describe("auth actions", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      AUTH_GOOGLE_ID: "google-id",
      AUTH_GOOGLE_SECRET: "google-secret",
      AUTH_SECRET: "auth-secret",
      ASCA_E2E_AUTH: undefined,
    }
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "test",
      configurable: true,
    })
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it("starts Google sign-in with a home redirect target", async () => {
    await signInWithGoogle({ status: "idle", message: null }, new FormData())

    expect(signIn).toHaveBeenCalledWith("google", { redirectTo: "/" })
  })

  it("returns a recoverable error when auth configuration is missing", async () => {
    process.env.AUTH_GOOGLE_ID = ""

    await expect(
      signInWithGoogle({ status: "idle", message: null }, new FormData())
    ).resolves.toEqual({
      status: "error",
      message: "Sign-in is temporarily unavailable.",
    })
  })

  it("returns a recoverable error for Auth.js sign-in failures", async () => {
    jest
      .mocked(signIn)
      .mockRejectedValueOnce(new AuthError("Provider unavailable"))

    await expect(
      signInWithGoogle({ status: "idle", message: null }, new FormData())
    ).resolves.toEqual({
      status: "error",
      message: "Google sign-in could not be started. Please try again.",
    })
  })

  it("rethrows non-auth sign-in errors", async () => {
    const error = new Error("unexpected")
    jest.mocked(signIn).mockRejectedValueOnce(error)

    await expect(
      signInWithGoogle({ status: "idle", message: null }, new FormData())
    ).rejects.toThrow("unexpected")
  })

  it("sets a deterministic e2e session cookie before redirecting", async () => {
    process.env.ASCA_E2E_AUTH = "1"

    await expect(
      signInWithGoogle({ status: "idle", message: null }, new FormData())
    ).rejects.toThrow("redirect:/")

    expect(mockCookieSet).toHaveBeenCalledWith(
      "asca-e2e-auth",
      expect.any(String),
      expect.objectContaining({ httpOnly: true, path: "/" })
    )
  })

  it("signs out with a home redirect target", async () => {
    await signOutOfGoogle()

    expect(signOut).toHaveBeenCalledWith({ redirectTo: "/" })
  })

  it("clears deterministic e2e auth before redirecting on sign-out", async () => {
    process.env.ASCA_E2E_AUTH = "1"

    await expect(signOutOfGoogle()).rejects.toThrow("redirect:/")

    expect(mockCookieDelete).toHaveBeenCalledWith("asca-e2e-auth")
  })
})
