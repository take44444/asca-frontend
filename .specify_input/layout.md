# Feature 001: Layout

This feature implements a layout of A.S.C.A. frontend. The layout includes a header and a main content area. The layout is applied to all pages of the A.S.C.A. frontend.

## Requirements (EARS Format)

- The header of the A.S.C.A. frontend SHALL be fixed at the top of the page and span the full width of the viewport.

- Header SHALL contain the logo of A.S.C.A.
  - The logo SHALL be placed on the left side of the header.
  - The logo SHALL be a simple stylized representation of the letters "A.S.C.A." in a modern font for now.

- Header SHALL contain a navigation menu on the center of the header.
  - The navigation menu SHALL include links to "About A.S.C.A." and "Run A.S.C.A.".
  - WHEN the user in the "About A.S.C.A." page, the navigation menu SHALL highlight the "About A.S.C.A." link to indicate the current page.
  - WHEN the user in the "Run A.S.C.A." page, the navigation menu SHALL highlight the "Run A.S.C.A." link to indicate the current page.
  - The navigation menu SHALL be responsive and adapt to different screen sizes, collapsing into a hamburger menu (`MenuIcon`) on the left side of the header on smaller screens (e.g., mobile devices).

- Header SHALL contain a login button.
  - The login button SHALL be placed on the right side of the header.
  - The login button SHALL display the text "Login".
  - The login button SHALL be placed on the right side of the header even on smaller screens.

- Header SHALL contain a theme toggle button.
  - The theme toggle button SHALL be placed on the right side of the header, left of the login button.
  - The theme toggle button SHALL allow users to switch between light and dark themes.
  - WHEN the current theme is light, the theme toggle button SHALL display a `MoonIcon` to indicate that clicking it will switch to dark theme.
  - WHEN the current theme is dark, the theme toggle button SHALL display a `SunIcon` to indicate that clicking it will switch to light theme.
  - The theme toggle button SHALL have a tooltip that displays "Switch to dark theme" when the current theme is light, and "Switch to light theme" when the current theme is dark.
  - The theme toggle button SHALL be placed on the right side of the header, left of the login button, even on smaller screens.

- Header SHALL contain a GitHub link.
  - The GitHub link SHALL be placed on the right side of the header, left of the theme toggle button.
  - The GitHub link SHALL open the [A.S.C.A. GitHub repository](https://github.com/take44444/asca) in a new tab when clicked.
  - The GitHub link SHALL display a `GitHubLoopIcon` to indicate that it is a link to the GitHub repository.
  - The GitHub link SHALL have a tooltip that displays "Visit GitHub Repository" when hovered.
  - The GitHub link SHALL be placed on the right side of the header, left of the theme toggle button, even on smaller screens.

## Out of Scope

- The implementation of the login functionality is out of scope for this feature. The login button will be a placeholder without any functionality for now.
- The actual content of the "About A.S.C.A." and "Run A.S.C.A." pages is out of scope for this feature. Implement the pages with placeholder content for now.
