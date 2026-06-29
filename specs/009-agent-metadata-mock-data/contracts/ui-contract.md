# UI Contract: Agent Metadata Summary Content

## Shared Summary Behavior

- Preserve the existing four-card order, header labels, tones, primary values, and responsive content breakpoint.
- Derive knowledge, social, and artifact totals from their detailed fixture records.
- Render detailed records only in the existing card content area; keep token trend content and behavior unchanged.
- Give each detailed collection a semantic grouped-list structure and an independently vertically scrollable viewport with every record reachable.
- Keep every record non-interactive: no link, button, selection state, submit behavior, navigation, request, or token-usage change.
- Render an empty collection as an empty group with a zero summary total and no loading/error placeholder.

## Knowledge Summary

- Render exactly 14 demonstration `Item` records within an `ItemGroup`.
- Each item contains `ItemContent`, a title in `ItemTitle`, and a description in `ItemDescription`.
- Empty titles and descriptions remain blank rather than receiving invented fallback content.
- Title and description are single-line truncated when wider than the available row.
- The final item remains reachable by scrolling only the knowledge content viewport.

## Social Summary

- Render exactly eight demonstration `Item` records within an `ItemGroup`.
- Each item contains `ItemMedia` with `Avatar` and `AvatarFallback`, plus `ItemContent` with the name in `ItemTitle`.
- Render no `AvatarImage`, remote URL, or backend-derived avatar data.
- The fallback displays deterministic initials or the generic fallback for names without usable characters.
- An empty player name remains blank and uses the generic avatar fallback.
- Player names are single-line truncated, and the final player remains reachable by scrolling only the social content viewport.

## Artifact Summary

- Render exactly three demonstration `Item` records within an `ItemGroup`: two documents and one image.
- Each item contains `ItemMedia` with the exhaustive type icon and `ItemContent` with name in `ItemTitle` and data size in `ItemDescription`.
- An empty artifact name remains blank rather than receiving invented fallback content.
- Documents use `FileTextIcon`; images use `FileImageIcon`. Icons expose an appropriate accessible type name or are paired with equivalent accessible text.
- Artifact names are single-line truncated, and the final artifact remains reachable when the collection overflows its content viewport.

## Responsive and Layout Boundary

- Preserve the existing behavior that omits card content below its established viewport threshold while leaving card headers available.
- At supported widths where content is available, no list item, text, icon, or scroll viewport overlaps another summary card or workspace region.
- Long unbroken strings remain within the summary card's horizontal bounds.

## Backend Boundary

- Rendering metadata performs no fetch and requires no `OPENAI_API_KEY`.
- `/api/asca/chat`, authentication, agent selection, conversation state, event data, and token usage remain unchanged.
