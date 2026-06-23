# 002: Authentication

This feature implements user authentication for the A.S.C.A. frontend.

## Requirements

- WHEN a user clicks the "Sign In" link on the header, THEN it SHALL navigate to the sign-in page.
  - The path for the sign-in page SHALL be "/login".

- The sign-in page SHALL show a sign-in `Card` component.
  - In the `CardHeader`, it SHALL display the text "Sign in to your A.S.C.A. account".
  - In the `CardContent`, it SHALL include a `Button` component for signing in with Google.
    - The `Button` component SHALL have the text "Sign in with Google".
    - The `Button` component SHALL have a `GoogleFillIcon` on the left side of the text.

- WHEN the user clicks the Google sign-in button, THEN it initiates the Google authentication process.
  - `next-auth` SHALL be used to handle the authentication process with Google.
  - The authentication process SHALL request appropriate scopes for accessing the user's basic profile information (name, email, profile picture).
  - WHEN the user successfully authenticates with Google, THEN it SHALL redirect the user to "/".

- JWT tokens SHALL be used to manage user sessions after successful authentication.
  - Upon successful authentication, the backend SHALL get a name, email, and profile picture URL from the Google profile and create a JWT token containing this information.
  - WHEN the access token expires, THEN it SHALL automatically attempt to refresh the token using a refresh token, if available.
  - IF the token refresh fails (e.g., due to an invalid refresh token), THEN it SHALL force the user to sign in to obtain a new set of access and refresh tokens.
  - It SHALL not use DB to store user sessions; instead, it SHALL rely solely on JWT tokens for session management.

- WHILE the user is authenticated, THEN the frontend SHALL display the user profile information instead of the `SignInLink` in the header.
  - The user profile information SHALL be displayed as `Popover` component.
  - The `PopoverTrigger` SHALL include the avatar, name, and email address of the authenticated user.
  - The avatar SHALL be displayed as `Avatar` component.
    - The profile picture SHALL be displayed as `AvatarImage` component.
    - IF the user does not have a profile picture, THEN it SHALL display the first letter of the user's name as a fallback in the `AvatarFallback` component.
    - The user's name and email address SHALL be displayed next to the avatar.
  - The `PopoverContent` SHALL include a "Sign Out" `Button` component.
    - WHEN the user clicks the "Sign Out" button, THEN it SHALL sign the user out and redirect them to the home page ("/").

- "Run A.S.C.A." page SHALL be protected and only accessible to authenticated users.
  - IF an unauthenticated user tries to access the "Run A.S.C.A." page, THEN they SHALL be redirected to the sign-in page.

## Environment Variables

- `AUTH_GOOGLE_ID`: The Google OAuth client ID for the application.
- `AUTH_GOOGLE_SECRET`: The Google OAuth client secret for the application.
- `AUTH_SECRET`: The secret key used to sign and verify JWT tokens.
