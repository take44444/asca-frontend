# Feature Specification: Conversation Panel Design

**Feature Branch**: `005-conversation-panel-design`

**Created**: 2026-06-26

**Status**: Draft

**Input**: User description: "Create spec from requirements in .specify_input/chat-panel-design.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use a Clear Conversation Panel (Priority: P1)

As an authenticated user chatting with A.S.C.A., I want the conversation area to be visually organized with a clear title, message count, scrollable message history, and prompt entry area so I can understand and continue the current thread without losing existing chat behavior.

**Why this priority**: The conversation panel is the primary interaction surface. The redesign must improve clarity while preserving message sending, receiving, formatting, copying, and scrolling behavior.

**Independent Test**: Can be fully tested by opening the Run A.S.C.A. chat, verifying that the thread title, message count, message list, and prompt entry are visible in one coherent panel, then sending a prompt and confirming the existing interaction still works.

**Acceptance Scenarios**:

1. **Given** the user is viewing an existing A.S.C.A. thread, **When** the conversation panel loads, **Then** the panel shows the thread title, current message count, scrollable messages, and prompt entry area.
2. **Given** the user submits a valid prompt, **When** A.S.C.A. responds, **Then** the prompt and response appear using the existing message behavior and formatting.
3. **Given** the thread contains more messages than fit in the visible panel, **When** the user scrolls the message area, **Then** scrolling remains limited to the message area and does not disrupt the surrounding layout.

---

### User Story 2 - Scan Thread Metadata (Priority: P2)

As a user, I want compact summaries above the conversation for tasks, artifacts, knowledge, and token usage so I can quickly understand the thread context before or while chatting.

**Why this priority**: The metadata summaries add situational awareness around the thread, but they depend on the primary conversation panel remaining usable.

**Independent Test**: Can be tested by opening the Run A.S.C.A. chat and verifying that four distinct metadata summaries appear above the conversation and communicate their categories and counts without requiring live data.

**Acceptance Scenarios**:

1. **Given** the user opens the chat page, **When** the thread metadata area is displayed, **Then** the user sees four distinct summaries for tasks, artifacts, knowledge, and total token usage.
2. **Given** task metadata is displayed, **When** the user scans the task summary, **Then** completed and pending task counts are both visible.
3. **Given** artifact metadata is displayed, **When** the user scans the artifact summary, **Then** artifact counts are grouped by research, document, and image categories.
4. **Given** knowledge metadata is displayed, **When** the user scans the knowledge summary, **Then** the number of acquired knowledge items is visible.

---

### User Story 3 - Inspect Token Usage Trend (Priority: P3)

As a user, I want to see recent input and output token usage over time so I can understand the thread's activity pattern at a glance.

**Why this priority**: Token usage is useful contextual metadata, but it is less critical than the conversation panel and static metadata counts.

**Independent Test**: Can be tested by viewing the token usage summary and confirming that the last seven days of input and output usage are shown as separate trends with exact values available on hover or focus.

**Acceptance Scenarios**:

1. **Given** the token usage summary is visible, **When** the user views the chart, **Then** input and output token trends are distinguishable from each other.
2. **Given** the user hovers over or focuses a point in the token trend, **When** exact values are available, **Then** the interface displays the corresponding input and output token counts for that point.
3. **Given** the token trend is displayed, **When** the user interprets the date range, **Then** the trend represents the last seven days.

---

### User Story 4 - Use the Layout Across Screen Sizes (Priority: P4)

As a user on a smaller or larger screen, I want the conversation panel and metadata summaries to adapt without overlap or loss of essential information so the chat remains usable on my device.

**Why this priority**: Responsive behavior is required for a polished interface, but it supports the higher-priority conversation and metadata experiences.

**Independent Test**: Can be tested by viewing the chat on small and large screen widths and verifying that the metadata summaries, conversation panel, messages, and prompt entry remain visible and usable.

**Acceptance Scenarios**:

1. **Given** the user views the chat on a larger screen, **When** the metadata summaries appear, **Then** all four summaries appear in one horizontal row with labels, counts, and supporting details visible.
2. **Given** the user views the chat on a smaller screen, **When** the metadata summaries appear, **Then** each summary keeps its category symbol and primary count visible in a compact layout.
3. **Given** the screen size changes, **When** the layout adapts, **Then** the conversation panel, metadata summaries, and prompt entry remain readable and do not overlap.

### Edge Cases

