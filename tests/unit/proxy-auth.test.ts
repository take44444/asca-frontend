type RequestLike = {
  nextUrl: URL
  auth?: { user?: { email?: string | null } | null } | null
  cookies: {
    get: (name: string) => { value: string } | undefined
  }
}

jest.mock("@/auth", () => ({
  auth: (handler: (request: RequestLike) => unknown) => handler,
}))

jest.mock("next/server", () => ({
  NextResponse: {
    next: () => ({ type: "next" }),
    redirect: (url: URL) => ({
      type: "redirect",
      url: url.toString(),
    }),
  },
}))

import { createE2ETestSessionCookieValue } from "@/lib/auth-session"
import { proxy } from "@/proxy"

const invokeProxy = proxy as unknown as (request: RequestLike) => unknown

describe("proxy", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ASCA_E2E_AUTH = undefined
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "test",
      configurable: true,
    })
  })

  function createRequest(overrides: Partial<RequestLike> = {}): RequestLike {
    return {
      nextUrl: new URL("http://127.0.0.1:3100/run"),
      auth: null,
      cookies: {
        get: jest.fn(),
      },
      ...overrides,
    }
  }

  it("passes through authenticated /run requests", () => {
    expect(
      invokeProxy(
        createRequest({
          auth: { user: { email: "ada@example.com" } },
        })
      )
    ).toEqual({ type: "next" })
  })

  it("redirects signed-out /run requests to /login", () => {
    expect(invokeProxy(createRequest())).toEqual({
      type: "redirect",
      url: "http://127.0.0.1:3100/login",
    })
  })

  it("passes through deterministic e2e sessions", () => {
    process.env.ASCA_E2E_AUTH = "1"

    expect(
      invokeProxy(
        createRequest({
          cookies: {
            get: () => ({
              value: createE2ETestSessionCookieValue({
                name: "Ada Lovelace",
                email: "ada@example.com",
                image: null,
              }),
            }),
          },
        })
      )
    ).toEqual({ type: "next" })
  })

  it("passes through non-run requests", () => {
    expect(
      invokeProxy(
        createRequest({
          nextUrl: new URL("http://127.0.0.1:3100/about"),
        })
      )
    ).toEqual({ type: "next" })
  })
})
