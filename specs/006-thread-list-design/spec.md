# Feature Specification: Thread List Design

**Feature Branch**: `006-thread-list-design`

**Created**: 2026-06-26

**Status**: Draft

**Input**: User description: "Create spec from the requirements in .specify_input/thread-list-design.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Available Threads (Priority: P1)

As a user running A.S.C.A., I want a clear thread list beside the conversation area so I can scan available threads and understand what conversations are available.

**Why this priority**: The thread list is the main navigation surface for switching conversations. It must be visible, organized, and readable before thread selection can be useful.

**Independent Test**: Can be fully tested by opening the Run A.S.C.A. page and verifying that the left-side thread list contains a clearly presented create-thread control and 20 demonstration thread entries with titles and message counts.

**Acceptance Scenarios**:

1. **Given** the user opens the Run A.S.C.A. page, **When** the thread list loads, **Then** the left side of the page displays a bounded thread list area with a create-thread control at the top and thread entries below it.
2. **Given** the user views the thread list, **When** they scan the entries, **Then** each entry shows a thread title and the number of messages in that thread.
3. **Given** the thread list contains the demonstration set, **When** the list is displayed, **Then** 20 thread entries are available for browsing.

---

### User Story 2 - Navigate to a Thread (Priority: P2)

As a user, I want to select a thread from the list so the matching thread content appears on the right side of the page.

**Why this priority**: Selecting a thread is the primary action the list enables. The feature only delivers navigation value if the selected entry controls the visible conversation content.

**Independent Test**: Can be tested by selecting any visible thread entry and verifying that the right-side conversation area changes to show content for the selected thread.

**Acceptance Scenarios**:

1. **Given** the thread list is visible, **When** the user clicks a thread entry, **Then** the right side of the page displays the corresponding thread content.
2. **Given** one thread is already selected, **When** the user clicks a different thread entry, **Then** the right-side content updates to the newly selected thread.
3. **Given** a thread has been selected, **When** the user looks back at the list, **Then** the selected thread is distinguishable from unselected threads.

---

### User Story 3 - Handle Long Thread Lists (Priority: P3)

As a user, I want the thread list to remain usable when it is taller than the page so I can browse all available threads without losing the conversation area.

**Why this priority**: The demonstration list contains enough entries to require overflow handling on common screen sizes. Independent scrolling prevents the thread list from disrupting the primary conversation layout.

**Independent Test**: Can be tested by viewing the page at a height where all 20 entries cannot fit and confirming that the thread list scrolls independently while the right-side conversation remains available.

**Acceptance Scenarios**:

1. **Given** the available thread entries exceed the visible height, **When** the user scrolls the thread list, **Then** entries beyond the initial viewport become reachable.
2. **Given** the user scrolls the thread list, **When** the right-side content is visible, **Then** the right-side content remains in place and usable.
3. **Given** the create-thread control is at the top of the thread list area, **When** the user browses the list, **Then** the control remains visually associated with the thread list rather than the right-side conversation content.

### Edge Cases

- The thread list contains exactly 20 demonstration entries.
- The viewport height is too small to show all 20 thread entries at once.
- A thread title is longer than the available list width.
- A message count is zero, one, or a larger multi-digit value.
- The user selects a thread after scrolling away from the top of the list.
- The user repeatedly switches between different threads.
- The create-thread control is clicked even though creating new threads is out of scope.
- The right-side conversation area already has content before a different thread is selected.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display the thread list on the left side of the Run A.S.C.A. page.
- **FR-002**: The thread list MUST be presented as a visually bounded group with a header area and a content area.
- **FR-003**: The thread list header MUST contain a create-thread control labeled "Create New Thread".
- **FR-004**: The create-thread control MUST include a visual symbol that communicates starting or adding a conversation.
- **FR-005**: The create-thread control MUST be visible without requiring the user to scroll the thread entries.
- **FR-006**: The create-thread control MUST NOT create a thread, open a creation flow, or change the current thread in this feature.
- **FR-007**: The thread list content area MUST display 20 demonstration thread entries.
- **FR-008**: Each thread entry MUST show the thread title.
- **FR-009**: Each thread entry MUST show the number of messages in that thread.
- **FR-010**: Each thread entry MUST be visually separated enough that users can identify where one selectable thread ends and the next begins.
- **FR-011**: The thread list MUST become scrollable when its entries exceed the available visible height.
- **FR-012**: Scrolling the thread list MUST NOT require scrolling or moving the right-side thread content area.
- **FR-013**: Users MUST be able to click a thread entry to display that thread's corresponding content on the right side of the page.
- **FR-014**: The currently selected thread MUST be visually distinguishable from other thread entries.
- **FR-015**: Selecting a different thread MUST update the right-side content to the newly selected thread.
- **FR-016**: Long thread titles MUST remain readable without overlapping message counts or neighboring entries.
- **FR-017**: The feature MUST preserve the existing right-side thread content design except for content changes caused by thread selection.
- **FR-018**: The feature MUST NOT fetch thread data from a backend service; demonstration thread data is sufficient for this feature.
- **FR-019**: The feature MUST define that no new A.S.C.A. backend API interaction is required.
- **FR-020**: Because the thread list uses demonstration data and has no asynchronous fetching, the feature MUST provide a clear success state and MUST NOT introduce new loading or error states for thread retrieval.

### Key Entities

- **Thread List**: The left-side navigation area for available conversations. Key attributes include header, create-thread control, scrollable content area, and selected thread state.
- **Thread Entry**: A selectable item representing one conversation. Key attributes include thread title, message count, and selection state.
- **Demonstration Thread Set**: The static collection of 20 thread entries used to demonstrate the list design and thread selection behavior.
- **Thread Content Area**: The right-side area that shows content for the selected thread. Its visual design is outside this feature except for displaying the selected thread's matching content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users can identify the create-thread control within 5 seconds of opening the Run A.S.C.A. page.
- **SC-002**: 95% of users can identify a thread title and message count for any visible thread entry within 5 seconds.
- **SC-003**: Users can access all 20 demonstration thread entries without the right-side thread content moving out of view on supported desktop-sized viewports.
- **SC-004**: 90% of users can select a thread and recognize that the right-side content changed to the selected thread within 3 seconds.
- **SC-005**: On supported screen sizes, no thread title, message count, create-thread control text, or right-side content overlaps in visual review.
- **SC-006**: Repeatedly switching between at least 5 different thread entries updates the selected state and right-side content every time.
- **SC-007**: New or changed behavior has automated tests written before implementation and maintains at least 80% coverage for that behavior.

## Assumptions

- Users access the thread list from the existing Run A.S.C.A. page.
- The feature is limited to frontend demonstration behavior using 20 static thread entries.
- Each demonstration thread has representative placeholder content that can be shown on the right side when selected.
- The create-thread control is included for layout and affordance only; functional creation will be handled by a future feature.
- Backend fetching, persistence, and live thread creation are out of scope for this feature.
- The existing right-side thread content design remains authoritative and is not redesigned by this feature.
