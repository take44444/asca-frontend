export type CoreRoute = "/about" | "/run"

export type HeaderNavigationItem = {
  label: "About A.S.C.A." | "Run A.S.C.A."
  href: CoreRoute
}

export type HeaderExternalAction = {
  label: "Visit GitHub Repository"
  href: "https://github.com/take44444/asca"
}

/** Core header destinations for the A.S.C.A. frontend layout. */
export const HEADER_NAVIGATION_ITEMS: HeaderNavigationItem[] = [
  {
    label: "About A.S.C.A.",
    href: "/about",
  },
  {
    label: "Run A.S.C.A.",
    href: "/run",
  },
]

/** External repository action surfaced from the global header. */
export const GITHUB_ACTION: HeaderExternalAction = {
  label: "Visit GitHub Repository",
  href: "https://github.com/take44444/asca",
}
