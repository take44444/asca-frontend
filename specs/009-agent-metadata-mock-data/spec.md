# Feature Specification: Agent Metadata Summary Content

**Feature Branch**: `009-agent-metadata-mock-data`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "Create spec based on the requirements in .specify_input/agent-metadata-summary-card-mock-data.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review Agent Knowledge (Priority: P1)

As a user viewing an agent, I want the knowledge summary to list the agent's knowledge titles and descriptions so I can understand the information available to that agent without leaving the workspace.

**Why this priority**: Knowledge context is the most detailed metadata in scope and directly helps users judge what the agent can draw upon.

**Independent Test**: Can be tested by opening the knowledge summary and confirming that all 14 demonstration knowledge records are represented by a title and description, long text remains contained, and records beyond the visible area are reachable by scrolling within the list.

**Acceptance Scenarios**:

1. **Given** the demonstration knowledge dataset contains 14 records, **When** the knowledge summary is displayed, **Then** it shows one distinct item for every record with the record's title and description.
2. **Given** a knowledge title or description is wider than its available row, **When** the item is displayed, **Then** the text is visually truncated to keep the item within the card.
3. **Given** the knowledge items require more height than the visible content area, **When** the user scrolls the knowledge list, **Then** every knowledge item becomes reachable without scrolling unrelated workspace content.

---

### User Story 2 - Identify Social Players (Priority: P2)

As a user viewing an agent, I want the social summary to identify each player by name and initials so I can quickly see who participates in the agent's social context.

**Why this priority**: Player-level detail turns the existing social count into useful context while preserving privacy and avoiding a dependency on profile images.

**Independent Test**: Can be tested by opening the social summary and confirming that all eight demonstration players appear with a name and initials-only avatar, long names remain contained, and overflow players are reachable by scrolling within the list.

**Acceptance Scenarios**:

1. **Given** the demonstration social dataset contains eight players, **When** the social summary is displayed, **Then** it shows one distinct item for every player with the player's name and an avatar representation derived from the player's initials.
2. **Given** a player name is wider than its available row, **When** the player item is displayed, **Then** the name is visually truncated to keep the item within the card.
3. **Given** the player items require more height than the visible content area, **When** the user scrolls the player list, **Then** every player becomes reachable without scrolling unrelated workspace content.
4. **Given** a player item is displayed, **When** the user reviews or activates it, **Then** no remote avatar is requested and no navigation, selection, or other action occurs.

---

### User Story 3 - Inspect Agent Artifacts (Priority: P3)

As a user viewing an agent, I want the artifact summary to list each artifact's name, type, and data size so I can distinguish the agent's available documents and images at a glance.

**Why this priority**: Individual artifact details complete the metadata summaries and make the existing aggregate artifact counts understandable.

**Independent Test**: Can be tested by opening the artifact summary and confirming that its two documents and one image each show the correct type symbol, name, and data size; long names remain contained; and overflow artifacts are reachable within the list.

**Acceptance Scenarios**:

1. **Given** the demonstration artifact dataset contains two documents and one image, **When** the artifact summary is displayed, **Then** it shows one distinct item for every artifact with its name, data size, and a symbol corresponding to its type.
2. **Given** an artifact is a document, **When** its item is displayed, **Then** the item uses a recognizable text-document symbol.
3. **Given** an artifact is an image, **When** its item is displayed, **Then** the item uses a recognizable image-file symbol.
4. **Given** an artifact name is wider than its available row, **When** the item is displayed, **Then** the name is visually truncated to keep the item within the card.
5. **Given** the artifact items require more height than the visible content area, **When** the user scrolls the artifact list, **Then** every artifact becomes reachable without scrolling unrelated workspace content.
6. **Given** the metadata summaries are displayed, **When** the user reviews token usage or activates any knowledge, player, or artifact item, **Then** token usage remains unchanged and no item navigates, selects, or performs another action.

### Edge Cases

