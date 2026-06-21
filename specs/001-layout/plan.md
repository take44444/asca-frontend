# Implementation Plan: Layout

**Branch**: `001-layout` | **Date**: 2026-06-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-layout/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement the shared A.S.C.A. frontend layout: a fixed full-width header, main content area, core navigation for "About A.S.C.A." and "Run A.S.C.A.", a GitHub link, a light/dark theme toggle, a placeholder login button, responsive collapsed navigation, and placeholder destination pages. The technical approach uses the existing Next.js App Router root layout, Tailwind CSS, existing shadcn-style UI primitives, existing icon components, and a small client-side header/navigation component for theme and menu interactions.

## Technical Context

**Language/Version**: TypeScript 5 with React 19.2.4 and Next.js 16.2.6

**Primary Dependencies**: Next.js App Router, React, Tailwind CSS 4, shadcn/ui-style local components, `@base-ui/react`, `next-themes`, existing icon components under `components/icons/`

**Storage**: N/A for backend or persistent application data. Theme preference may be handled by existing `next-themes` client behavior.

**Testing**: Current scripts provide `npm run lint`, `npm run format`, `npm run typecheck`, and `npm run build`. Jest and Playwright are required by the constitution but are not configured yet; implementation tasks must add or configure them before behavior tests can satisfy the TDD and coverage gates.

**Target Platform**: Modern browsers supported by installed Next.js defaults: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

**Project Type**: A.S.C.A. frontend web application using the Next.js App Router

**Performance Goals**: Header and static placeholder pages should render with no backend wait; navigation between the two static core pages should complete in one user interaction and feel immediate through App Router links and prefetching.

**Constraints**: Header must remain fixed without hiding main content, controls must not overlap at mobile widths, theme switching must keep readable contrast, no backend dependency is introduced, and login must remain a non-authenticating placeholder.

**Scale/Scope**: One global root layout, two placeholder content pages, one responsive header/navigation surface, one frontend-only theme preference interaction, and no A.S.C.A. backend API work.

**Next.js Docs Consulted**:

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`
- `node_modules/next/dist/docs/03-architecture/accessibility.md`
- `node_modules/next/dist/docs/03-architecture/supported-browsers.md`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **TDD**: PASS. Tasks must write failing tests before production changes for global layout rendering, active navigation, responsive menu behavior, theme toggle labeling, GitHub external link behavior, and placeholder login behavior.
- **Quality Gates**: PASS WITH REQUIRED SETUP. The repository already supports linting, formatting, type checking, and production build. Jest and Playwright are not configured; tasks must add/configure them and include changed-behavior coverage verification before implementation is complete.
- **Type Safety**: PASS. Plan requires explicit prop types for exported components and no `any`; UI contracts are modeled with typed route/navigation/header concepts.
- **Next.js Guidance**: PASS. Installed-version docs for App Router layouts/pages, navigation, Server/Client Components, CSS, accessibility, and supported browsers were consulted and are listed above.
- **Frontend Boundary**: PASS. No backend API inputs, outputs, errors, mocks, or coordination are required for this feature.

## Project Structure

### Documentation (this feature)

```text
specs/001-layout/
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
app/
├── about/
│   └── page.tsx
├── run/
│   └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── icons/
│   ├── line-md-github-loop.tsx
│   ├── lucide-menu.tsx
│   ├── lucide-moon.tsx
│   └── lucide-sun.tsx
├── layout/
│   ├── app-header.tsx
│   └── header-nav.tsx
├── theme-provider.tsx
└── ui/
    └── button.tsx

lib/
└── utils.ts

tests/
├── e2e/
│   └── layout.spec.ts
└── unit/
    └── app-header.test.tsx
```

**Structure Decision**: Use the existing single Next.js App Router application. Global layout composition belongs in `app/layout.tsx`; feature-owned reusable layout UI belongs under `components/layout/`; static placeholder pages belong under `app/about/page.tsx` and `app/run/page.tsx`. Test directories are listed as required target structure because the repository does not currently contain configured Jest or Playwright tests.

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

- **TDD**: PASS. Quickstart and UI contract identify observable behavior for tests, and implementation must create failing unit/e2e tests first.
- **Quality Gates**: PASS WITH REQUIRED SETUP. The design includes adding/configuring Jest and Playwright as prerequisite implementation work before changed behavior is complete.
- **Type Safety**: PASS. Data model and UI contract require explicit typed component props and route metadata.
- **Next.js Guidance**: PASS. Plan decisions align with the consulted installed Next.js App Router docs.
- **Frontend Boundary**: PASS. Design remains frontend-only and records that no backend API contract exists for this feature.
