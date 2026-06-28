# Feature Specification: Agent Workspace

**Feature Branch**: `008-agent-workspace`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "Create spec based on the requirements in .specify_input/agent.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and Select Agents (Priority: P1)

As a user in the Run A.S.C.A. workspace, I want to browse agents by name and select one so I can work with the agent suited to my current job.

**Why this priority**: Agent selection establishes the primary domain concept and is the entry point to every agent-specific conversation and summary.

**Independent Test**: Can be tested by opening the workspace, reviewing the agent list, and selecting multiple agents while confirming that each item shows only its agent name and that the selected agent's workspace content updates.

**Acceptance Scenarios**:

1. **Given** the Run A.S.C.A. workspace contains agents, **When** the user opens the agent list, **Then** it is identified as an agent list and every agent appears as a distinct selectable item titled with the agent's name.
2. **Given** an agent item is displayed, **When** the user reviews it, **Then** the item shows the agent name without a message count.
3. **Given** the agent list is visible, **When** the user reviews its creation control, **Then** the control is labeled "Create New Agent".
4. **Given** a different agent is selected, **When** selection completes, **Then** the agent details, metadata, events, and conversation shown in the workspace all correspond to that agent.

---

### User Story 2 - Understand the Selected Agent (Priority: P2)

As a user, I want to see the selected agent's name and role before its operational summaries so I can understand who the agent is and what job it performs.

**Why this priority**: Clear identity and role context lets users interpret the agent's messages, metadata, and activity correctly.

**Independent Test**: Can be tested by selecting an agent with a long, formatted role description and confirming that its identity card appears before the metadata summaries, displays the correct name and role, and keeps overflowing role content reachable within the available view.

**Acceptance Scenarios**:

1. **Given** an agent is selected, **When** its workspace is displayed, **Then** a bounded agent card appears above the agent metadata summaries.
2. **Given** the agent card is visible, **When** the user reviews its heading, **Then** the selected agent's name appears as the title and a settings control appears on the right.
3. **Given** the user focuses or points to the settings control, **When** its explanatory text is shown, **Then** the text reads "Configure Agent" and the control uses a recognizable settings symbol.
4. **Given** the agent role contains supported text formatting, **When** the card is displayed, **Then** the formatting is rendered and the complete role remains readable.
5. **Given** the agent role is taller than the available card area, **When** the user scrolls the role content, **Then** all role content becomes reachable without forcing unrelated workspace content to scroll.

---

### User Story 3 - Converse with a Clearly Identified Agent (Priority: P3)

As a user, I want a focused conversation whose assistant messages use the selected agent's name so I always know which agent is responding.

**Why this priority**: Correct sender identity prevents confusion after agent selection, while removing the redundant conversation header gives the messages more usable space.

**Independent Test**: Can be tested by selecting an agent, viewing existing assistant messages, and receiving a new response while confirming that no conversation header is present and every assistant message is attributed to the selected agent.

**Acceptance Scenarios**:

1. **Given** an agent conversation is displayed, **When** the user views the conversation panel, **Then** the panel has no visible header.
2. **Given** the conversation contains an assistant message, **When** the message is displayed, **Then** its sender is the selected agent's name rather than "A.S.C.A.".
3. **Given** the user switches agents, **When** the newly selected agent's conversation is displayed, **Then** assistant sender labels use the newly selected agent's name.
4. **Given** the user submits a valid prompt to the live agent, **When** the response is pending, succeeds, or fails, **Then** the existing loading, success, authentication, and error behavior remains available without reintroducing a conversation header.

### Edge Cases

