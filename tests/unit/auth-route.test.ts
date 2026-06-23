const mockGET = jest.fn()
const mockPOST = jest.fn()

jest.mock("@/auth", () => ({
  GET: mockGET,
  POST: mockPOST,
}))

describe("auth route handler", () => {
  it("re-exports Auth.js GET and POST handlers", async () => {
    const route = await import("@/app/api/auth/[...nextauth]/route")

    expect(route.GET).toBe(mockGET)
    expect(route.POST).toBe(mockPOST)
  })
})
