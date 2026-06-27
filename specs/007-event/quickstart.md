# Quickstart: Event View

## Prerequisites

- Dependencies installed with `npm install`.
- Existing authenticated Run A.S.C.A. test setup available.
- Review [spec.md](./spec.md), [data-model.md](./data-model.md), and [ui-contract.md](./contracts/ui-contract.md).

## Validation Scenarios

### Default Event Set

1. Open `/run` with an authenticated session.
2. Confirm an Events card appears below metadata and beside the conversation at a wide desktop viewport.
3. Confirm exactly 20 events are available and all five application sources appear.
4. Confirm entries show sender, content, date, and optional `in:` badges without fetching event data.

### Thread-Specific Events

1. Select a non-default thread.
2. Confirm the conversation changes to that thread.
3. Confirm the Events card changes to exactly three associated events.
4. Return to Demonstration Thread and confirm 20 events return.

### Responsive and Scroll Behavior

1. At 1280px width, confirm events are right of conversation and below metadata.
2. Below the `xl` breakpoint, confirm events stack after conversation.
3. At a short viewport, scroll the event list to its final item.
4. Confirm the Events title and conversation remain usable and content does not overlap.

## Required Commands

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run test:e2e
npm run build
```

Expected result: all quality gates pass and changed behavior maintains at least 80% coverage.
