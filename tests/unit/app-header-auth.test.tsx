import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { AppHeader } from "@/components/layout/app-header"
import {
  createAuthenticatedSession,
  createSignedOutSession,
  mockResolvedTheme,
  mockSetTheme,
  mockUsePathname,
  resetHeaderMocks,
} from "@/tests/unit/auth-test-helpers"

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

jest.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}))

jest.mock("@/lib/auth-actions", () => ({
  signOutOfGoogle: jest.fn(),
}))

describe("AppHeader authentication", () => {
  beforeEach(() => {
    resetHeaderMocks()
  })

  it("shows a signed-out Sign In link to /login", () => {
    render(<AppHeader session={createSignedOutSession()} />)

    const banner = screen.getByRole("banner")
    expect(
      within(banner).getByRole("link", { name: "Sign In" })
    ).toHaveAttribute("href", "/login")
    expect(
      screen.queryByRole("button", { name: /Account menu/ })
    ).not.toBeInTheDocument()
  })

  it("shows authenticated profile details instead of the sign-in link", async () => {
    const user = userEvent.setup()
    render(<AppHeader session={createAuthenticatedSession()} />)

    expect(
      screen.queryByRole("link", { name: "Sign In" })
    ).not.toBeInTheDocument()

    const trigger = screen.getByRole("button", {
      name: "Account menu for Ada Lovelace",
    })
    expect(trigger).toBeVisible()
    expect(screen.getByText("Ada Lovelace")).toBeVisible()
    expect(screen.getByText("ada@example.com")).toBeVisible()

    await user.click(trigger)

    const menu = screen.getByRole("dialog", { name: "Ada Lovelace" })
    expect(within(menu).getByText("ada@example.com")).toBeVisible()
    expect(within(menu).getByRole("button", { name: "Sign Out" })).toBeVisible()
  })

  it("uses the profile image when available", () => {
    render(<AppHeader session={createAuthenticatedSession()} />)

    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveAttribute(
      "src",
      "https://example.com/ada.png"
    )
  })

  it("uses the first name letter when no profile image is available", () => {
    render(<AppHeader session={createAuthenticatedSession({ image: null })} />)

    expect(screen.getByText("A")).toBeVisible()
  })

  it("keeps profile popover keyboard reachable", async () => {
    const user = userEvent.setup()
    render(<AppHeader session={createAuthenticatedSession()} />)

    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab()

    const trigger = screen.getByRole("button", {
      name: "Account menu for Ada Lovelace",
    })
    trigger.focus()
    await user.keyboard("{Enter}")

    expect(screen.getByRole("dialog", { name: "Ada Lovelace" })).toBeVisible()
  })
})
