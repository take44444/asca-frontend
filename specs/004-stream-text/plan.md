# Implementation Plan: Stream Text

**Branch**: `004-stream-text` | **Date**: 2026-06-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-stream-text/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Upgrade the authenticated Run A.S.C.A. chat from full-response JSON delivery to progressive text streaming. The existing text-only demonstration thread, route validation, authentication checks, anchored prompt, independent message scrolling, markdown rendering, and copy behavior remain in place; the route changes to a typed streamed text contract and the client reads response chunks into a single in-progress A.S.C.A. message that becomes complete when the stream closes or incomplete when it fails.

## Technical Context

**Language/Version**: TypeScript 5 with React 19.2.4 and Next.js 16.2.6

**Primary Dependencies**: Next.js App Router, React, Auth.js via `next-auth` 5.0.0 beta, Tailwind CSS 4, shadcn/ui-style local components, `@base-ui/react`, `lucide-react`, `react-markdown`, `remark-gfm`, `remark-breaks`, `use-stick-to-bottom`, `@ai-sdk/openai` 3.0.74, and `ai` 6.0.209 with `streamText`

**Storage**: No persistent storage. The demonstration thread and streamed response state remain client-side runtime state; Auth.js JWT session cookies remain the only session persistence.

**Testing**: Jest 30 with Testing Library for route/client behavior, Playwright 1.61 for authenticated streaming chat behavior, plus `npm run lint`, `npm run format`, `npm run typecheck`, `npm run test`, `npm run test:coverage`, `npm run test:e2e`, and `npm run build`

**Target Platform**: Modern desktop browsers supported by installed Next.js defaults: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

**Project Type**: A.S.C.A. frontend web application using the Next.js App Router

**Performance Goals**: Valid prompts appear in the thread immediately; users see either the existing `A.S.C.A. is thinking...` processing state or first streamed text within 1 second; text deltas append to one visible A.S.C.A. message as they arrive; users at the bottom stay at the latest streamed content; users who scroll away are not forced back to the bottom.

**Constraints**: `/run` remains authenticated; `POST /api/asca/chat` must not expose `OPENAI_API_KEY`, provider errors, or provider internals; `ASCA_MODEL` selects the model and tests set it to `gpt-5.4-nano`; empty prompts are rejected; duplicate submissions are prevented while a response is streaming; no persistent thread fetching, real thread creation, multimodal input, tool execution, or backend agent orchestration is included.

**Scale/Scope**: One protected chat page, one demonstration thread, one typed streaming chat Route Handler, local streamed message state, focused helper updates, API/UI contracts, and unit/e2e coverage for the three user stories.

**Next.js Docs Consulted**:

- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
- `node_modules/next/dist/docs/01-app/02-guides/redirecting.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md`

**AI SDK Docs Consulted**:

- `node_modules/ai/docs/07-reference/01-ai-sdk-core/02-stream-text.mdx`
- `node_modules/ai/docs/02-getting-started/02-nextjs-app-router.mdx`
- `node_modules/ai/docs/02-foundations/05-streaming.mdx`
- `node_modules/ai/docs/09-troubleshooting/15-stream-text-not-working.mdx`
- `node_modules/ai/docs/09-troubleshooting/14-stream-abort-handling.mdx`
- `node_modules/ai/docs/07-reference/01-ai-sdk-core/75-simulate-readable-stream.mdx`
- `node_modules/@ai-sdk/openai/README.md`
- `node_modules/@ai-sdk/openai/docs/03-openai.mdx`
- `node_modules/@ai-sdk/openai/dist/index.d.ts`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **TDD**: PASS. Tasks must add failing Jest tests for streamed route responses, `streamText` model usage, invalid/auth/config errors, client chunk accumulation, in-progress/completed/incomplete states, duplicate submission prevention during streaming, copy-current-text behavior, and scroll behavior before production code changes; Playwright must cover signed-in streaming chat.
- **Quality Gates**: PASS. The plan requires lint, format, typecheck, unit tests, coverage, e2e tests, and production build. Changed streaming behavior must maintain at least 80% coverage.
- **Type Safety**: PASS. Stream lifecycle, message status, request validation, error payloads, and component props must use explicit TypeScript types; no `any` is permitted.
- **Next.js Guidance**: PASS. Installed-version docs for Route Handlers, Backend for Frontend, Server/Client Components, authentication, redirects, and redirect API were consulted and are listed above.
- **Frontend Boundary**: PASS. This feature keeps the frontend-owned Backend-for-Frontend route as the only OpenAI-facing boundary for the scoped development implementation. It does not reimplement backend orchestration, persistent threads, agent tools, or multimodal execution.

## Project Structure

### Documentation (this feature)

```text
specs/004-stream-text/
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
    ├── text-shimmer.tsx
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
    ├── run-asca-test-helpers.ts
    └── run-page-auth.test.tsx
```

**Structure Decision**: Use the existing single Next.js App Router application. `/run/page.tsx` remains a Server Component that performs the existing session check and renders `RunAscaChat` as the Client Component boundary. `app/api/asca/chat/route.ts` changes from `generateText` JSON output to `streamText` plain text streaming. Shared request validation and response helpers stay in `lib/asca-chat.ts`; feature-specific UI state stays in `app/run/run-asca-chat.tsx` and `components/run-asca/`.

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

- **TDD**: PASS. The contracts and quickstart define observable failing-first tests for streamed chunks, completion, failure before and after partial text, duplicate submission prevention, copy behavior, scroll behavior, and authenticated route access.
- **Quality Gates**: PASS. Quickstart includes lint, format, typecheck, unit tests, coverage, e2e tests, and build. Real OpenAI calls are isolated behind the route and mocked in tests.
- **Type Safety**: PASS. Data model and API contract define typed entities, stream states, request/response shapes, validation rules, and state transitions without `any`.
- **Next.js Guidance**: PASS. The design uses Route Handlers for the public BFF endpoint, a Server Component for protected route rendering, and a Client Component boundary for stream reading and browser APIs.
- **Frontend Boundary**: PASS. Direct OpenAI access remains limited to a frontend BFF route for this feature; persistent agent orchestration, tools, multimodal execution, and thread storage remain out of scope.
