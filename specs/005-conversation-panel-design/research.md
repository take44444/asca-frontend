# Research: Conversation Panel Design

## Static Metadata Source

**Decision**: Use typed frontend fixtures for task, artifact, knowledge, and seven-day token usage metadata.

**Rationale**: FR-018 through FR-020 explicitly require mocked or static metadata and no new backend interaction. Keeping data in the Run A.S.C.A. frontend boundary avoids creating contracts that future live-data work may need to replace.

**Alternatives considered**: Fetching metadata from `/api/asca/chat` or a new endpoint was rejected because this feature is design-focused and must not fetch live metadata.

## Existing Chat State Preservation

**Decision**: Preserve `RunAscaChat` as the owner of prompt state, `useChat`, route transport, selected thread, error handling, and demo seeding; pass typed metadata into presentation components.

**Rationale**: Existing tests cover send, stream, route failure, interrupted streams, copy, markdown, and independent scrolling. Keeping the state machine intact minimizes regression risk and keeps the redesign scoped to layout and display.

**Alternatives considered**: Rebuilding the chat workspace around a new container component was rejected because it would mix visual redesign with chat behavior changes.

## Bounded Conversation Panel

**Decision**: Extend `ConversationPanel` into a visually bounded region with a header, independently scrollable content area, and anchored prompt area using Tailwind classes and existing shadcn-style primitives.

**Rationale**: The component already exposes the correct semantic region, title/count header, `message-viewport`, `StickToBottom`, prompt input, errors, streaming status, and scroll button. The redesign can strengthen visual boundaries and layout without moving behavioral ownership.

**Alternatives considered**: Building a new panel component beside `ConversationPanel` was rejected because it would duplicate the primary chat surface.

## Metadata Summary Layout

**Decision**: Render four distinct metadata summaries above the conversation panel, with category icons, count-focused typography, supporting details, and responsive grid behavior.

**Rationale**: The spec requires one horizontal row on larger screens and compact summaries on smaller screens. A grid that changes column count by breakpoint keeps the symbols and primary counts visible while letting supporting labels compress.

**Alternatives considered**: A tabbed or collapsible metadata area was rejected because the summaries must be scannable without extra interaction.

## Token Usage Trend

**Decision**: Use existing `components/ui/chart.tsx` and Recharts to render seven static input/output points with distinguishable series and exact values available through hover/focus.

**Rationale**: Recharts and the local chart wrapper are already installed. A seven-point line chart is small, accessible to test, and consistent with the existing component stack.

**Alternatives considered**: A custom SVG chart was rejected because the project already includes a chart abstraction and Recharts accessibility behavior.

## Next.js Guidance

**Decision**: Keep this work within the existing App Router route and client component boundary.

**Rationale**: Installed Next.js 16.2.6 docs identify the App Router as the file-system routing layer, document route announcement/accessibility behavior, and define modern browser support. This feature does not require new Next.js data fetching, caching, metadata, server actions, or routing APIs.

**Alternatives considered**: Adding a new route or server component boundary was rejected because the spec targets the existing authenticated `/run` chat experience.
