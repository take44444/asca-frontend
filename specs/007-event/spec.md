# Feature Specification: Event View

**Feature Branch**: `007-event-view`

**Created**: 2026-06-27

**Status**: Draft

**Input**: User description: "Create spec from the requirements in .specify_input/event.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review Thread-Related Events (Priority: P1)

As a user viewing an A.S.C.A. thread, I want to see the external events submitted for that thread so I can understand the activity and context collected from other applications.

**Why this priority**: Reviewing event content is the core purpose of the view and provides value even before overflow behavior or visual source recognition is considered.

**Independent Test**: Can be tested by opening the event view for the current thread and verifying that 20 demonstration events are presented in a clearly titled, bounded area, with each event showing its sender, content, and date.

**Acceptance Scenarios**:

1. **Given** a user is viewing an A.S.C.A. thread, **When** the event view is displayed, **Then** the user sees a bounded area titled "Events" containing 20 demonstration events.
2. **Given** the event list is visible, **When** the user reviews any event, **Then** they can identify the sender, event content, and event date.
3. **Given** an event includes an external thread name, **When** the event is displayed, **Then** the sender is accompanied by a distinct "in: {thread}" label.
4. **Given** an event has no external thread name, **When** the event is displayed, **Then** the sender is shown without an empty or placeholder thread label.

---

### User Story 2 - Identify Event Sources (Priority: P2)

As a user, I want to recognize which external application published each event so I can interpret the event in its original communication context.

**Why this priority**: Source recognition makes the event list easier to scan and reduces ambiguity when similar content comes from different applications.

**Independent Test**: Can be tested with demonstration events from Slack, Microsoft Teams, Discord, X, and GitHub by confirming that every event displays the recognizable icon for its declared source application.

**Acceptance Scenarios**:

1. **Given** an event was published by Slack, Microsoft Teams, Discord, X, or GitHub, **When** the event is displayed, **Then** the matching application icon appears on the left side of the event.
2. **Given** demonstration events cover all five supported applications, **When** the user scans the list, **Then** each source can be distinguished by its application icon.

---

### User Story 3 - Browse a Long Event History (Priority: P3)

As a user, I want to scroll through events when the list is taller than the available view so I can reach every event without disrupting the surrounding thread interface.

**Why this priority**: The demonstration set is large enough to overflow common viewport heights, so bounded scrolling is necessary to keep all events accessible.

**Independent Test**: Can be tested at a viewport height that cannot show all 20 events at once by scrolling within the event list and confirming that every event can be reached while the event heading and surrounding thread interface remain usable.

**Acceptance Scenarios**:

1. **Given** the event items exceed the available visible height, **When** the user scrolls the event list, **Then** events beyond the initial viewport become reachable.
2. **Given** the event list is being scrolled, **When** the user views the surrounding thread interface, **Then** the list remains bounded within the event view and does not force unrelated content to scroll with it.

### Edge Cases

- An event omits the optional external thread name.
- Event content or an external thread name is longer than the available width.
- A sender name is unusually long.
- The event list contains exactly 20 demonstration events and is taller than the available viewport.
- Several adjacent events originate from the same application or sender.
- Event dates span different days or years.
- A user attempts to click an event even though event interaction is outside this feature.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display an event view associated with the current A.S.C.A. thread.
- **FR-002**: The event view MUST be presented as a visually bounded group with a header and content area.
- **FR-003**: The event view header MUST display the title "Events".
- **FR-004**: The event view content area MUST display a list of exactly 20 demonstration events.
- **FR-005**: Each event MUST display the icon of the external application that published it on the left side of the event.
- **FR-006**: The supported external applications MUST be Slack, Microsoft Teams, Discord, X, and GitHub.
- **FR-007**: Each supported application value MUST map to its recognizable application icon: `slack` to Slack, `microsoft-teams` to Microsoft Teams, `discord` to Discord, `x` to X, and `github` to GitHub.
- **FR-008**: Each event MUST display the sender who submitted it.
- **FR-009**: When an event includes an external thread name, the system MUST display a visually distinct label formatted as "in: {thread}" beside the sender.
- **FR-010**: When an event does not include an external thread name, the system MUST display only the sender and MUST NOT display an empty, placeholder, or partial thread label.
- **FR-011**: Each event MUST display its content in a description area.
- **FR-012**: Each event MUST display its date on the right side of the item in a human-readable format.
- **FR-013**: Event icons, sender information, content, and dates MUST remain visually associated with their corresponding event.
- **FR-014**: Event content, sender names, and external thread labels MUST remain readable without overlapping icons, dates, or neighboring events.
- **FR-015**: The event list MUST become scrollable when its items exceed the available visible height.
- **FR-016**: Scrolling the event list MUST keep the list bounded within the event view and MUST NOT require unrelated thread content to move with it.
- **FR-017**: The demonstration data MUST include varied application sources, senders, optional external thread names, content, and dates sufficient to review the design across all supported event variations.
- **FR-018**: Events MUST NOT perform navigation, open details, or trigger another action when clicked in this feature.
- **FR-019**: The feature MUST NOT fetch events from a backend service; no new A.S.C.A. backend API interaction is required.
- **FR-020**: Because the event list uses local demonstration data and has no asynchronous retrieval, the feature MUST present the populated event list as its success state and MUST NOT introduce event-loading or event-fetch error states.

### Key Entities

- **Event View**: The bounded area associated with the current A.S.C.A. thread. Key attributes are the "Events" title and scrollable event list.
- **Event**: An external occurrence submitted to A.S.C.A. Key attributes are application source, sender, optional external thread name, content, and date.
- **Supported Application**: One of Slack, Microsoft Teams, Discord, X, or GitHub, identified by its event data value and recognizable icon.
- **Demonstration Event Set**: The static collection of 20 varied events used to evaluate the event view without backend retrieval.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users can identify the event view and its purpose within 5 seconds of seeing it.
- **SC-002**: 95% of users can identify an event's source application, sender, content, and date within 10 seconds.
- **SC-003**: All 20 demonstration events are reachable at viewport heights where the full list cannot be shown at once, without unrelated thread content being forced to scroll.
- **SC-004**: Visual review at supported screen sizes finds no overlap among application icons, sender information, external thread labels, event content, dates, or neighboring events.
- **SC-005**: All five supported application sources are correctly recognizable in 100% of representative event-source checks.
- **SC-006**: Events with and without external thread names display the required sender-and-thread format correctly in 100% of representative checks.
- **SC-007**: New or changed behavior has automated tests written before implementation and maintains at least 80% coverage for that behavior.

## Assumptions

- The event view appears within the existing authenticated Run A.S.C.A. experience and reflects the currently viewed thread.
- This feature uses exactly 20 static demonstration events; live retrieval, persistence, refresh, pagination, filtering, and empty-state behavior are outside scope.
- Every demonstration event has one of the five supported application values, a sender, content, and date; only the external thread name is optional.
- Dates are shown in a concise, human-readable form appropriate to the user's locale; date-format controls and timezone preferences are outside scope.
- The varied demonstration set represents all five supported applications and includes both events with and without external thread names.
- Event items are informational only and do not expose hover, click, keyboard, or touch actions beyond scrolling the list.
