# UI Contract: Conversation Panel Design

## Route and Boundary

- The feature is visible in the existing authenticated `/run` page.
- Signed-out behavior remains unchanged: unauthenticated users are redirected to `/login`.
- No new backend endpoint, request body, response body, or live metadata fetch is introduced.
- Existing `/api/asca/chat` request and streaming response behavior remains unchanged.

## Conversation Region

- The active chat surface exposes a region named `Conversation`.
- The region header displays the active thread title and exact message count.
- The message viewport remains available as `data-testid="message-viewport"` and scrolls independently from the workspace shell.
- The prompt textarea keeps accessible name `Prompt A.S.C.A.`.
- The send control keeps accessible name `Send prompt`.
- The scroll control keeps accessible name `Return to latest message`.
- Existing loading, error, empty, streaming, copy, and complete message states remain visible and usable.

## Metadata Summaries

- A metadata area appears above the bounded conversation panel.
- It contains exactly four summaries: tasks, artifacts, knowledge, and total tokens.
- Tasks displays completed and pending task counts.
- Artifacts displays research, document, and image counts.
- Knowledge displays acquired knowledge item count.
- Total tokens displays input and output token usage for the last seven days.
- Each summary has a category symbol, label, primary count, supporting details, and category-specific visual treatment.
- On desktop widths, all four summaries appear in one row with full labels and supporting details visible.
- On smaller widths, summaries adapt to a compact layout that keeps category symbols and primary counts visible.

## Token Trend Interaction

- The token trend renders seven chronological days.
- Input and output token series are distinguishable by color and label.
- Hovering or focusing a token point reveals exact input and output values for that day.
- Zero values render as valid data, not missing data.

## Regression Contract

- Submitting a valid prompt appends the prompt and streams one assistant response using current behavior.
- Whitespace prompt validation does not call the chat route.
- Duplicate sends remain blocked while submitted or streaming.
- Interrupted streams preserve partial text and allow a follow-up prompt.
- Message copy feedback remains visible.
- Desktop workspace remains inside the viewport without page scrolling.
- Long conversations scroll inside the message viewport while the prompt remains anchored.
