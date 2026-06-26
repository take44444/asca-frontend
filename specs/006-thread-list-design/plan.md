# Implementation Plan: Thread List Design

**Branch**: `006-thread-list-design` | **Date**: 2026-06-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-thread-list-design/spec.md`

## Summary

Redesign the existing Run A.S.C.A. left-side thread list into a bounded card-based navigation surface with a disabled "Create New Thread" action, 20 static demonstration threads, visible message counts, selected-thread styling, and independent list scrolling. Thread selection remains frontend-only and updates the existing right-side conversation panel without adding backend thread fetching or changing the existing chat route behavior.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4, Next.js 16.2.6 App Router

**Primary Dependencies**: Next.js App Router, `@ai-sdk/react`, `ai`, Tailwind CSS 4, shadcn/ui `Card` and `Button`, lucide-style message-plus icon, `use-stick-to-bottom`

**Storage**: N/A. Thread entries and non-active thread content are static frontend demonstration data; the active chat state remains client-local.

**Testing**: Jest, React Testing Library, Playwright, Jest coverage

**Target Platform**: Modern browsers supported by installed Next.js 16.2.6 docs: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

**Project Type**: A.S.C.A. frontend web application using the Next.js App Router

**Performance Goals**: Render 20 static thread entries without visible layout shift, keep thread selection immediate, and preserve smooth independent scrolling for both the thread list and conversation message viewport.

**Constraints**: Preserve existing chat sending, streaming, error, markdown, copy, metadata, auth redirect, and conversation scroll behavior; do not fetch live thread data; do not enable thread creation; prevent overlapping text and controls across supported desktop and mobile widths.

**Scale/Scope**: One authenticated Run A.S.C.A. chat page, 20 static demonstration threads, one selected thread at a time, existing Run A.S.C.A. unit and E2E coverage expanded for thread navigation.

## Constitution Check

*GATE: Passes before Phase 0 research. Re-checked after Phase 1 design: passes.*

- **TDD**: Tests are planned before implementation for 20 demo threads, disabled create action, thread selection, selected state, independent thread-list scrolling, and preserved conversation behavior.
- **Quality Gates**: Implementation must pass `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:coverage`, `npm run test:e2e`, and `npm run build`; changed behavior must maintain at least 80% coverage.
- **Type Safety**: Static thread fixtures, updated thread identifiers, and component props must be explicitly typed. No new `any` is permitted. Exported reusable types/functions require docstrings.
- **Next.js Guidance**: Installed-version docs consulted: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`, `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, and `node_modules/next/dist/docs/03-architecture/accessibility.md`.
- **Frontend Boundary**: No new backend API dependency. Existing `/api/asca/chat` route remains the only backend interaction and continues to receive the selected thread id for chat submissions.

## Project Structure

### Documentation (this feature)

```text
specs/006-thread-list-design/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md             # Created later by /speckit-tasks
```

### Source Code (repository root)

```text
app/
└── run/
    ├── page.tsx
    └── run-asca-chat.tsx

components/
├── run-asca/
│   ├── chat-message.tsx
│   ├── conversation-panel.tsx
│   ├── thread-list.tsx
│   ├── thread-metadata-fixtures.ts
│   ├── thread-metadata-summary-card.tsx
│   ├── token-usage-trend.tsx
│   └── types.ts
├── icons/
│   └── lucide-message-square-plus.tsx
└── ui/
    ├── button.tsx
    └── card.tsx

tests/
├── e2e/
│   └── run-asca.spec.ts
└── unit/
    ├── run-asca-chat.test.tsx
    └── run-asca-test-helpers.ts
```

**Structure Decision**: Extend the existing A.S.C.A. frontend web application structure. The feature should update the current `RunAscaChat` state/data flow and `ThreadList` component instead of introducing a new route, backend module, or parallel navigation system.

## Complexity Tracking

No constitution violations.
