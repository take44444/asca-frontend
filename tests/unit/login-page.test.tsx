import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import LoginPage from "@/app/login/page"
import { LoginForm, type SignInActionState } from "@/app/login/login-form"

jest.mock("@/lib/auth-actions", () => ({
  signInWithGoogle: jest.fn(),
}))

describe("LoginPage", () => {
  it("renders the required heading and Google sign-in action", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({}) }))

    expect(
      screen.getByRole("heading", {
        name: "Sign in to your A.S.C.A. account",
      })
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Sign in with Google" })
    ).toBeVisible()
    expect(screen.getByTestId("google-mark")).toBeVisible()
  })

  it("shows a recoverable error state without removing retry", async () => {
    render(
      await LoginPage({
        searchParams: Promise.resolve({ error: "Configuration" }),
      })
    )

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Sign-in is temporarily unavailable."
    )
    expect(
      screen.getByRole("button", { name: "Sign in with Google" })
    ).toBeVisible()
  })

  it("announces pending sign-in state", async () => {
    const user = userEvent.setup()
    const pendingAction = jest.fn(
      () =>
        new Promise<SignInActionState>(() => {
          return undefined
        })
    )

    render(<LoginForm action={pendingAction} initialErrorMessage={null} />)

    await user.click(
      screen.getByRole("button", { name: "Sign in with Google" })
    )

    expect(screen.getByRole("status")).toHaveTextContent(
      "Starting Google sign-in..."
    )
  })

  it("keeps redirect/error messaging accessible", async () => {
    render(
      await LoginPage({
        searchParams: Promise.resolve({ error: "OAuthCallback" }),
      })
    )

    expect(screen.getByRole("alert")).toBeVisible()
    expect(screen.getByRole("main")).toHaveAttribute("id", "login-content")
  })
})
