# Quickstart: Layout

## Prerequisites

- Node.js and npm available for the project.
- Dependencies installed with `npm install`.
- Implementation tasks have added or configured the required Jest and Playwright test tooling before automated behavior validation is expected to pass.

## Validate Static Quality Gates

```bash
npm run lint
npm run typecheck
npm run build
```

Expected outcome: all commands complete successfully with no lint, type, or build errors.

Validation result: passed on 2026-06-21.

## Validate Formatting

```bash
npm run format
```

Expected outcome: Prettier formats TypeScript and TSX files. Review the resulting diff before committing.

Validation result: passed on 2026-06-21.

## Validate Unit Behavior

```bash
npm run test
```

Expected outcome: unit tests cover header rendering, active navigation state, theme toggle labels, placeholder login behavior, and collapsed navigation state. Changed layout behavior meets at least 80% coverage.

Validation result: passed on 2026-06-21 with 10 unit tests. `npm run test:coverage -- --runInBand` reported 100% statements, branches, functions, and lines for the configured changed-behavior coverage scope.

## Validate End-to-End Layout Behavior

```bash
npm run test:e2e
```

Expected outcome:

- Every available page displays the fixed header and readable main content.
- `/about` highlights `About A.S.C.A.`.
- `/run` highlights `Run A.S.C.A.`.
- Small-screen navigation exposes both core destinations through a menu control.
- GitHub action opens `https://github.com/take44444/asca` in a new tab.
- Theme toggle switches between readable light and dark presentations.
- Login button remains visible and does not start authentication.

Validation result: passed on 2026-06-21 with 7 Chromium Playwright tests. The suite runs against the local Next dev server on port 3100 to avoid unrelated apps on port 3000.

## Manual Smoke Check

```bash
npm run dev
```

Open the local development URL and check:

- The header remains fixed while scrolling.
- Header controls do not overlap on desktop viewports or below the `sm:` breakpoint.
- Navigation reaches `/about` and `/run` in one interaction.
- Placeholder pages do not claim completed About or Run functionality.

## Related Artifacts

- [Specification](./spec.md)
- [Data model](./data-model.md)
- [UI contract](./contracts/ui-contract.md)
