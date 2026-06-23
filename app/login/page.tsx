import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { LoginForm } from "./login-form"

type SearchParams =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>

type LoginPageProps = {
  searchParams?: SearchParams
}

function getErrorMessage(error: string | string[] | undefined): string | null {
  if (!error) {
    return null
  }

  return "Sign-in is temporarily unavailable."
}

export default async function LoginPage({ searchParams = {} }: LoginPageProps) {
  const params = await searchParams
  const errorMessage = getErrorMessage(params.error)

  return (
    <div className="mx-auto flex min-h-[calc(100svh-var(--app-header-height))] w-full max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <main id="login-content">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>
              <h1 className="text-xl font-semibold tracking-normal">
                Sign in to your A.S.C.A. account
              </h1>
            </CardTitle>
            <CardDescription>
              Continue with the Google account you use for A.S.C.A.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm initialErrorMessage={errorMessage} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
