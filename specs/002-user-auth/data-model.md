# Data Model: User Authentication

## AuthenticatedUser

Represents the signed-in person shown in the A.S.C.A. header.

**Fields**:

- `name`: non-empty display name from Google profile.
- `email`: non-empty email address from Google profile.
- `image`: optional profile picture URL from Google profile.

**Validation Rules**:

- `name` is required for avatar fallback and header display.
- `email` is required for account disambiguation in the header.
- `image` may be absent or empty; UI must fall back to the first letter of `name`.

**Relationships**:

- Owned by a `UserSession`.
- Displayed by the header profile control.

## UserSession

Represents the active authenticated state that allows protected page access.

**Fields**:

- `user`: `AuthenticatedUser`.
- `status`: one of `signed-out`, `authenticating`, `authenticated`, `refreshing`, `expired`.
- `expiresAt`: session expiration instant when available from the auth library.

**Validation Rules**:

- An authenticated session must include `user.name` and `user.email`.
- Expired sessions must attempt renewal when a renewal credential is available.
- Failed renewal transitions the user to `signed-out` and requires sign-in before protected access.

**State Transitions**:

```text
signed-out -> authenticating -> authenticated
authenticated -> refreshing -> authenticated
authenticated -> refreshing -> expired -> signed-out
authenticated -> signed-out
```

## AuthProvider

Represents the external identity provider used by this feature.

**Fields**:

- `id`: fixed value `google`.
- `requestedProfileFields`: name, email address, profile picture.
- `configured`: whether required deployment credentials are available.

**Validation Rules**:

- Google is the only supported provider for this feature.
- Missing credentials must surface a recoverable sign-in error state.
- Requested profile fields must not exceed the basic profile data required by the spec.

## ProtectedPage

Represents a page that requires authentication before content is shown.

**Fields**:

- `path`: route path requiring authentication.
- `redirectPath`: route path for unauthenticated users.
- `accessState`: one of `allowed`, `redirected`.

**Validation Rules**:

- `/run` requires `authenticated` session state.
- Unauthenticated `/run` access redirects to `/login`.
- Authenticated `/run` access renders the page content without redirect.
