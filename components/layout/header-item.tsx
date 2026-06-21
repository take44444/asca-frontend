"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

import { GithubIcon } from "@/components/icons/lucide-github"
import { MenuIcon } from "@/components/icons/lucide-menu"
import { MoonIcon } from "@/components/icons/lucide-moon"
import { SunIcon } from "@/components/icons/lucide-sun"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  GITHUB_ACTION,
  HEADER_NAVIGATION_ITEMS,
  type HeaderNavigationItem,
} from "@/lib/layout-navigation"
import { cn } from "@/lib/utils"

type HeaderNavProps = {
  className?: string
}

type HeaderNavLinkProps = {
  item: HeaderNavigationItem
  isActive: boolean
}

function HeaderNavLink({ item, isActive }: HeaderNavLinkProps) {
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        isActive && "bg-secondary text-secondary-foreground"
      )}
    >
      {item.label}
    </Link>
  )
}

/** Desktop navigation links with active route state. */
export function HeaderNav({ className }: HeaderNavProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary navigation"
      className={cn("items-center gap-1", className)}
    >
      {HEADER_NAVIGATION_ITEMS.map((item) => (
        <HeaderNavLink
          key={item.href}
          item={item}
          isActive={pathname === item.href}
        />
      ))}
    </nav>
  )
}

/** Below-sm menu navigation with the same route targets as desktop. */
export function MobileHeaderNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative sm:hidden">
      <Button
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-header-navigation"
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsOpen((current) => !current)}
      >
        <MenuIcon aria-hidden="true" className="size-4" />
      </Button>
      {isOpen ? (
        <nav
          id="mobile-header-navigation"
          aria-label="Mobile navigation"
          className="absolute top-12 left-0 z-50 grid min-w-48 gap-1 rounded-md border bg-popover p-2 text-popover-foreground shadow-lg"
        >
          {HEADER_NAVIGATION_ITEMS.map((item) => (
            <HeaderNavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      ) : null}
    </div>
  )
}

/** Link to the A.S.C.A. GitHub repository. */
export function ASCARepositoryLink() {
  return (
    <Tooltip>
      <TooltipTrigger render={
        <a
          href={GITHUB_ACTION.href}
          target="_blank"
          rel="noreferrer"
          aria-label={GITHUB_ACTION.label}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" })
          )}
        >
          <GithubIcon aria-hidden="true" className="size-4" />
        </a>
      } />
      <TooltipContent>
        <p>{GITHUB_ACTION.label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

/** Theme control that describes and activates the opposite visual theme. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const nextTheme = isDark ? "light" : "dark"
  const label = isDark ? "Switch to light theme" : "Switch to dark theme"
  const Icon = isDark ? SunIcon : MoonIcon

  return (
    <Tooltip>
      <TooltipTrigger render={
        <Button
          aria-label={label}
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(nextTheme)}
        >
          <Icon aria-hidden="true" className="size-4" />
        </Button>
      } />
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

/** Sign in link. */
export function SignInLink() {
  return (
    <Link href="#" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
      Sign In
    </Link>
  )
}
