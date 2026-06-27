# Implementation Plan: Event View

**Branch**: `007-event-view` | **Date**: 2026-06-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/007-event/spec.md`

## Summary

Add a read-only Events card for the selected Run A.S.C.A. thread below the metadata summaries and to the right of the conversation on wide screens. The client uses typed local fixtures: the live demonstration thread has 20 varied events and every other demonstration thread has three. The card uses the existing Item, Badge, Card, and source-logo components, switches with thread selection, scrolls independently, and adds no backend interaction.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4, Next.js 16.2.6 App Router

**Primary Dependencies**: React, Next.js App Router, Tailwind CSS 4, shadcn/ui Card/Item/Badge, existing application logo components

**Storage**: N/A; event records are deterministic frontend fixtures

**Testing**: Jest, React Testing Library, Playwright, Jest coverage

**Target Platform**: Modern browsers supported by installed Next.js 16.2.6 documentation: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

**Project Type**: A.S.C.A. frontend web application using the Next.js App Router

**Performance Goals**: Render and switch between at most 20 local event items without visible delay or layout shift; preserve smooth independent scrolling for event and conversation viewports

**Constraints**: No event backend request, persistence, loading state, error state, navigation, or item activation; preserve existing chat, thread, metadata, and authentication behavior; prevent content overlap at supported widths

**Scale/Scope**: One authenticated Run A.S.C.A. workspace, 20 threads, one selected thread, 20 events for the live demonstration thread, three events for each static thread

## Constitution Check

*GATE: Passes before Phase 0 research. Re-checked after Phase 1 design: passes.*

- **TDD**: Unit and end-to-end tests are planned before production changes for fixture counts, thread switching, icon mapping, optional thread labels, responsive layout, and independent scrolling.
- **Quality Gates**: Implementation must pass `npm run format`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:coverage`, `npm run test:e2e`, and `npm run build`; changed behavior must maintain at least 80% coverage.
- **Type Safety**: Event source, event record, fixture map, and component props have explicit stable types. No `any` is introduced; exported public types/functions receive docstrings.
- **Next.js Guidance**: Installed-version docs consulted: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `node_modules/next/dist/docs/03-architecture/accessibility.md`.
- **Frontend Boundary**: Events are local fixtures and require no backend API. Existing `/api/asca/chat` remains unchanged and is the only Run A.S.C.A. backend interaction.

## Project Structure

### Documentation (this feature)

```text
specs/007-event/
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
├── event-fixtures.ts
├── event-view.tsx
└── types.ts

tests/
├── e2e/run-asca.spec.ts
└── unit/run-asca-chat.test.tsx
```

**Structure Decision**: Extend the existing Run A.S.C.A. client workspace and test suites. Keep event types and fixtures alongside existing thread data and compose a focused event view into the current selected-thread flow.

## Complexity Tracking

No constitution violations.
