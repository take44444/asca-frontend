# UI Contract: Event View

## Events Region

- Expose a complementary region labeled `Events for current thread`.
- Render a bounded card titled exactly `Events` below metadata and to the right of the conversation at `xl` widths.
- Stack the card after the conversation below `xl`.
- Keep the event list independently vertically scrollable while its title remains visible.

## Event Item

- Render one non-interactive list item per event.
- Show the mapped source icon on the left and expose its application name accessibly.
- Show sender, event content, and a locale-formatted date on the right.
- When `externalThread` exists, show a distinct badge reading `in: {externalThread}` beside the sender; otherwise render no badge or placeholder.
- Contain long sender, thread, and content text without overlap.

## Thread Selection

- The default demonstration thread shows exactly 20 events covering all five sources.
- Every other thread shows exactly three associated events.
- Thread selection updates conversation and events in the same render cycle.

## Backend and Interaction Boundary

- Rendering or selecting events performs no fetch, persistence, navigation, or item action.
- No event loading, error, pagination, filtering, or empty state is introduced.
- Existing chat submission and `/api/asca/chat` behavior remain unchanged.
