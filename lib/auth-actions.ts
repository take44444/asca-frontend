"use server"

import { AuthError } from "next-auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { signIn, signOut } from "@/auth"
import {
  createE2ETestSessionCookieValue,
  E2E_AUTH_COOKIE,
  isE2EAuthEnabled,
} from "@/lib/auth-session"

export type AuthActionState = {
  status: "idle" | "error"
  message: string | null
}

const MISSING_CONFIGURATION_MESSAGE = "Sign-in is temporarily unavailable."
const SIGN_IN_FAILURE_MESSAGE =
  "Google sign-in could not be started. Please try again."

function hasAuthConfiguration(): boolean {
  return Boolean(
    process.env.AUTH_GOOGLE_ID &&
    process.env.AUTH_GOOGLE_SECRET &&
    process.env.AUTH_SECRET
  )
}

/**
 * Starts Google sign-in and returns a recoverable state when configuration or
 * provider startup fails before Auth.js redirects.
 */
export async function signInWithGoogle(
  _previousState: AuthActionState,
  _formData: FormData
): Promise<AuthActionState> {
  void _previousState
  void _formData

  if (isE2EAuthEnabled()) {
    const cookieStore = await cookies()
    cookieStore.set(
      E2E_AUTH_COOKIE,
      createE2ETestSessionCookieValue({
        name: "Ada Lovelace",
        email: "ada@example.com",
        image: "https://example.com/ada.png",
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      }
    )
    redirect("/")
  }

  if (!hasAuthConfiguration()) {
    return {
      status: "error",
      message: MISSING_CONFIGURATION_MESSAGE,
    }
  }

  try {
    await signIn("google", { redirectTo: "/" })
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        message: SIGN_IN_FAILURE_MESSAGE,
      }
    }

    throw error
  }

  return {
    status: "error",
    message: SIGN_IN_FAILURE_MESSAGE,
  }
}

/** Ends the current user session and returns the browser to the home page. */
export async function signOutOfGoogle(): Promise<void> {
  if (isE2EAuthEnabled()) {
    const cookieStore = await cookies()
    cookieStore.delete(E2E_AUTH_COOKIE)
    redirect("/")
  }

  await signOut({ redirectTo: "/" })
}
