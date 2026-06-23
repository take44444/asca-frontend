import { authConfig, updateGoogleSession } from "@/auth"

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    handlers: { GET: jest.fn(), POST: jest.fn() },
    auth: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  })),
}))

jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: jest.fn((config: object) => ({ id: "google", ...config })),
}))

describe("auth configuration", () => {
  it("uses JWT sessions and Google as the only provider", () => {
    expect(authConfig.session).toEqual({ strategy: "jwt" })
    expect(authConfig.providers).toHaveLength(1)
    expect(authConfig.providers[0]).toEqual(
      expect.objectContaining({ id: "google" })
    )
  })

  it("requests only basic Google profile fields with offline refresh access", () => {
    expect(authConfig.providers[0]).toEqual(
      expect.objectContaining({
        authorization: expect.objectContaining({
          params: expect.objectContaining({
            scope: "openid email profile",
            access_type: "offline",
          }),
        }),
      })
    )
  })

  it("copies typed JWT user fields into the session", async () => {
    await expect(
      updateGoogleSession({
        session: { expires: "2099-01-01T00:00:00.000Z" },
        token: {
          name: "Ada Lovelace",
          email: "ada@example.com",
          picture: "https://example.com/ada.png",
        },
      })
    ).resolves.toEqual({
      expires: "2099-01-01T00:00:00.000Z",
      user: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        image: "https://example.com/ada.png",
      },
    })
  })
})
