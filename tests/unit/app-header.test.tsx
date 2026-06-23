import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import AboutPage from "@/app/about/page"
import Page from "@/app/page"
import RunPage from "@/app/run/page"
import { AppHeader } from "@/components/layout/app-header"

jest.mock("@/lib/auth-session", () => ({
  getCurrentUserSession: jest.fn(async () => ({
    status: "authenticated",
    expiresAt: "2099-01-01T00:00:00.000Z",
    user: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      image: null,
    },
  })),
}))

jest.mock("@/lib/auth-actions", () => ({
  signOutOfGoogle: jest.fn(),
}))

const mockUsePathname = jest.fn(() => "/")
const mockSetTheme = jest.fn()
let mockResolvedTheme = "light"

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

jest.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}))

describe("AppHeader", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/")
    mockSetTheme.mockClear()
    mockResolvedTheme = "light"
  })

  it("renders the exact logo text in a fixed banner", () => {
    render(<AppHeader />)

    const banner = screen.getByRole("banner")
    expect(banner).toHaveClass("fixed")
    expect(banner).toHaveClass("top-0")
    expect(banner).toHaveClass("w-full")
    expect(within(banner).getByText("A.S.C.A.")).toBeVisible()
  })

  it("exposes a main spacing contract through the header height variable", () => {
    render(<AppHeader />)

    expect(screen.getByRole("banner")).toHaveStyle({
      "--app-header-height": "4rem",
    })
  })

  it("marks About A.S.C.A. active when the current route is /about", () => {
    mockUsePathname.mockReturnValue("/about")
    render(<AppHeader />)

    expect(
      screen.getByRole("link", { name: "About A.S.C.A." })
    ).toHaveAttribute("aria-current", "page")
    expect(
      screen.getByRole("link", { name: "Run A.S.C.A." })
    ).not.toHaveAttribute("aria-current")
  })

  it("marks Run A.S.C.A. active when the current route is /run", () => {
    mockUsePathname.mockReturnValue("/run")
    render(<AppHeader />)

    expect(screen.getByRole("link", { name: "Run A.S.C.A." })).toHaveAttribute(
      "aria-current",
      "page"
    )
  })

  it("opens the collapsed navigation menu below the sm breakpoint", async () => {
    const user = userEvent.setup()
    render(<AppHeader />)

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" })
    )

    const menu = screen.getByRole("navigation", { name: "Mobile navigation" })
    expect(
      within(menu).getByRole("link", { name: "About A.S.C.A." })
    ).toBeVisible()
    expect(
      within(menu).getByRole("link", { name: "Run A.S.C.A." })
    ).toBeVisible()
  })

  it("renders the GitHub action with new-tab attributes", () => {
    render(<AppHeader />)

    const githubLink = screen.getByRole("link", {
      name: "Visit GitHub Repository",
    })
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/take44444/asca"
    )
    expect(githubLink).toHaveAttribute("target", "_blank")
    expect(githubLink).toHaveAttribute("rel", "noreferrer")
    expect(githubLink).toHaveAttribute("title", "Visit GitHub Repository")
  })

  it("shows light mode theme toggle labels and switches to dark", async () => {
    const user = userEvent.setup()
    render(<AppHeader />)

    const themeButton = screen.getByRole("button", {
      name: "Switch to dark theme",
    })
    expect(themeButton).toHaveAttribute("title", "Switch to dark theme")

    await user.click(themeButton)

    expect(mockSetTheme).toHaveBeenCalledWith("dark")
  })

  it("shows dark mode theme toggle labels and switches to light", async () => {
    const user = userEvent.setup()
    mockResolvedTheme = "dark"
    render(<AppHeader />)

    const themeButton = screen.getByRole("button", {
      name: "Switch to light theme",
    })
    expect(themeButton).toHaveAttribute("title", "Switch to light theme")

    await user.click(themeButton)

    expect(mockSetTheme).toHaveBeenCalledWith("light")
  })

  it("renders a Sign In link to the login page", () => {
    render(<AppHeader />)

    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute(
      "href",
      "/login"
    )
  })

  it("renders layout-safe placeholder pages with unique headings", async () => {
    const { rerender } = render(<Page />)
    expect(screen.getByRole("heading", { name: "A.S.C.A." })).toBeVisible()

    rerender(<AboutPage />)
    expect(
      screen.getByRole("heading", { name: "About A.S.C.A." })
    ).toBeVisible()

    rerender(await RunPage())
    expect(screen.getByRole("heading", { name: "Run A.S.C.A." })).toBeVisible()
  })
})
