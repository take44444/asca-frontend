import { render, screen } from "@testing-library/react"

import RunPage from "@/app/run/page"
import { getCurrentUserSession } from "@/lib/auth-session"
import { createAuthenticatedSession } from "@/tests/unit/auth-test-helpers"

jest.mock("@/lib/auth-session", () => ({
  getCurrentUserSession: jest.fn(),
}))

const mockRedirect = jest.fn((url: string) => {
  throw new Error(`redirect:${url}`)
})

jest.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}))

describe("RunPage authentication", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("redirects signed-out visitors to /login before rendering", async () => {
    jest.mocked(getCurrentUserSession).mockResolvedValueOnce({
      status: "signed-out",
      user: null,
      expiresAt: null,
    })

    await expect(RunPage()).rejects.toThrow("redirect:/login")
    expect(mockRedirect).toHaveBeenCalledWith("/login")
  })

  it("renders protected content for authenticated users", async () => {
    jest
      .mocked(getCurrentUserSession)
      .mockResolvedValueOnce(createAuthenticatedSession())

    render(await RunPage())

    expect(screen.getByRole("heading", { name: "Run A.S.C.A." })).toBeVisible()
  })
})
