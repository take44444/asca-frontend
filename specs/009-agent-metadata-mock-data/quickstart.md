# Quickstart: Agent Metadata Summary Content

## Prerequisites

- Dependencies installed with `npm install`.
- Existing authenticated Run A.S.C.A. test setup available.
- Review [spec.md](./spec.md), [data-model.md](./data-model.md), and [ui-contract.md](./contracts/ui-contract.md).

## Validation Scenarios

### Knowledge Records

1. Open `/run` with an authenticated session at a viewport where metadata content is available.
2. Confirm the Knowledge summary reports 14 and contains 14 titled descriptions.
3. Confirm long titles/descriptions show single-line truncation without widening the card.
4. On a short viewport, scroll only the knowledge list and reach its final record.

### Social Players

1. Confirm the Social summary reports eight and contains eight named players.
2. Confirm every avatar shows initials only and no avatar image request occurs.
3. Check one-word, multi-word, punctuation, and non-Latin fixtures produce stable fallbacks.
4. Confirm long names truncate and the final player is reachable through the list's own scroll viewport.

### Artifacts and Read-Only Behavior

1. Confirm the Artifacts summary reports two documents and one image.
2. Confirm all three records show a name, data size, and the appropriate file-text or file-image symbol.
3. Activate knowledge, player, and artifact rows by pointer and keyboard attempts; confirm no navigation, selection, request, or token-total change occurs.
4. Confirm long artifact names remain inside the card.

### Responsive and Empty Data

1. Below the existing metadata-content breakpoint, confirm all four headers remain visible and detailed content follows the existing unavailable behavior.
2. At supported desktop widths and a short height, confirm detailed lists do not overlap adjacent cards or workspace content.
3. In unit tests, provide each supported empty collection and confirm an empty group with a zero derived total and no loading/error state.
4. Confirm the seven-point token trend and its keyboard behavior remain unchanged.

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
