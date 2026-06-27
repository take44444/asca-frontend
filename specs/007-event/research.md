# Research: Event View

## Client Composition

**Decision**: Render a focused presentational EventView beneath the existing client boundary and pass it the selected thread's local event array.

**Rationale**: Thread selection already lives in `RunAscaChat`; deriving events from the same selected id avoids duplicate state and follows the installed Next.js client-component guidance.

**Alternatives considered**: A server-rendered event panel was rejected because selection is client-local. Adding state inside EventView was rejected because the card has no interactions.

## Fixture Organization

**Decision**: Store a typed `Record<ThreadId, ThreadEvent[]>`; the live demonstration thread has 20 entries and each other thread has three.

**Rationale**: This makes current-thread association explicit, keeps selection deterministic, and satisfies the requested richer default demonstration without backend work.

**Alternatives considered**: Reusing one set for all threads was rejected because events must follow selection. Hundreds of bespoke fixtures were rejected as unnecessary for visual validation.

## Responsive Layout and Scrolling

**Decision**: Place conversation and events in a two-column row at `xl`, using a 22rem event column, and stack events after conversation below `xl`. Give the EventView card and content a bounded flex layout with vertical overflow.

**Rationale**: The current 22rem thread rail leaves usable conversation width at wide desktop sizes. Stacking prevents the event pane from compressing the conversation on narrower screens.

**Alternatives considered**: Side-by-side at all desktop widths was rejected due to narrow conversation space. Placing events above or below the whole main content was rejected by the requested placement.

## Source Icons and Accessibility

**Decision**: Use an exhaustive source-to-logo map for Slack, Microsoft Teams, Discord, X, and GitHub. Expose the source name through an accessible image label, mark the SVG itself decorative, and render each event as a semantic list item.

**Rationale**: Exhaustive typing prevents unmapped sources, while text alternatives make icon-only source information available to assistive technology.

**Alternatives considered**: A fallback icon was rejected because the source union is closed. Unlabeled decorative icons were rejected because source identity is required information.

## Date Presentation

**Decision**: Store fixed ISO timestamps and format them with `Intl.DateTimeFormat(undefined, { dateStyle: "medium" })`.

**Rationale**: ISO data remains sortable and unambiguous while the rendered date is concise and locale-appropriate.

**Alternatives considered**: Hard-coded display strings were rejected because they couple data to one locale. Relative time was rejected because output changes over time.
