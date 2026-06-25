# Data Model: Conversation Panel Design

## Conversation Panel

**Purpose**: Primary chat surface for the selected A.S.C.A. thread.

**Fields**:
- `threadTitle: string`
- `messageCount: number`
- `messages: ChatMessage[]`
- `prompt: string`
- `isSubmitting: boolean`
- `errorMessage: string | null`

**Relationships**:
- Contains the active thread messages.
- Contains the prompt entry and submission controls.
- Receives thread metadata from the surrounding Run A.S.C.A. workspace.

**Validation Rules**:
- `messageCount` must equal the rendered active thread message count.
- The message list must remain independently scrollable.
- Prompt submission must keep the existing whitespace validation, disabled submitting state, streaming status, error display, markdown rendering, copy behavior, and scroll controls.

**States**:
- Empty thread: render the existing empty prompt guidance.
- Idle thread: render complete messages and enabled prompt.
- Submitting/streaming: render submitted prompt, assistant streaming state, disabled prompt, and status text.
- Error: preserve submitted/partial content and render existing error feedback.

## Thread Metadata Summary

**Purpose**: Shared shape for one compact context summary above the conversation panel.

**Fields**:
- `id: "tasks" | "artifacts" | "knowledge" | "tokens"`
- `label: string`
- `symbol: React component or icon identifier`
- `primaryValue: string`
- `supportingDetails: string[]`
- `tone: category-specific visual treatment`

**Validation Rules**:
- Each summary must have a visible category symbol and primary count.
- Desktop presentation must show labels and supporting details.
- Compact presentation must retain symbols and primary counts on narrow screens.
- Counts may be zero and must still render clearly.

## Task Summary

**Purpose**: Show completed and pending task counts.

**Fields**:
- `completedCount: number`
- `pendingCount: number`

**Validation Rules**:
- Counts must be non-negative integers.
- Completed and pending counts must be visually distinguishable.

## Artifact Summary

**Purpose**: Show artifact counts by category.

**Fields**:
- `researchCount: number`
- `documentCount: number`
- `imageCount: number`

**Validation Rules**:
- Counts must be non-negative integers.
- Research, document, and image category labels must remain visible in desktop presentation.

## Knowledge Summary

**Purpose**: Show acquired knowledge item count.

**Fields**:
- `itemCount: number`

**Validation Rules**:
- Count must be a non-negative integer.
- The summary must communicate that the count represents acquired knowledge items.

## Token Usage Summary

**Purpose**: Show input and output token usage over the last seven days.

**Fields**:
- `totalInputTokens: number`
- `totalOutputTokens: number`
- `points: TokenUsagePoint[]`

**Relationships**:
- Contains exactly seven `TokenUsagePoint` records in chronological order.

**Validation Rules**:
- Input and output totals must be derived from or consistent with the point values.
- Input and output series must be visually distinguishable.
- Exact input and output values must be available on hover and keyboard focus.

## Token Usage Point

**Purpose**: One day in the token usage trend.

**Fields**:
- `dateLabel: string`
- `inputTokens: number`
- `outputTokens: number`

**Validation Rules**:
- Token counts must be non-negative integers.
- Zero-usage days must render without hiding the point from the seven-day trend.
