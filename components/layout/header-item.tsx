"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

import { GithubIcon } from "@/components/icons/lucide-github"
import { MenuIcon } from "@/components/icons/lucide-menu"
import { MoonIcon } from "@/components/icons/lucide-moon"
import { SunIcon } from "@/components/icons/lucide-sun"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ShineBorder } from "@/components/ui/shine-border"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { signOutOfGoogle } from "@/lib/auth-actions"
import type { UserSession } from "@/lib/auth-session"
import {
  GITHUB_ACTION,
  HEADER_NAVIGATION_ABOUT_ASCA,
  HEADER_NAVIGATION_RUN_ASCA,
  type HeaderNavigationItem,
} from "@/lib/layout-navigation"
import { cn } from "@/lib/utils"
import { Shine } from "../animate-ui/primitives/effects/shine"

type HeaderNavProps = {
  className?: string
}

type HeaderNavLinkProps = {
  item: HeaderNavigationItem
  isActive: boolean
  shine?: boolean
}

function HeaderNavLink({ item, isActive, shine }: HeaderNavLinkProps) {
  return (
    <Shine enable={shine} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} loop={true} asChild>
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative rounded-lg bg-background px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-input/30 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
          isActive && "bg-input/30 text-foreground"
        )}
      >
        {shine && (
          <ShineBorder
            borderWidth={2}
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          />
        )}
        {item.label}
      </Link>
    </Shine>
  )
}

/** Desktop navigation links with active route state. */
export function HeaderNav({ className }: HeaderNavProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary navigation"
      className={cn("items-center gap-10", className)}
    >
      <HeaderNavLink
        key={HEADER_NAVIGATION_ABOUT_ASCA.href}
        item={HEADER_NAVIGATION_ABOUT_ASCA}
        isActive={pathname === HEADER_NAVIGATION_ABOUT_ASCA.href}
        shine={false}
      />
      <HeaderNavLink
        key={HEADER_NAVIGATION_RUN_ASCA.href}
        item={HEADER_NAVIGATION_RUN_ASCA}
        isActive={pathname === HEADER_NAVIGATION_RUN_ASCA.href}
        shine={true}
      />
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
        <MenuIcon aria-hidden="true" className="size-5" />
      </Button>
      {isOpen ? (
        <nav
          id="mobile-header-navigation"
          aria-label="Mobile navigation"
          className="absolute top-12 left-0 z-50 grid min-w-48 gap-1 rounded-md border bg-popover p-2 text-popover-foreground shadow-lg"
        >
          <HeaderNavLink
            key={HEADER_NAVIGATION_ABOUT_ASCA.href}
            item={HEADER_NAVIGATION_ABOUT_ASCA}
            isActive={pathname === HEADER_NAVIGATION_ABOUT_ASCA.href}
            shine={false}
          />
          <HeaderNavLink
            key={HEADER_NAVIGATION_RUN_ASCA.href}
            item={HEADER_NAVIGATION_RUN_ASCA}
            isActive={pathname === HEADER_NAVIGATION_RUN_ASCA.href}
            shine={true}
          />
        </nav>
      ) : null}
    </div>
  )
}

/** Link to the A.S.C.A. GitHub repository. */
export function ASCARepositoryLink() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
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
            <GithubIcon aria-hidden="true" className="size-5" />
          </a>
        }
      />
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
      <TooltipTrigger
        render={
          <Button
            aria-label={label}
            title={label}
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(nextTheme)}
          >
            <Icon aria-hidden="true" className="size-5" />
          </Button>
        }
      />
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

/** Sign in link. */
export function SignInLink() {
  return (
    <Link
      href="/login"
      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
    >
      Sign In
    </Link>
  )
}

function getAvatarFallback(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

type HeaderAuthControlProps = {
  session: UserSession | null
}

/** Header authentication area for signed-out and authenticated users. */
export function HeaderAuthControl({ session }: HeaderAuthControlProps) {
  if (session?.status !== "authenticated") {
    return <SignInLink />
  }

  const { user } = session
  const fallback = getAvatarFallback(user.name)

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="lg"
            aria-label={`Account menu for ${user.name}`}
            className="max-w-[12rem] gap-2 px-2 sm:max-w-[16rem]"
          >
            <Avatar aria-label={user.name} size="default">
              <ShineBorder
                borderWidth={2}
                duration={7}
                shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              />
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name} />
              ) : (
                <AvatarFallback>{fallback}</AvatarFallback>
              )}
            </Avatar>
            <span className="hidden min-w-0 flex-col items-start text-left leading-tight sm:flex">
              <span className="max-w-28 truncate text-xs font-medium text-foreground">
                {user.name}
              </span>
              <span className="max-w-32 truncate text-[0.6875rem] text-muted-foreground">
                {user.email}
              </span>
            </span>
          </Button>
        }
      />
      <PopoverContent align="end" sideOffset={8} aria-label={user.name}>
        <PopoverHeader>
          <PopoverTitle>{user.name}</PopoverTitle>
          <PopoverDescription>{user.email}</PopoverDescription>
        </PopoverHeader>
        <form action={signOutOfGoogle}>
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Sign Out
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}
