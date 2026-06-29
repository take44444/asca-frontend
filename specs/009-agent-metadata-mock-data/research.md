# Research: Agent Metadata Summary Content

## Fixture Shape and Aggregate Consistency

**Decision**: Model knowledge items, social players, and artifacts as typed record arrays, then derive each displayed count and artifact type breakdown from those arrays.

**Rationale**: A single source of truth prevents the existing aggregate labels from drifting away from the detailed demonstration content and makes the required 14/8/3 fixture sizes directly testable.

**Alternatives considered**: Keeping independent hard-coded counts was rejected because records and totals could diverge. Fetching records was rejected because the feature explicitly requires deterministic local mock data.

## Component Composition

**Decision**: Keep `RunAscaChat` as the existing client boundary, add focused presentational content components or exhaustive summary-id branches, and pass typed arrays into the existing metadata cards as children.

**Rationale**: The installed Next.js client-component guidance supports composing static content beneath the current interactive boundary. The card already accepts children and conditionally exposes content at the established viewport breakpoint.

**Alternatives considered**: A server-rendered metadata route was rejected because it adds no value for local fixtures inside an existing client workspace. Embedding data-shape logic in the generic Card primitive was rejected because it would couple a shared UI component to one feature.

## List Layout, Truncation, and Scrolling

**Decision**: Render each dataset through the existing `ItemGroup`, `Item`, `ItemContent`, `ItemTitle`, `ItemDescription`, and where needed `ItemMedia` primitives. Apply `min-w-0` and single-line truncation to required text, and place each group in a bounded `min-h-0 overflow-y-auto` content viewport.

**Rationale**: These local primitives already provide semantic list roles and compact item variants. Explicit flex-width constraints are required for ellipsis inside grid/flex cards, while overflow belongs on the list viewport so unrelated workspace content does not move.

**Alternatives considered**: A new list component system was rejected because shadcn/ui primitives already exist. Clamping descriptions to multiple lines was rejected because the specification requires single-line visual truncation.

## Player Initials

**Decision**: Derive at most two initials from the first usable Unicode letter or number in the first and last non-empty name segments. A one-segment name yields one initial; a name with no usable character yields a stable generic fallback. Render `Avatar` with `AvatarFallback` only and no `AvatarImage`.

**Rationale**: This handles single-word, multi-word, punctuation, and non-Latin names deterministically without network access. Omitting `AvatarImage` guarantees zero remote avatar requests.

**Alternatives considered**: Using the first UTF-16 code unit was rejected because punctuation and some Unicode characters produce poor fallbacks. Supplying placeholder image URLs was rejected because it violates the no-remote-avatar boundary.

## Artifact Type Mapping and Read-Only Semantics

**Decision**: Use a closed `document | image` artifact type and an exhaustive type-to-icon map to the existing `FileTextIcon` and `FileImageIcon`. Render every metadata entry as a non-focusable, non-interactive item without links, buttons, event handlers, or navigation props.

**Rationale**: Exhaustive typing prevents a supported artifact from silently receiving the wrong visual treatment. Plain list items encode the current read-only contract and preserve token usage behavior.

**Alternatives considered**: A generic fallback icon was rejected because the demonstration type set is closed. Disabled buttons were rejected because they add misleading interaction semantics.

## Test Strategy

**Decision**: Use Jest/React Testing Library for fixture integrity, derived totals, content structure, fallbacks, icons, empty data, and lack of fetch/activation; use Playwright for full record reachability, overflow scrolling, truncation geometry, responsive availability, and non-overlap.

**Rationale**: This follows the installed Next.js Jest and Playwright guidance and separates deterministic component assertions from browser layout behavior that jsdom cannot validate reliably.

**Alternatives considered**: Snapshot-only tests were rejected because they do not prove scrolling or geometry. Browser-only coverage was rejected because fixture invariants and edge-case helpers are faster and clearer at unit level.
