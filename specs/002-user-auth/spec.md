# Feature Specification: User Authentication

**Feature Branch**: `002-user-auth`

**Created**: 2026-06-23

**Status**: Draft

**Input**: User description: "Create spec from requirements in .specify_input/auth.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign In With Google (Priority: P1)

An unauthenticated visitor can open the sign-in page from the header and start Google sign-in from a clear, focused login screen.

**Why this priority**: Authentication is the entry point for all protected A.S.C.A. workflows and must be available before protected pages can safely expose user-specific functionality.

**Independent Test**: Can be fully tested by visiting the site signed out, selecting the header sign-in entry, confirming the login screen content, and starting the Google sign-in flow.

**Acceptance Scenarios**:

1. **Given** a visitor is not signed in, **When** they select "Sign In" in the header, **Then** they are taken to `/login`.
2. **Given** a visitor is on `/login`, **When** the page loads, **Then** they see the text "Sign in to your A.S.C.A. account" and a "Sign in with Google" action with a Google mark.
3. **Given** a visitor is on `/login`, **When** they choose "Sign in with Google", **Then** the Google authentication flow begins and requests access to the user's basic profile information.

---

### User Story 2 - Maintain Authenticated Session (Priority: P2)

After a successful Google sign-in, the user remains signed in through a session that includes their name, email address, and profile picture when available.

**Why this priority**: Users need continuity after signing in so they can navigate A.S.C.A. without repeatedly authenticating.

**Independent Test**: Can be fully tested by completing Google sign-in and confirming the user returns to the home page with an authenticated session.

**Acceptance Scenarios**:

1. **Given** a user completes Google authentication successfully, **When** the sign-in flow finishes, **Then** they are redirected to `/`.
2. **Given** a user has an active session, **When** the session is checked, **Then** it includes the user's name, email address, and profile picture URL when Google provides one.
3. **Given** a user's session can no longer be refreshed, **When** they attempt to continue using authenticated features, **Then** they are required to sign in again.

---

### User Story 3 - Show Profile And Sign Out (Priority: P3)

An authenticated user sees their profile information in the header instead of the sign-in link and can sign out from that profile control.

**Why this priority**: Users need visible confirmation of the active account and a predictable way to end their session.

**Independent Test**: Can be fully tested by signing in, inspecting the header profile display, opening its menu, and signing out.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they view the header, **Then** the sign-in link is replaced with a profile control showing avatar, name, and email address.
2. **Given** an authenticated user has no profile picture, **When** the header profile control is shown, **Then** the avatar fallback displays the first letter of the user's name.
3. **Given** an authenticated user opens the profile control, **When** they select "Sign Out", **Then** they are signed out and redirected to `/`.

---

### User Story 4 - Protect Run A.S.C.A. (Priority: P4)

Only authenticated users can access the "Run A.S.C.A." page.

**Why this priority**: The protected run area must not be accessible to anonymous visitors once authentication is introduced.

**Independent Test**: Can be fully tested by attempting to visit the run page while signed out and while signed in.

**Acceptance Scenarios**:

1. **Given** a visitor is not authenticated, **When** they attempt to access "Run A.S.C.A.", **Then** they are redirected to `/login`.
2. **Given** a user is authenticated, **When** they access "Run A.S.C.A.", **Then** they can view the page without being redirected.

### Edge Cases

- If Google denies or cancels authentication, the user remains signed out and receives a clear path to retry sign-in.
- If required authentication configuration is missing, users see a recoverable sign-in error rather than a broken or blank page.
- If a returning user's session has expired but can be refreshed, the user remains signed in without taking manual action.
- If a user's Google profile does not include a picture, the header uses the name fallback avatar.
- If an unauthenticated user directly enters the protected run page address, they are redirected to `/login`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST route unauthenticated users who select the header "Sign In" entry to `/login`.
- **FR-002**: The `/login` page MUST present a focused sign-in card with the text "Sign in to your A.S.C.A. account".
- **FR-003**: The sign-in card MUST include a "Sign in with Google" action with a Google mark shown to the left of the action text.
- **FR-004**: The system MUST start Google authentication when the user selects the "Sign in with Google" action.
- **FR-005**: The authentication flow MUST request only the user's basic Google profile information: name, email address, and profile picture.
- **FR-006**: After successful authentication, the system MUST return the user to `/`.
- **FR-007**: The system MUST maintain signed-in user sessions without storing server-side session records in an application database.
- **FR-008**: The user session MUST include the authenticated user's name, email address, and profile picture URL when available.
- **FR-009**: The system MUST attempt to continue an authenticated session automatically when a session credential expires and a renewal credential is available.
- **FR-010**: If session renewal fails, the system MUST require the user to sign in again before accessing authenticated features.
- **FR-011**: While authenticated, the header MUST replace the sign-in entry with a profile control that displays the user's avatar, name, and email address.
- **FR-012**: The profile control MUST display the profile picture when available and the first letter of the user's name when no profile picture is available.
- **FR-013**: The profile control MUST expose a "Sign Out" action.
- **FR-014**: Selecting "Sign Out" MUST end the user's session and redirect the user to `/`.
- **FR-015**: Authenticated users with an active session MUST be able to view the "Run A.S.C.A." page without being redirected.
- **FR-016**: Unauthenticated users who attempt to access `/run` directly or through navigation MUST be redirected to `/login` before protected content is visible.
- **FR-017**: System MUST define required A.S.C.A. backend API inputs, outputs, and error states, or state that no backend interaction is required.
- **FR-018**: System MUST expose loading, error, empty, and success states for user-facing asynchronous authentication behavior.

### Key Entities

- **Authenticated User**: A signed-in person represented by name, email address, and optional profile picture URL from their Google profile.
- **User Session**: The active authentication state that allows the user to remain signed in and access protected areas.
- **External Authentication Provider**: Google sign-in as the identity source for this feature.
- **Protected Page**: A page that requires an active user session before it can be viewed, beginning with "Run A.S.C.A.".

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of unauthenticated users can navigate from the header to the sign-in page in one interaction.
- **SC-002**: 90% of test users can identify and start the Google sign-in action within 10 seconds of landing on `/login`.
- **SC-003**: 95% of successful sign-ins return users to `/` and show authenticated header information without requiring an additional manual refresh.
- **SC-004**: 100% of unauthenticated attempts to access "Run A.S.C.A." are redirected to `/login`.
- **SC-005**: 95% of authenticated users can find and complete sign-out from the header profile control within 15 seconds.
- **SC-006**: New or changed behavior has automated tests written before implementation and maintains at least 80% coverage for that behavior.

## Assumptions

- Google is the only sign-in provider required for this feature.
- Authentication credentials and signing secrets are configured outside the user interface before deployment.
- No A.S.C.A. backend API interaction is required for this feature beyond authentication/session handling; "Run A.S.C.A." remains protected at the frontend boundary until backend functionality is specified separately.
- Session data is limited to the minimum profile information needed to identify the user in the interface.
- The existing header, navigation, theme controls, and responsive behavior from the layout feature remain in place and are extended only where authentication changes their visible state.
