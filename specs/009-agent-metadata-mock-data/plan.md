# Implementation Plan: Agent Metadata Summary Content

**Branch**: `009-agent-metadata-mock-data` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/009-agent-metadata-mock-data/spec.md`

## Summary

Replace the knowledge, social, and artifact count-only metadata fixtures with typed deterministic record collections and render those records as compact, read-only `ItemGroup` lists inside their existing summary cards. Each list uses the card's bounded content height and independent vertical scrolling; knowledge text and player/artifact names truncate, social avatars use local initials only, artifact types map exhaustively to existing file icons, and the token summary remains unchanged.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4, Next.js 16.2.6 App Router

**Primary Dependencies**: React, Next.js App Router, Tailwind CSS 4, shadcn/ui Card/Item/Avatar, existing Lucide file icon components

**Storage**: N/A; metadata records are deterministic frontend fixtures

**Testing**: Jest, React Testing Library, Playwright, Jest coverage

**Target Platform**: Modern browsers supported by installed Next.js 16.2.6 documentation: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

**Project Type**: A.S.C.A. frontend web application using the Next.js App Router

**Performance Goals**: Render 14 knowledge items, eight players, and three artifacts without visible delay or card layout shift; keep each overflowing list responsive during independent scrolling

**Constraints**: No backend or remote avatar request, persistence, loading/error state, item activation, navigation, selection, or token-summary behavior change; preserve existing responsive content availability and prevent metadata cards from overlapping adjacent workspace content

**Scale/Scope**: One authenticated Run A.S.C.A. workspace; four existing metadata cards; 14 knowledge records, eight player records, three artifact records, and the unchanged seven-point token trend

## Constitution Check

*GATE: Passes before Phase 0 research. Re-checked after Phase 1 design: passes.*

- **TDD**: Unit and end-to-end tests are planned before production changes for typed fixture records and derived totals, list structure/content, initials fallbacks, icon mapping, truncation, read-only behavior, responsive availability, and independent scrolling.
- **Quality Gates**: Implementation must pass `npm run format`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:coverage`, `npm run test:e2e`, and `npm run build`; changed behavior must maintain at least 80% coverage.
- **Type Safety**: Knowledge item, social player, artifact type, artifact record, summary aggregates, initials helper, and component props use explicit stable types. No `any` is introduced; exported public types/functions receive docstrings.
- **Next.js Guidance**: Installed-version docs consulted: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`, `node_modules/next/dist/docs/01-app/02-guides/testing/jest.md`, `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`, and `node_modules/next/dist/docs/03-architecture/accessibility.md`.
- **Frontend Boundary**: All new content is local fixture data. No backend API exists or is required; `/api/asca/chat`, authentication, environment credentials, and remote image retrieval remain unchanged.

## Project Structure

### Documentation (this feature)

```text
specs/009-agent-metadata-mock-data/
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
app/run/run-asca-chat.tsx

components/run-asca/
├── agent-metadata-fixtures.ts
├── agent-metadata-summary-card.tsx
└── types.ts

components/ui/
├── avatar.tsx
└── item.tsx

components/icons/
├── lucide-file-image.tsx
└── lucide-file-text.tsx

tests/
├── e2e/run-asca.spec.ts
└── unit/run-asca-chat.test.tsx
```

**Structure Decision**: Extend the existing Run A.S.C.A. metadata fixtures, summary-card composition, and established unit/end-to-end suites. Reuse the current UI and icon primitives without adding a parallel component system or new route.

## Complexity Tracking

No constitution violations.
