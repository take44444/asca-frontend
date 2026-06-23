# Quickstart: User Authentication

## Prerequisites

- Google OAuth application credentials for local development.
- Local environment values:
  - `AUTH_GOOGLE_ID`
  - `AUTH_GOOGLE_SECRET`
  - `AUTH_SECRET`
- Dependencies installed with the versions declared in `package.json`.

## Setup

1. Confirm the feature pointer:

   ```bash
   cat .specify/feature.json
   ```

   Expected: `feature_directory` points to `specs/002-user-auth`.

2. Add local auth secrets to `.env.local`. Do not commit real secret values.

   Use `.env.example` as the template. Real Google OAuth is required only for
   live provider validation; automated tests use deterministic mocked sessions
   and do not contact Google.

3. Start the app:

   ```bash
   npm run dev
   ```

## Validation Scenarios

### Signed-Out Login Flow

1. Open `/`.
2. Select `Sign In` in the header.
3. Confirm the browser is on `/login`.
4. Confirm the page shows `Sign in to your A.S.C.A. account`.
5. Select `Sign in with Google`.
6. Confirm the Google provider flow starts.

Expected outcome: the login page matches [UI contract](./contracts/ui-contract.md), and provider initiation happens from one primary action.

### Successful Sign-In

1. Complete Google sign-in with a valid account.
2. Confirm the app redirects to `/`.
3. Confirm the header shows avatar, name, and email address instead of `Sign In`.

Expected outcome: session data matches [data model](./data-model.md), and the authenticated header state is visible without a manual refresh.

### Avatar Fallback

1. Use or mock an authenticated session without a profile picture URL.
2. Open `/`.
3. Confirm the profile avatar fallback displays the first letter of the user's name.

Expected outcome: the authenticated header remains complete when the provider does not supply an image.

### Sign-Out

1. Start from an authenticated header.
2. Open the profile control.
3. Select `Sign Out`.
4. Confirm the browser returns to `/`.
5. Confirm the header shows `Sign In`.

Expected outcome: the session ends and the signed-out header state is restored.

### Protected Run Page

1. Sign out.
2. Navigate directly to `/run`.
3. Confirm the browser redirects to `/login`.
4. Sign in.
5. Navigate to `/run`.
6. Confirm the `Run A.S.C.A.` heading is visible.

Expected outcome: signed-out users cannot see protected content, while signed-in users can access the route.

## Automated Test Mode

Playwright runs the app with `ASCA_E2E_AUTH=1` and dummy Auth.js secrets. In
that mode tests can set the `asca-e2e-auth` cookie to exercise authenticated
header and `/run` behavior deterministically. This does not replace manual
validation with real Google OAuth credentials before deployment.

## Required Commands

Run before considering implementation complete:

```bash
npm run lint
npm run format
npm run typecheck
npm run test -- --runInBand
npm run test:coverage -- --runInBand
npm run test:e2e
npm run build
```

Coverage must remain at or above 80% for changed authentication behavior.
