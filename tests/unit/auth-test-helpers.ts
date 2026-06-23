import type { UserSession } from "@/lib/auth-session"

export const mockUsePathname = jest.fn(() => "/")
export const mockSetTheme = jest.fn()
export let mockResolvedTheme = "light"

export function setMockResolvedTheme(theme: "light" | "dark"): void {
  mockResolvedTheme = theme
}

export function resetHeaderMocks(): void {
  mockUsePathname.mockReturnValue("/")
  mockSetTheme.mockClear()
  mockResolvedTheme = "light"
}

export function createAuthenticatedSession(
  overrides: Partial<UserSession["user"]> = {}
): UserSession {
  return {
    status: "authenticated",
    expiresAt: "2099-01-01T00:00:00.000Z",
    user: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      image: "https://example.com/ada.png",
      ...overrides,
    },
  }
}

export function createSignedOutSession(): UserSession {
  return {
    status: "signed-out",
    expiresAt: null,
    user: null,
  }
}
