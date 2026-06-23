"use client"

import * as React from "react"

import { GoogleFillIcon } from "@/components/icons/akar-icons-google-fill"
import { Button } from "@/components/ui/button"
import { type AuthActionState, signInWithGoogle } from "@/lib/auth-actions"

export type SignInActionState = AuthActionState

type LoginFormProps = {
  action?: (
    previousState: SignInActionState,
    formData: FormData
  ) => Promise<SignInActionState>
  initialErrorMessage: string | null
}

const INITIAL_STATE: SignInActionState = {
  status: "idle",
  message: null,
}

export function LoginForm({
  action = signInWithGoogle,
  initialErrorMessage,
}: LoginFormProps) {
  const initialState: SignInActionState = initialErrorMessage
    ? { status: "error", message: initialErrorMessage }
    : INITIAL_STATE
  const [state, formAction, isPending] = React.useActionState<
    SignInActionState,
    FormData
  >(action, initialState)
  const message = isPending ? "Starting Google sign-in..." : state.message

  return (
    <form action={formAction} className="grid gap-4">
      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        aria-describedby="login-status"
        className="w-full"
      >
        <GoogleFillIcon
          data-testid="google-mark"
          aria-hidden="true"
          className="size-4"
        />
        Sign in with Google
      </Button>
      <p
        id="login-status"
        role={state.status === "error" && !isPending ? "alert" : "status"}
        aria-live="polite"
        className="min-h-5 text-sm text-muted-foreground data-[error=true]:text-destructive"
        data-error={state.status === "error" && !isPending}
      >
        {message}
      </p>
    </form>
  )
}
