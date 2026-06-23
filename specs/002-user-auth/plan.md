# Implementation Plan: User Authentication

**Branch**: `002-user-auth` | **Date**: 2026-06-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-user-auth/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement Google authentication for the A.S.C.A. frontend: `/login` starts Google sign-in, successful sign-in returns users to `/`, the global header swaps the sign-in entry for an authenticated profile popover with sign-out, and `/run` redirects unauthenticated users to `/login`. The technical approach uses the existing Next.js App Router application, Auth.js/`next-auth` v5 JWT sessions with the Google provider, an App Router auth route handler, server-side session checks for protected rendering, and the existing shadcn-style UI primitives and layout components.

## Technical Context

**Language/Version**: TypeScript 5 with React 19.2.4 and Next.js 16.2.6

**Primary Dependencies**: Next.js App Router, React, Auth.js via `next-auth` 5.0.0 beta, Google OAuth provider, Tailwind CSS 4, shadcn/ui-style local components, `@base-ui/react`, existing icon components, `next-themes`

**Storage**: No application database for sessions. Authentication uses stateless JWT session cookies managed by Auth.js, containing the minimum profile data needed by the UI.

**Testing**: Jest 30 with Testing Library for unit/component behavior, Playwright 1.61 for end-to-end auth routing and header behavior, plus `npm run lint`, `npm run format`, `npm run typecheck`, and `npm run build`

**Target Platform**: Modern browsers supported by installed Next.js defaults: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

**Project Type**: A.S.C.A. frontend web application using the Next.js App Router

**Performance Goals**: `/login` renders without backend application data fetching; authenticated header state appears on initial page render after session lookup; unauthenticated `/run` access redirects before protected content is visible; sign-in and sign-out actions complete in one user action after provider interaction.

**Constraints**: Use Google as the only identity provider; require `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `AUTH_SECRET` outside source control; do not add database-backed sessions; do not reimplement A.S.C.A. backend behavior; preserve fixed responsive header behavior; expose accessible loading, error, signed-out, and signed-in states.

**Scale/Scope**: One login page, one Auth.js configuration module, one App Router auth route handler, one protected page, header authentication state, sign-in/sign-out actions, focused unit/e2e tests, and no A.S.C.A. agent execution API work.

**Next.js Docs Consulted**:

- `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`
- `node_modules/next/dist/docs/01-app/02-guides/redirecting.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

**Auth Library Docs Consulted**:

- `node_modules/next-auth/index.d.ts`
- `node_modules/next-auth/lib/index.d.ts`
- `node_modules/next-auth/jwt.d.ts`
- `node_modules/next-auth/providers/google.d.ts`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **TDD**: PASS. Tasks must add failing Jest tests for login page rendering, sign-in/sign-out actions, authenticated header profile state, avatar fallback, and `/run` protection before production changes; Playwright tests must cover signed-out redirect and mocked/simulated signed-in access.
- **Quality Gates**: PASS. The plan requires lint, format, typecheck, unit tests, e2e tests, build, and coverage verification for changed behavior. The repository currently declares Jest and Playwright scripts; tasks must verify the existing local test setup remains runnable after auth changes.
- **Type Safety**: PASS. Auth session/user data must be typed through Auth.js module augmentation or explicit local DTOs; no `any` is permitted, and exported components/actions must have stable typed contracts and docstrings where required by the constitution.
- **Next.js Guidance**: PASS. Installed-version Next.js docs for authentication, Route Handlers, Proxy, redirects, and Server/Client Components were consulted and are listed above.
- **Frontend Boundary**: PASS. No A.S.C.A. backend API dependency is introduced. Auth provider and session handling are frontend-owned integration boundaries, and `/run` remains a protected frontend page until backend run contracts are specified separately.

## Project Structure

### Documentation (this feature)

```text
specs/002-user-auth/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
auth.ts
proxy.ts

app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts
├── login/
│   └── page.tsx
├── layout.tsx
└── run/
    └── page.tsx

components/
├── icons/
│   └── akar-icons-google-fill.tsx
├── layout/
│   ├── app-header.tsx
│   └── header-item.tsx
└── ui/
    ├── avatar.tsx
    ├── button.tsx
    ├── card.tsx
    └── popover.tsx

lib/
├── auth-actions.ts
└── auth-session.ts

tests/
├── e2e/
│   └── auth.spec.ts
└── unit/
    ├── app-header-auth.test.tsx
    ├── auth-actions.test.ts
    └── login-page.test.tsx
```

**Structure Decision**: Use the existing single Next.js App Router application. Auth.js configuration belongs at repository root in `auth.ts` so route handlers, server components, and optional Proxy can import one shared contract. Provider callbacks live in the Auth.js configuration. The login page belongs under `app/login/page.tsx`; the OAuth route handler belongs under `app/api/auth/[...nextauth]/route.ts`; `/run` protection belongs in `app/run/page.tsx` or shared server session helpers. Header changes stay in `components/layout/` to preserve the existing layout boundary. UI primitives continue under `components/ui/`.

## Complexity Tracking

No constitution violations require complexity exceptions.

## Phase 0: Research

Research output is captured in [research.md](./research.md). All technical unknowns are resolved with no remaining `NEEDS CLARIFICATION` markers.

## Phase 1: Design & Contracts

Design artifacts generated:

- [data-model.md](./data-model.md)
- [contracts/ui-contract.md](./contracts/ui-contract.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- **TDD**: PASS. The UI contract and quickstart define observable behaviors to test before implementation, including provider initiation, redirects, profile display, sign-out, and protected route access.
- **Quality Gates**: PASS. Quickstart requires lint, format, typecheck, unit tests, coverage, e2e tests, and production build. Tasks must record any local provider credential limitation and use deterministic mocks where real Google OAuth cannot run in CI.
- **Type Safety**: PASS. Data model defines authenticated user/session shapes, validation rules, and state transitions that tasks must encode without `any`.
- **Next.js Guidance**: PASS. Design choices align with installed Next.js docs: App Router Route Handlers for auth endpoints, `redirect` for protected Server Component redirects, and Proxy only as an optional optimistic redirect layer.
- **Frontend Boundary**: PASS. The feature does not add A.S.C.A. backend API calls. Authentication is handled through Google/Auth.js, and the run page remains a frontend-protected route.
