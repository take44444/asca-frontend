# Quickstart: Thread List Design

## Prerequisites

- Dependencies installed with `npm install`.
- Local environment configured as for the existing Run A.S.C.A. tests.
- Feature artifacts reviewed:
  - [spec.md](./spec.md)
  - [data-model.md](./data-model.md)
  - [contracts/ui-contract.md](./contracts/ui-contract.md)

## Validation Scenarios

### 1. Thread List Loads With Demonstration Data

1. Open the authenticated Run A.S.C.A. page.
2. Confirm the thread list region is visible on the left side of the workspace.
3. Confirm the `Create New Thread` control is visible and unavailable.
4. Confirm exactly 20 thread entries are available.
5. Confirm each visible entry shows a title and message count.

Expected result: The thread list is a bounded card-style area and no thread-fetch loading or error state appears.

### 2. Selecting Threads Updates the Conversation

1. Select a visible thread entry.
2. Confirm the selected entry is visually distinct.
3. Confirm the right-side conversation title, message count, and messages match the selected thread.
4. Select at least four additional thread entries.

Expected result: Selection and right-side content update every time without changing the create-thread control or metadata summaries.

### 3. Long Lists Scroll Independently

1. Use a viewport height where all 20 entries cannot fit.
2. Scroll the thread list content area.
3. Confirm entries beyond the initial viewport become reachable.
4. Confirm the right-side conversation remains visible and usable.

Expected result: The page does not require body scrolling for the thread list, and the conversation panel does not move out of view.

### 4. Existing Chat Behavior Still Works

1. Select the live demonstration thread.
2. Submit a valid prompt.
3. Confirm the user message appears, streaming feedback appears, and the assistant response completes.
4. Trigger existing copy and long-message scroll behavior.

Expected result: Existing chat behavior is unchanged except that it appears alongside the redesigned thread list.

## Required Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run test:e2e
npm run build
```

## Expected Automated Coverage

- Unit tests cover 20 rendered demo threads, disabled create action, selected-state updates, right-side content changes, and no thread-list backend fetch.
- E2E tests cover left-side layout, independent thread-list scrolling, repeated thread switching, and non-overlapping responsive presentation.
