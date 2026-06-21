# Research: Layout

## Decision: Use the App Router root layout for global composition

**Rationale**: Installed Next.js 16.2.6 docs state that layouts are shared UI and the root layout is required to contain `html` and `body`. The existing project already has `app/layout.tsx`, so the fixed header and main content wrapper should be composed there while route pages remain focused on page content.

**Alternatives considered**: A page-level wrapper was rejected because it would duplicate layout behavior across routes and would not guarantee global consistency. Nested route layouts were rejected because this feature applies to every page, not only a route subset.

## Decision: Keep pages as Server Components and isolate interactive header behavior

**Rationale**: Installed Next.js Server and Client Components docs recommend Server Components by default and Client Components only for state, event handlers, browser APIs, and hooks. The header contains interactive menu and theme behavior, so those pieces should be client-side while static placeholder pages and most route content remain server-rendered.

**Alternatives considered**: Making the entire root layout a Client Component was rejected because it expands the client bundle unnecessarily. Implementing theme switching without client behavior was rejected because users need immediate interaction.

## Decision: Use Next.js links for internal navigation and normal external linking for GitHub

**Rationale**: Installed Next.js navigation docs describe `<Link>` as the optimized path for client-side transitions and prefetching. Internal navigation for `/about` and `/run` should use that behavior. The GitHub repository is external and should open in a new tab without replacing the current app.

**Alternatives considered**: Plain anchors for internal routes were rejected because they lose App Router client-side navigation benefits. A custom router abstraction was rejected because two static routes do not justify extra indirection.

## Decision: Use Tailwind CSS and existing local UI primitives

**Rationale**: The constitution requires preferring shadcn/ui components and Tailwind utilities already present in the project. The repository already includes Tailwind CSS, `components/ui/button.tsx`, and icon components for menu, theme, and GitHub actions.

**Alternatives considered**: CSS Modules were considered but rejected for this feature because the existing app styles are utility-driven. Adding a new component library was rejected because it conflicts with local conventions.

## Decision: Add/configure required test tooling during implementation

**Rationale**: The constitution requires Jest unit tests, Playwright end-to-end tests, TDD, and at least 80% coverage for changed behavior. The current `package.json` does not configure Jest or Playwright, so implementation cannot satisfy the quality gates until those tools are added or configured.

**Alternatives considered**: Relying only on lint, typecheck, and build was rejected because it would violate the constitution. Manual-only validation was rejected because the spec explicitly requires automated tests for changed behavior.

## Decision: No backend interaction or asynchronous UI states are needed

**Rationale**: The feature is limited to global layout, static placeholder pages, navigation, theme switching, an external link, and a placeholder login button. The spec explicitly states no backend interaction and no user-facing asynchronous behavior for this feature.

**Alternatives considered**: Adding authentication or backend-backed theme persistence was rejected as out of scope.
