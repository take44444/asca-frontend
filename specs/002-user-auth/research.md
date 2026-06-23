# Research: User Authentication

## Decision: Use Auth.js/next-auth v5 with Google provider and JWT sessions

**Rationale**: The project constitution names Auth.js as the standard authentication tool when auth is required, and the local package already declares `next-auth` 5.0.0 beta. The installed `next-auth` type docs show App Router support through a root `auth.ts` export, `handlers` for `app/api/auth/[...nextauth]/route.ts`, and `auth`, `signIn`, and `signOut` helpers. The spec also requires Google sign-in, profile data, no database-backed sessions, and session refresh behavior, which aligns with Auth.js provider and JWT session support.

**Alternatives considered**:

- Custom OAuth and JWT handling with manual cookies: rejected because Next.js docs recommend an authentication library for security and simplicity, and custom refresh/session logic would add unnecessary risk.
- Database sessions: rejected because the spec explicitly requires no application database for session storage.
- Multiple auth providers: rejected because the spec and assumptions only require Google.

## Decision: Place shared auth configuration in root `auth.ts`

**Rationale**: The installed `next-auth` docs show initializing once in `auth.ts` and exporting `handlers`, `auth`, `signIn`, and `signOut`. A root module gives Server Components, Route Handlers, server actions, tests, and optional Proxy a single typed source of truth.

**Alternatives considered**:

- Configure auth only inside the route handler: rejected because header rendering, `/run` protection, sign-in, and sign-out need shared helpers.
- Place auth config under `lib/`: workable, but less aligned with the installed package examples and may require more verbose route handler exports.

## Decision: Expose OAuth endpoints through an App Router Route Handler

**Rationale**: Next.js 16 docs state Route Handlers are the App Router equivalent of Pages API routes and are defined with `route.ts` under `app`. Auth.js v5 exposes `handlers` that map directly to `GET` and `POST`, which fits `app/api/auth/[...nextauth]/route.ts`.

**Alternatives considered**:

- Pages Router API route: rejected because the app uses the App Router and the constitution requires App Router conventions.
- Client-only auth calls without route handlers: rejected because provider callbacks and session cookies require server-managed endpoints.

## Decision: Protect `/run` with server-side session checks and `redirect('/login')`

**Rationale**: Next.js docs allow `redirect` in Server Components and Route Handlers, and the `/run` page is a Server Component by default. A server-side check prevents protected content from rendering for signed-out users. Next.js 16 docs rename Middleware to Proxy and caution that Proxy should not be the only authorization layer; it can be used only for optimistic redirects if implementation tasks need pre-render filtering.

**Alternatives considered**:

- Client-side redirect after render: rejected because protected content could briefly appear and the redirect would depend on hydration.
- Proxy-only protection: rejected because Next.js docs say Proxy is not a full session management or authorization solution.

## Decision: Keep auth UI in existing header/layout component boundaries

**Rationale**: The existing layout feature owns `components/layout/app-header.tsx` and `components/layout/header-item.tsx`. Extending that boundary keeps responsive navigation, theme controls, and header actions together, while dedicated UI primitives (`Avatar`, `Popover`, `Card`, `Button`) remain reusable under `components/ui`.

**Alternatives considered**:

- Create a separate auth header mounted outside the shared header: rejected because it would duplicate layout state and increase responsive behavior risk.
- Put all auth UI directly in `app/layout.tsx`: rejected because it would make the root layout too interactive and less consistent with the current component structure.

## Decision: Mock provider/session boundaries in automated tests

**Rationale**: Real Google OAuth cannot be completed deterministically in CI without external credentials and browser interaction. Unit tests should mock `auth`, `signIn`, and `signOut`; Playwright should verify signed-out redirect and use deterministic session mocking or controlled test hooks for signed-in UI and `/run` access.

**Alternatives considered**:

- Run live Google OAuth in e2e tests: rejected due to credential, rate-limit, and flakiness risks.
- Skip e2e auth coverage: rejected by the constitution and success criteria.
