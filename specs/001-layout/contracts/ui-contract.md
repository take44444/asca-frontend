# UI Contract: Layout

## Routes

| Route | Page | Required Header State | Content Scope |
|-------|------|-----------------------|---------------|
| `/` | Landing or default page | Header visible; no core nav item active unless redirected to a core page | May show placeholder/default content |
| `/about` | About A.S.C.A. | `About A.S.C.A.` active | Placeholder content only |
| `/run` | Run A.S.C.A. | `Run A.S.C.A.` active | Placeholder content only |

## Header Regions

| Region | Desktop Contract | Small-Screen Contract |
|--------|------------------|-----------------------|
| Left | A.S.C.A. logo | Menu control followed by or paired with A.S.C.A. logo |
| Center | Visible navigation links for `About A.S.C.A.` and `Run A.S.C.A.` | Navigation links available inside collapsed menu |
| Right | GitHub action, theme toggle, Login button | GitHub action, theme toggle, Login button remain visible in the same order |

## Navigation Behavior

- Selecting `About A.S.C.A.` opens `/about`.
- Selecting `Run A.S.C.A.` opens `/run`.
- The active item reflects the current route on direct page load and after navigation.
- Collapsed navigation exposes the same destinations as desktop navigation.

## Header Actions

### GitHub

- Label or accessible name: `Visit GitHub Repository`
- Destination: `https://github.com/take44444/asca`
- Opens in a new tab.
- Does not replace the current A.S.C.A. page.

### Theme Toggle

- Light mode state:
  - Indicates the next action is switching to dark theme.
  - Tooltip: `Switch to dark theme`
- Dark mode state:
  - Indicates the next action is switching to light theme.
  - Tooltip: `Switch to light theme`
- Activating the control changes the visual theme in one interaction.

### Login

- Text: `Login`
- Behavior: Placeholder only.
- Must not start authentication, open a login form, or imply a signed-in state.

## Accessibility and Layout Guarantees

- Header remains fixed at the top of the viewport.
- Main content is not hidden under the fixed header.
- Interactive controls have keyboard-operable semantics.
- Current page indication is available visually and programmatically where practical.
- Header controls do not overlap at common desktop and mobile viewport widths.
- Each placeholder page has a unique descriptive heading for route announcements.

## Backend Contract

No A.S.C.A. backend API contract exists for this feature. No request payloads, response payloads, loading states, error states, or backend coordination are required.
