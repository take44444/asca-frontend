# UI Contract: Thread List Design

## Thread List Region

**Landmark**
- Expose a complementary region labeled `Run A.S.C.A. threads`.

**Layout**
- Appears on the left side of the Run A.S.C.A. workspace on desktop-sized viewports.
- Uses a bounded card presentation with a header area and content area.
- The content area scrolls independently when all entries cannot fit vertically.

## Create Thread Control

**Visible contract**
- Text: `Create New Thread`
- Includes a message-plus visual symbol to the left of the text.
- Remains visible without scrolling the thread entries.

**Interaction contract**
- Disabled or otherwise unavailable for activation.
- Does not create a thread, open a modal, navigate, select a thread, or call a backend service.

## Thread Entry

**Visible contract**
- One selectable control per thread.
- Shows thread title.
- Shows message count derived from that thread's message array.
- Long titles are truncated or wrapped in a way that does not overlap the message count.

**Interaction contract**
- Clicking an entry selects that thread.
- The selected entry is visually distinguishable and exposes selected state accessibly.
- Selecting a different entry updates the right-side conversation content.

## Demonstration Data Contract

**Data contract**
- Exactly 20 thread entries are rendered.
- Thread entries are static frontend demonstration data.
- No new thread retrieval loading or error state is introduced.

## Right-Side Conversation Contract

**Visible contract**
- Continues using the existing conversation region and prompt layout.
- Displays the selected thread title and message count.
- Shows the selected thread's messages or existing empty state.

**Behavior contract**
- Existing send, stream, error, markdown, copy, scroll-to-latest, auth redirect, and metadata behaviors remain intact.
- Existing `/api/asca/chat` remains the only backend interaction.
