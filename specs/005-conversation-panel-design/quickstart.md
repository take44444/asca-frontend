# Quickstart: Conversation Panel Design

## Prerequisites

- Install dependencies with `npm install`.
- Ensure Playwright browsers are installed with `npx playwright install` if E2E tests have not run locally.
- Use the existing authenticated Run A.S.C.A. test helpers for E2E scenarios.

## Validation Commands

Run the full quality gate before considering implementation complete:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run test:e2e
npm run build
```

## Manual Validation Scenarios

1. Open `/run` as an authenticated user.
2. Confirm the conversation is visually bounded and shows `Demonstration Thread`, the current message count, scrollable messages, and the prompt entry.
3. Confirm four metadata summaries appear above the conversation: tasks, artifacts, knowledge, and total tokens.
4. On a desktop viewport such as 1280 x 800, confirm the four summaries are in one row with labels, counts, and supporting details visible.
5. On a narrow viewport such as 390 x 844, confirm summaries compact without overlapping and keep category symbols plus primary counts visible.
6. Submit a valid prompt and confirm existing chat behavior: submitted prompt, streaming status, assistant response, enabled prompt after completion.
7. Use the development-only long conversation seeding control and confirm messages scroll within `message-viewport` while the prompt stays anchored.
8. Hover or keyboard-focus each token trend point and confirm exact input and output token counts are revealed.
9. Validate zero or low metadata values remain readable if fixture values are adjusted for testing.
10. Trigger existing error scenarios from automated tests and confirm loading, error, empty, partial, and success states remain at least as visible as before.

## Expected Outcomes

- The UI contract in `contracts/ui-contract.md` is satisfied.
- The data rules in `data-model.md` are represented by typed frontend fixtures and component props.
- Existing Run A.S.C.A. chat interaction tests continue to pass.
- New tests cover metadata summaries, token trend interaction, responsive layout, and no-overlap visual behavior.

## Validation Record

- 2026-06-26: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:coverage`, `npm run test:e2e`, and `npm run build` passed.
- Manual scenarios are covered by the expanded unit and Playwright checks for bounded conversation layout, static summaries, token focus values, responsive non-overlap, long-message scrolling, streaming, errors, and copy behavior.
- Unresolved deviations: none.