- The thread has zero messages or only the initial demonstration messages.
- The thread has enough messages to require scrolling within the conversation panel.
- Metadata counts are zero for one or more categories.
- Artifact counts differ across research, document, and image categories.
- The token usage chart has no usage for one or more days in the seven-day period.
- The user interacts with the token chart using hover or keyboard focus.
- The viewport is narrow enough that full metadata labels cannot fit.
- The viewport changes while a message is being entered or while a response is in progress.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The conversation area MUST be presented as a visually bounded panel with a header, content area, and prompt entry area.
- **FR-002**: The panel header MUST display the current thread title.
- **FR-003**: The panel header MUST display the current number of messages in the thread.
- **FR-004**: The panel content area MUST display the thread messages in an independently scrollable area.
- **FR-005**: The panel prompt area MUST provide the existing prompt entry and submission experience.
- **FR-006**: The redesign MUST preserve existing message sending, response display, scrolling behavior, message formatting, copying, and other current conversation interactions.
- **FR-007**: The interface MUST display four thread metadata summaries above the conversation panel: tasks, artifacts, knowledge, and total tokens.
- **FR-008**: Each metadata summary MUST be visually distinct through category-specific symbols, color treatment, and typography while remaining part of a cohesive interface.
- **FR-009**: The tasks summary MUST display completed task count and pending task count.
- **FR-010**: The artifacts summary MUST display artifact counts grouped by research, document, and image categories.
- **FR-011**: The knowledge summary MUST display the number of knowledge items A.S.C.A. has acquired in the thread.
- **FR-012**: The total tokens summary MUST display input and output token usage over the last seven days.
- **FR-013**: Input token usage and output token usage MUST be visually distinguishable from each other.
- **FR-014**: When the user hovers over or focuses a token usage point, the interface MUST display exact input and output token counts for that point.
- **FR-015**: On larger screens, the four metadata summaries MUST appear in a single horizontal row with their full labels and supporting details visible.
- **FR-016**: On smaller screens, the four metadata summaries MUST adapt to a compact presentation that keeps category symbols and primary counts visible.
- **FR-017**: The conversation panel and metadata summaries MUST remain readable and usable across supported screen sizes without overlapping content.
- **FR-018**: The feature MUST use mocked or static metadata values for tasks, artifacts, knowledge, and token usage.
- **FR-019**: The feature MUST NOT fetch live task, artifact, knowledge, or token data as part of this design-focused scope.
- **FR-020**: No new backend interaction is required for this feature because metadata is mocked or static and existing chat behavior is preserved.
- **FR-021**: User-facing loading, error, empty, and success states for chat behavior MUST remain at least as visible and usable as they are before this redesign.

### Key Entities

- **Conversation Panel**: The primary chat surface for a thread. Key attributes include thread title, message count, scrollable message history, and prompt entry area.
- **Thread Metadata Summary**: A compact contextual summary displayed above the conversation. Key attributes include category, symbol, label, primary count, supporting details, and responsive presentation.
- **Task Summary**: Thread metadata showing completed and pending task counts.
- **Artifact Summary**: Thread metadata showing research, document, and image artifact counts.
- **Knowledge Summary**: Thread metadata showing the number of acquired knowledge items.
- **Token Usage Summary**: Thread metadata showing seven days of input and output token usage with exact values available through user interaction.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users can identify the thread title and message count within 5 seconds of opening the chat.
- **SC-002**: 95% of existing chat interaction tests for sending messages, receiving responses, message formatting, copying, and scrolling continue to pass after the redesign.
- **SC-003**: 90% of users can correctly identify all four metadata categories within 10 seconds of viewing the chat page.
- **SC-004**: 90% of users can distinguish completed tasks from pending tasks and input tokens from output tokens without additional instruction.
- **SC-005**: On supported small and large screen widths, the conversation panel, metadata summaries, and prompt entry show no overlapping text or controls in visual review.
- **SC-006**: Users can reveal exact input and output token counts for any visible token usage point in 2 seconds or less.
- **SC-007**: New or changed behavior has automated tests written before implementation and maintains at least 80% coverage for that behavior.

## Assumptions

- Users access this design through the existing authenticated Run A.S.C.A. chat experience.
- The thread title and message count are already available from the existing conversation state.
- Metadata values for tasks, artifacts, knowledge, and token usage are static or mocked for this feature.
- The token trend uses representative seven-day sample data for design and interaction validation.
- Existing chat loading, error, empty, streaming, and success states remain in scope only to the extent needed to avoid regressions caused by the redesign.
- Live task, artifact, knowledge, and token data will be handled by a future feature.
