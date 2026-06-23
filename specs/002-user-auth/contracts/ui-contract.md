# UI Contract: User Authentication

## Routes

### `/login`

**Audience**: Signed-out visitors and users whose session must be renewed by signing in again.

**Required UI**:

- A sign-in card.
- Card heading text: `Sign in to your A.S.C.A. account`.
- Primary action text: `Sign in with Google`.
- Google mark displayed to the left of the action text.

**Behavior**:

- Selecting `Sign in with Google` starts Google authentication.
- Successful authentication redirects to `/`.
- Provider cancellation or failure leaves the user signed out and presents a retry path.
- Missing auth configuration presents a recoverable error state.

**Testable Assertions**:

- `/login` renders the heading and Google sign-in action.
- The Google sign-in action invokes the provider sign-in boundary with redirect target `/`.
- Error and pending states are announced without removing the retry action.

### Header Authentication Area

**Signed-out State**:

- Shows a `Sign In` link.
- Link target is `/login`.
- Existing GitHub and theme controls remain visible.

**Authenticated State**:

- Replaces `Sign In` with a profile control.
- Profile trigger shows avatar, name, and email address.
- Avatar image uses the profile picture when available.
- Avatar fallback uses the first letter of the user's name when no profile picture is available.
- Profile content includes a `Sign Out` action.

**Behavior**:

- Selecting `Sign Out` ends the session and redirects to `/`.
- Header remains responsive and must not overlap existing navigation or action controls.

**Testable Assertions**:

- Signed-out header has a visible `/login` link and no profile menu.
- Authenticated header has a profile trigger with name and email and no sign-in link.
- Missing profile image renders the first-letter fallback.
- Sign-out invokes the sign-out boundary with redirect target `/`.

### `/run`

**Signed-out State**:

- Direct access redirects to `/login`.
- Protected content is not visible before redirect.

**Authenticated State**:

- Page content renders normally.
- Header shows authenticated profile state.

**Testable Assertions**:

- A signed-out visit to `/run` lands on `/login`.
- A signed-in visit to `/run` shows the `Run A.S.C.A.` heading.

## Auth Route Boundary

### `/api/auth/[...nextauth]`

**Purpose**: Provider callback and session endpoints owned by the auth library.

**Required Methods**:

- `GET`
- `POST`

**Behavior**:

- Handles Google OAuth initiation and callback.
- Maintains JWT-backed session cookies.
- Does not create application database session records.

## Accessibility Requirements

- Login card has a clear heading and one primary sign-in action.
- Header profile control is keyboard reachable.
- Profile popover can be opened and closed by keyboard.
- Pending and error states are visible and accessible to assistive technology.
- Redirect behavior must not trap keyboard focus.
