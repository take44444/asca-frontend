import { NextResponse } from "next/server"

import { auth } from "@/auth"
import {
  E2E_AUTH_COOKIE,
  readE2ETestSessionCookieValue,
} from "@/lib/auth-session"

export const proxy = auth((request) => {
  if (request.nextUrl.pathname !== "/run") {
    return NextResponse.next()
  }

  const testSession = readE2ETestSessionCookieValue(
    request.cookies.get(E2E_AUTH_COOKIE)?.value
  )

  if (request.auth?.user || testSession?.status === "authenticated") {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/login", request.nextUrl))
})

export const config = {
  matcher: ["/run"],
}
