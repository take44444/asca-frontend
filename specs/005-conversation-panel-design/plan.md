# Implementation Plan: Conversation Panel Design

**Branch**: `005-conversation-panel-design` | **Date**: 2026-06-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-conversation-panel-design/spec.md`

## Summary

Redesign the authenticated Run A.S.C.A. chat surface into a bounded conversation panel with header, scrollable messages, and anchored prompt entry, then add static thread metadata summaries for tasks, artifacts, knowledge, and seven-day token usage. The implementation stays frontend-only, preserves the existing chat state machine and `/api/asca/chat` route behavior, and uses typed mock metadata plus the existing shadcn/Tailwind/Recharts UI stack.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4, Next.js 16.2.6 App Router

**Primary Dependencies**: Next.js App Router, `@ai-sdk/react`, `ai`, Tailwind CSS 4, shadcn/ui components, lucide icons, Recharts 3.8.0, `use-stick-to-bottom`

**Storage**: N/A. Metadata is static/mock data and existing chat state remains client-local.

**Testing**: Jest, React Testing Library, Playwright, Jest coverage

**Target Platform**: Modern browsers supported by installed Next.js 16.2.6 docs: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

**Project Type**: A.S.C.A. frontend web application using the Next.js App Router

**Performance Goals**: Maintain responsive chat input and smooth independent message scrolling while rendering static metadata and a small seven-point token chart.

**Constraints**: Preserve existing message sending, streaming, error, markdown, copy, and scroll behavior; do not add live task, artifact, knowledge, or token fetching; prevent overlapping controls/text across supported desktop and mobile widths.

**Scale/Scope**: One authenticated Run A.S.C.A. chat page, one active demonstration thread, four metadata summaries, one seven-day token usage trend, existing unit and E2E test coverage expanded for changed UI behavior.

## Constitution Check

*GATE: Passes before Phase 0 research. Re-checked after Phase 1 design: passes.*

- **TDD**: Tests are planned before implementation for the conversation panel shell, static metadata summaries, token trend interaction, responsive layout, and preserved chat workflows.
- **Quality Gates**: Implementation must pass `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:coverage`, `npm run test:e2e`, and `npm run build`; changed behavior must maintain at least 80% coverage.
- **Type Safety**: New metadata fixtures and component props must be explicitly typed. No new `any` is permitted. Exported reusable types/functions require docstrings.
- **Next.js Guidance**: Installed-version docs consulted: `node_modules/next/dist/docs/01-app/index.md`, `node_modules/next/dist/docs/03-architecture/accessibility.md`, and `node_modules/next/dist/docs/03-architecture/supported-browsers.md`.
- **Frontend Boundary**: No new backend API dependency. Existing chat route remains the only backend interaction and is preserved.

## Project Structure

### Documentation (this feature)

```text
specs/005-conversation-panel-design/
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
├── run/
│   ├── page.tsx
│   └── run-asca-chat.tsx
└── globals.css

components/
├── run-asca/
│   ├── chat-message.tsx
│   ├── conversation-panel.tsx
│   ├── thread-list.tsx
│   └── types.ts
└── ui/
    ├── chart.tsx
    ├── prompt-input.tsx
    └── scroll-button.tsx

tests/
├── e2e/
│   └── run-asca.spec.ts
└── unit/
    ├── run-asca-chat.test.tsx
    └── run-asca-test-helpers.ts
```

**Structure Decision**: Use the existing A.S.C.A. frontend web application structure. The feature should extend `app/run/run-asca-chat.tsx` and `components/run-asca/*` without introducing new routing, backend service modules, or a parallel UI component system.

## Complexity Tracking

No constitution violations.
