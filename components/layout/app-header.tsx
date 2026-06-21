import Link from "next/link"
import type * as React from "react"

import { GithubLoopIcon } from "@/components/icons/line-md-github-loop"
import {
  HeaderNav,
  MobileHeaderNav,
  ThemeToggle,
} from "@/components/layout/header-nav"
import { buttonVariants } from "@/components/ui/button"
import { GITHUB_ACTION } from "@/lib/layout-navigation"
import { cn } from "@/lib/utils"

export type AppHeaderProps = {
  className?: string
}

type HeaderStyle = React.CSSProperties & {
  "--app-header-height": string
}

/** Shared fixed header for all A.S.C.A. frontend pages. */
export function AppHeader({ className }: AppHeaderProps) {
  return (
    <header
      role="banner"
      style={{ "--app-header-height": "4rem" } as HeaderStyle}
      className={cn(
        "fixed top-0 left-0 z-40 h-[var(--app-header-height)] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className
      )}
    >
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:grid-cols-[1fr_auto_1fr] sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <MobileHeaderNav />
          <Link
            href="/"
            className="shrink-0 rounded-md text-base font-semibold tracking-normal text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
          >
            A.S.C.A.
          </Link>
        </div>

        <HeaderNav className="hidden sm:flex" />

        <div className="flex min-w-0 items-center justify-end gap-1.5">
          <a
            href={GITHUB_ACTION.href}
            target="_blank"
            rel="noreferrer"
            aria-label={GITHUB_ACTION.label}
            title={GITHUB_ACTION.label}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" })
            )}
          >
            <GithubLoopIcon aria-hidden="true" className="size-4" />
          </a>
          <ThemeToggle />
          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Login
          </button>
        </div>
      </div>
    </header>
  )
}
