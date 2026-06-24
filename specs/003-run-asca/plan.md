# Implementation Plan: Run A.S.C.A.

**Branch**: `003-run-asca` | **Date**: 2026-06-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-run-asca/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build the authenticated Run A.S.C.A. workspace as a focused chat page with one demonstration thread, a stable thread list, independently scrolling conversation messages, anchored text prompt entry, markdown message rendering, copy feedback, visible loading/error/empty/success states, and no persistent thread creation. The service boundary is a typed Next.js App Router Route Handler that uses AI SDK with OpenAI, reads the model from `ASCA_MODEL`, and returns text responses for the selected thread.

## Technical Context

**Language/Version**: TypeScript 5 with React 19.2.4 and Next.js 16.2.6

**Primary Dependencies**: Next.js App Router, React, Auth.js via `next-auth` 5.0.0 beta, Tailwind CSS 4, shadcn/ui-style local components, `@base-ui/react`, `lucide-react`, `react-markdown`, `remark-gfm`, `remark-breaks`, `use-stick-to-bottom`, `@ai-sdk/openai` 3.0.74, and new `ai` package for `generateText`

**Storage**: No persistent storage. The demonstration thread and messages are client-side runtime state for this feature scope; Auth.js JWT session cookies remain the only session persistence.

**Testing**: Jest 30 with Testing Library for unit/component/route behavior, Playwright 1.61 for end-to-end authenticated chat behavior, plus `npm run lint`, `npm run format`, `npm run typecheck`, `npm run test`, `npm run test:coverage`, `npm run test:e2e`, and `npm run build`

**Target Platform**: Modern desktop browsers supported by installed Next.js defaults: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

**Project Type**: A.S.C.A. frontend web application using the Next.js App Router

**Performance Goals**: The protected `/run` page renders without whole-page vertical scrolling at supported desktop sizes; valid prompts appear in the thread immediately; the exact `A.S.C.A. is thinking...` state appears within 1 second; successful responses append as the latest visible message; copy feedback appears immediately after clipboard success.

**Constraints**: `/run` remains authenticated through the existing auth session; the route handler must not expose `OPENAI_API_KEY` or provider internals to the client; `ASCA_MODEL` selects the model and tests set it to `gpt-5.4-nano`; empty prompts are rejected; duplicate submissions are prevented while a response is pending; no persistent thread fetching, real thread creation, or multimodal input is included.

**Scale/Scope**: One protected chat page, one demonstration thread, one typed chat Route Handler, local chat state, focused UI components/hooks, API/UI contracts, and unit/e2e coverage for the three user stories.

**Next.js Docs Consulted**:

- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
- `node_modules/next/dist/docs/01-app/02-guides/redirecting.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md`

**AI SDK Docs Consulted**:

- `node_modules/@ai-sdk/openai/README.md`
- `node_modules/@ai-sdk/openai/docs/03-openai.mdx`
- `node_modules/@ai-sdk/openai/dist/index.d.ts`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **TDD**: PASS. Tasks must add failing Jest tests for chat state, prompt validation, copy success/failure, route validation, model env usage, pending/error rendering, and authenticated `/run` rendering before production code changes; Playwright tests must cover the signed-in chat flow and layout behavior.
- **Quality Gates**: PASS. The plan requires lint, format, typecheck, unit tests, coverage, e2e tests, and production build. Changed chat behavior must maintain at least 80% coverage.
- **Type Safety**: PASS. The request/response contract, message model, thread model, service errors, and component props must use explicit TypeScript types; no `any` is permitted.
- **Next.js Guidance**: PASS. Installed-version docs for Route Handlers, Backend for Frontend, Server/Client Components, authentication, and redirects were consulted and are listed above.
- **Frontend Boundary**: PASS. This feature uses a frontend-owned Backend-for-Frontend route to call OpenAI directly for the scoped development implementation. It does not reimplement backend orchestration, persistent threads, agent tools, or multimodal execution.

## Project Structure

### Documentation (this feature)

```text
specs/003-run-asca/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── api-contract.md
│   └── ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── api/
│   └── asca/
│       └── chat/
│           └── route.ts
└── run/
    ├── page.tsx
    └── run-asca-chat.tsx

components/
├── run-asca/
│   ├── chat-message.tsx
│   ├── conversation-panel.tsx
│   ├── thread-list.tsx
│   └── types.ts
└── ui/
    ├── button.tsx
    ├── markdown.tsx
    ├── message.tsx
    ├── prompt-input.tsx
    ├── scroll-button.tsx
    └── textarea.tsx

lib/
├── asca-chat.ts
├── auth-session.ts
└── utils.ts

tests/
├── e2e/
│   └── run-asca.spec.ts
└── unit/
    ├── asca-chat-route.test.ts
    ├── run-asca-chat.test.tsx
    └── run-page-auth.test.tsx
```

**Structure Decision**: Use the existing single Next.js App Router application. `/run/page.tsx` remains a Server Component that performs the existing session check and renders a dedicated Client Component for interactive chat. The OpenAI call stays server-side in `app/api/asca/chat/route.ts`; shared request/response validation and typed helpers live in `lib/asca-chat.ts`. Feature-specific UI composition belongs under `components/run-asca/` while existing reusable primitives stay in `components/ui/`.

## Complexity Tracking

No constitution violations require complexity exceptions.

## Phase 0: Research

Research output is captured in [research.md](./research.md). All technical unknowns are resolved with no remaining `NEEDS CLARIFICATION` markers.

## Phase 1: Design & Contracts

Design artifacts generated:

- [data-model.md](./data-model.md)
- [contracts/api-contract.md](./contracts/api-contract.md)
- [contracts/ui-contract.md](./contracts/ui-contract.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- **TDD**: PASS. The contracts and quickstart define observable failing-first tests for prompt submission, processing state, successful response, route failures, copy feedback, scroll behavior, and authenticated route access.
- **Quality Gates**: PASS. Quickstart includes lint, format, typecheck, unit tests, coverage, e2e tests, and build. Real OpenAI calls are isolated behind the route and mocked in tests.
- **Type Safety**: PASS. Data model and API contract define typed entities, request/response shapes, validation rules, and state transitions without `any`.
- **Next.js Guidance**: PASS. The design uses Route Handlers for the public BFF endpoint, a Server Component for protected route rendering, and a Client Component boundary for chat state and browser APIs.
- **Frontend Boundary**: PASS. Direct OpenAI access is intentionally limited to a frontend BFF route for this feature; persistent agent orchestration, tools, and thread storage remain out of scope.