- An agent name is unusually long or contains punctuation.
- An agent role is empty, contains long unbroken text, or is substantially taller than the viewport.
- An agent role contains headings, lists, links, or other supported text formatting.
- An agent has no messages, metadata details, or events.
- The user switches agents while viewing content associated with another agent.
- The selected agent changes while an assistant response is pending.
- A user activates the settings control even though configuration is not available in this feature.
- Legacy agent-domain terminology remains in a user-visible label, accessibility name, application-owned source identifier, file name, test, or comment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST refer to the former application-owned "Thread" domain concept as "Agent" throughout the Run A.S.C.A. experience.
- **FR-002**: The terminology migration MUST cover user-visible text, accessibility names, application-owned data names, source identifiers, file names, function and class names, variables, comments, selectors, fixtures, and tests associated with that domain concept.
- **FR-003**: The system MUST preserve unrelated platform, dependency, and external-service terminology whose use of the word "thread" does not represent an A.S.C.A. agent.
- **FR-004**: The agent list MUST be identified to users and assistive technology as the Run A.S.C.A. agent list.
- **FR-005**: Each agent MUST appear as a distinct selectable list item whose content contains a title showing the agent name.
- **FR-006**: Agent list items MUST NOT display message counts.
- **FR-007**: The existing creation control MUST be labeled "Create New Agent" and MUST retain its current availability behavior.
- **FR-008**: Selecting an agent MUST update all agent-associated details, metadata, events, and conversation content as one consistent selection.
- **FR-009**: The system MUST display a bounded agent card above the selected agent's metadata summary cards.
- **FR-010**: The agent card header MUST display the selected agent's name as its title.
- **FR-011**: The agent card header MUST display a settings control on its right side with a recognizable settings symbol.
- **FR-012**: The settings control MUST expose the explanatory text "Configure Agent" when focused or pointed to and MUST have an accessible name that communicates the same purpose.
- **FR-013**: Activating the settings control MUST NOT open configuration, navigate, submit data, or change agent state in this feature.
- **FR-014**: The agent card content MUST display the selected agent's role with supported text formatting rendered for reading.
- **FR-015**: The role content area MUST scroll independently when its content exceeds the available visible height, and all content MUST remain reachable without overlapping adjacent workspace content.
- **FR-016**: The conversation panel MUST NOT display a visible header.
- **FR-017**: Every assistant-authored conversation message MUST identify its sender with the selected agent's name rather than the generic name "A.S.C.A.".
- **FR-018**: User-authored messages MUST remain distinguishable from agent-authored messages.
- **FR-019**: Existing agent selection, authenticated conversation submission, streamed response, metadata, event, loading, error, empty, and success behavior MUST continue to work after the terminology migration.
- **FR-020**: This feature MUST NOT add agent creation, agent configuration, knowledge editing, external-app integration management, or autonomous-task controls.
- **FR-021**: Agent presentation and terminology changes require no new backend interaction; the existing conversation boundary MUST continue accepting the selected domain identifier and returning the established response and error outcomes.

### Key Entities

- **Agent**: A configurable A.S.C.A. worker associated with a job role. Key attributes for this feature are a stable identifier, name, role, messages, metadata summaries, and events.
- **Agent Role**: The formatted description of the selected agent's job and responsibilities, shown in the agent card and allowed to exceed the visible card height.
- **Agent List Item**: A selectable representation of an agent. Its displayed content consists of the agent name and selection state, without a message count.
- **Agent Conversation**: The ordered user and assistant messages associated with an agent. Assistant messages derive their displayed sender name from the selected agent.
- **Agent Metadata Summary**: Existing operational counts and trends associated with the selected agent and positioned below the agent card.
- **Agent Event**: Existing activity associated with the selected agent and updated when agent selection changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of agent entries in the Run A.S.C.A. list display the agent name and selection state without displaying a message count.
- **SC-002**: In representative usability checks, at least 95% of users can identify the selected agent's name, role, and configuration entry point within 10 seconds.
- **SC-003**: All content in a role description at least three viewport heights long is reachable within the agent card without causing the metadata or conversation areas to overlap.
- **SC-004**: 100% of assistant messages checked before and after switching agents display the corresponding selected agent's name, and no visible conversation header is present.
- **SC-005**: A terminology audit finds zero legacy agent-domain references in in-scope user-visible text, accessibility names, application-owned source and test identifiers, file names, and comments.
- **SC-006**: Existing agent selection, conversation, metadata, and event journeys pass without behavioral regression after the terminology migration.
- **SC-007**: At supported viewport sizes, the agent card, metadata summaries, events, and conversation remain readable with no content overlap.
- **SC-008**: New or changed behavior has automated tests written before implementation and maintains at least 80% coverage for that behavior.

## Assumptions

- The truncated final sentence in the input's Out of Scope section refers to the settings/configuration control described earlier; it is displayed but intentionally non-operational in this feature.
- Agent creation remains at its current availability level; this feature renames the existing creation control but does not implement a creation flow.
- Agent names, roles, messages, metadata, and events are available from the existing demonstration data and conversation flow; this feature does not introduce persistence or a new agent-management service.
- "Rename all thread keywords" applies to application-owned uses of the former A.S.C.A. domain concept. Historical specifications, third-party dependency names, runtime primitives, and external-service concepts that genuinely mean a communication or execution thread retain their correct terminology.
- The existing supported text-formatting rules are reused for agent roles; authoring or editing role content is outside scope.
- Existing authentication and conversation service behavior remains unchanged apart from consistently naming the selected domain object as an agent at the frontend boundary.
