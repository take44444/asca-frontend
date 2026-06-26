# Research: Thread List Design

## Decision: Keep Thread Navigation Inside the Existing Client Component Boundary

**Rationale**: The Run A.S.C.A. workspace already uses a client component for prompt state, selected thread id, streaming status, and route calls. Thread selection needs click handlers and immediate local state updates, which match the installed Next.js guidance for Client Components.

**Alternatives considered**:
- Add route-based thread navigation: Rejected because the feature uses static demonstration data and does not require URL-level navigation.
- Move thread data fetching to a Server Component: Rejected because backend fetching is explicitly out of scope.

## Decision: Use Static In-Memory Demonstration Threads

**Rationale**: The specification requires exactly 20 demonstration entries and no backend thread fetching. Static typed fixtures keep the feature deterministic, testable, and within the frontend boundary.

**Alternatives considered**:
- Fetch threads from `/api/asca/chat` or a new endpoint: Rejected because no new backend interaction is allowed.
- Generate threads directly inside the JSX render body: Rejected because typed fixtures or memoized construction are easier to test and reuse.

## Decision: Preserve the Existing Conversation Panel for Right-Side Content

**Rationale**: The right-side design is out of scope except for showing content for the selected thread. Reusing `ConversationPanel` preserves current chat behaviors, tests, and accessibility landmarks.

**Alternatives considered**:
- Create a separate read-only thread preview panel: Rejected because it would duplicate right-side layout and risk redesigning out-of-scope content.
- Disable selection for non-active demo threads: Rejected because the spec requires selecting a thread to update the right-side content.

## Decision: Model One Live Chat Thread and Nineteen Static Demo Threads

**Rationale**: Existing streaming chat state belongs to the current demonstration thread. Non-active demo threads can use representative static messages for selection previews without creating complex per-thread chat state or persistence.

**Alternatives considered**:
- Maintain independent prompt/streaming state for all 20 threads: Rejected as unnecessary for a design demonstration and higher risk to existing chat behavior.
- Reset chat state on every selection: Rejected because it would create surprising behavior and risk losing the active demonstration conversation.

## Decision: Keep Create-Thread Action Disabled and Non-Functional

**Rationale**: The source requirements and spec both mark thread creation out of scope. A visible disabled button communicates future affordance while avoiding unsupported behavior.

**Alternatives considered**:
- Show an enabled button with no-op click handling: Rejected because enabled controls should perform an action.
- Hide the control: Rejected because the requested layout includes it in the list header.

## Decision: Use Existing shadcn/ui Card and Button Primitives

**Rationale**: The source requirements request card-style thread list presentation, and the project constitution prefers existing shadcn/ui components and Tailwind utilities. Existing `Card`, `CardHeader`, `CardContent`, and `Button` primitives satisfy the requirement without adding a new component system.

**Alternatives considered**:
- Keep the current custom bordered aside only: Rejected because the feature specifically calls for card presentation.
- Add a third-party list component: Rejected because it is unnecessary for 20 static entries.