- A knowledge title, knowledge description, player name, or artifact name is empty, unusually long, or contains one long unbroken string. Empty display text remains blank rather than being replaced with invented content; an empty player name uses the generic avatar fallback.
- A player name has one word, multiple words, punctuation, non-Latin characters, or no usable characters from which to derive conventional initials.
- A summary dataset is empty even though the demonstration fixtures normally contain records.
- A summary contains enough records to overflow its available height on a short viewport.
- An artifact has an unsupported type or a zero or unusually large data size.
- The workspace is displayed at a width where summary-card content is intentionally unavailable under the existing responsive behavior.
- A user attempts to click, tap, or activate a knowledge, player, or artifact item.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide deterministic demonstration records for 14 knowledge items, eight social players, and three artifacts consisting of two documents and one image.
- **FR-002**: The knowledge, social, and artifact summary totals MUST remain consistent with the number and types of records in their corresponding demonstration datasets.
- **FR-003**: The knowledge summary content area MUST present the knowledge records as one grouped list with one distinct item per record.
- **FR-004**: Each knowledge item MUST display its title and description.
- **FR-005**: A knowledge title or description that exceeds its available single-line width MUST be visually truncated without increasing the width of the summary card.
- **FR-006**: The knowledge list MUST scroll independently when its records exceed the visible content height, and every record MUST remain reachable.
- **FR-007**: The social summary content area MUST present the player records as one grouped list with one distinct item per player.
- **FR-008**: Each player item MUST display the player's name and an avatar representation that falls back to initials derived from that name.
- **FR-009**: Player avatars MUST NOT require or request backend or remote image data in this feature.
- **FR-010**: A player name that exceeds its available single-line width MUST be visually truncated without increasing the width of the summary card.
- **FR-011**: The player list MUST scroll independently when its records exceed the visible content height, and every player MUST remain reachable.
- **FR-012**: The artifact summary content area MUST present the artifact records as one grouped list with one distinct item per artifact.
- **FR-013**: Each artifact item MUST display the artifact name, data size, and a recognizable symbol for the artifact type.
- **FR-014**: Document artifacts MUST use a text-document symbol, and image artifacts MUST use an image-file symbol.
- **FR-015**: An artifact name that exceeds its available single-line width MUST be visually truncated without increasing the width of the summary card.
- **FR-016**: The artifact list MUST scroll independently when its records exceed the visible content height, and every artifact MUST remain reachable.
- **FR-017**: Knowledge, player, and artifact items MUST be read-only and MUST NOT navigate, select, submit data, or perform another action when clicked, tapped, or otherwise activated.
- **FR-018**: Existing token-usage summary content and behavior MUST remain unchanged.
- **FR-019**: The detailed summary content MUST preserve the existing responsive availability of metadata card content and MUST NOT overlap adjacent cards or workspace content at supported viewport sizes.
- **FR-020**: If a summary dataset is empty, its grouped list MUST contain no record items while the summary total remains zero; this feature does not add an asynchronous loading or error state.
- **FR-021**: This feature MUST NOT add backend interaction, item-detail views, or item editing; the supplied environment credential is not required for this feature.

### Key Entities

- **Knowledge Item**: One piece of information available to the agent. Its in-scope attributes are a stable identity, title, and description.
- **Social Player**: One participant in the agent's social context. Its in-scope attributes are a stable identity and display name, from which an initials fallback is derived.
- **Artifact**: One file-like output or resource associated with the agent. Its in-scope attributes are a stable identity, name, type (document or image), and human-readable data size.
- **Metadata Summary Dataset**: The deterministic collection of knowledge items, social players, or artifacts shown for demonstration. Its record count and type breakdown correspond to the aggregate value shown by the related summary card.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the 14 demonstration knowledge records are visible or reachable in the knowledge summary and display both a title and description.
- **SC-002**: 100% of the eight demonstration players are visible or reachable in the social summary and display a name with an initials-only avatar representation, with zero remote avatar requests.
- **SC-003**: 100% of the three demonstration artifacts are visible or reachable in the artifact summary and display a name, data size, and type-appropriate symbol; the displayed breakdown remains two documents and one image.
- **SC-004**: In checks using text at least twice the available row width, 100% of knowledge titles, knowledge descriptions, player names, and artifact names remain within their card and are visibly truncated.
- **SC-005**: In overflow checks for each detailed list, users can reach the final record by scrolling only that list, with no overlap or unintended movement of adjacent workspace content.
- **SC-006**: In interaction checks, 100% of knowledge, player, and artifact items remain read-only, and the existing token-usage summary passes its prior behavior checks unchanged.
- **SC-007**: At least 95% of representative users can correctly identify a listed knowledge item, social player, and artifact type within 30 seconds of viewing the metadata summaries.
- **SC-008**: New or changed behavior has automated tests written before implementation and maintains at least 80% coverage for that behavior.

## Assumptions

- The existing aggregate values establish the demonstration fixture sizes: 14 knowledge items, eight social players, two document artifacts, and one image artifact.
- Visual truncation means a single line is clipped with a visible truncation indicator when it exceeds the available row width; the underlying demonstration value remains unchanged.
- Each detailed list uses the height already allocated to its summary-card content area and scrolls independently when necessary.
- Existing responsive behavior determines when summary-card content is available; this feature fills that content but does not redesign the metadata layout or its breakpoint behavior.
- Initials are derived from the available player name using the application's established avatar fallback behavior. If conventional initials cannot be derived, the existing generic avatar fallback remains acceptable.
- Data sizes are human-readable display values supplied by deterministic demonstration data; file transfer, preview, and validation are outside scope.
- No backend service, asynchronous request, authentication change, or OpenAI API access is needed to display this local demonstration content.
