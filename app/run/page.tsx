import { redirect } from "next/navigation"

import { RunAscaChat } from "@/app/run/run-asca-chat"
import { getCurrentUserSession } from "@/lib/auth-session"

export default async function RunPage() {
  const session = await getCurrentUserSession()

  if (session.status !== "authenticated") {
    redirect("/login")
  }

  return <RunAscaChat />
}
