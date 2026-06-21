# Data Model: Layout

## Layout

**Purpose**: Represents the shared page frame used by every A.S.C.A. frontend page.

**Fields**:

- `header`: Header displayed at the top of the viewport.
- `mainContent`: Current route content displayed below the fixed header.
- `supportedViewport`: Desktop presentation mode or below-`sm:` presentation mode.

**Relationships**:

- Contains one `Header`.
- Wraps every `PlaceholderPage` and future page.

**Validation Rules**:

- Header is present on every page.
- Main content starts below the fixed header and remains readable while scrolling.
- Layout does not require backend data.

## Header

**Purpose**: Persistent top navigation and action region.

**Fields**:

- `logoText`: Fixed display text `A.S.C.A.`.
- `navigationItems`: Ordered list of core navigation destinations.
- `githubAction`: External repository action.
- `themeToggle`: Light/dark mode control.
- `loginAction`: Placeholder login button.
- `isNavigationCollapsed`: Whether below-`sm:` menu presentation is active.

**Relationships**:

- Contains many `NavigationItem` records.
- Contains one `ThemePreference`.

**Validation Rules**:

- Logo appears on the left side.
- Desktop navigation appears centered when space allows.
- Collapsed navigation appears through a left-side menu control below the `sm:` breakpoint.
- GitHub action, theme toggle, and login action remain visible on the right side in that order.
- Controls remain readable, operable, and non-overlapping.

## NavigationItem

**Purpose**: Represents a top-level route reachable from the header.

**Fields**:

- `label`: Human-readable label. Allowed values: `About A.S.C.A.`, `Run A.S.C.A.`.
- `route`: Internal route. Allowed values: `/about`, `/run`.
- `isActive`: Whether the item matches the current page.

**Relationships**:

- Belongs to `Header`.
- Opens one `PlaceholderPage` for this feature.

**Validation Rules**:

- Exactly two items exist for this feature.
- The active item matches the current route after direct load and after navigation.
- Each item is reachable from desktop and collapsed navigation presentations.

## ThemePreference

**Purpose**: Represents the user's current visual theme.

**Fields**:

- `currentTheme`: Current resolved theme. Allowed values: `light`, `dark`.
- `nextTheme`: Theme that will be selected by activating the toggle. Allowed values: `light`, `dark`.
- `tooltip`: User-facing tooltip for the next action.

**State Transitions**:

- `light` -> `dark` when the user activates the theme toggle.
- `dark` -> `light` when the user activates the theme toggle.

**Validation Rules**:

- In light mode, the toggle indicates dark mode and tooltip text is `Switch to dark theme`.
- In dark mode, the toggle indicates light mode and tooltip text is `Switch to light theme`.
- Both modes preserve readable contrast.

## PlaceholderPage

**Purpose**: Represents a reachable destination whose full content is outside this feature.

**Fields**:

- `title`: Page title shown to users and assistive technology.
- `route`: Page route.
- `placeholderContent`: Short content indicating the page exists.

**Validation Rules**:

- `About A.S.C.A.` page exists at `/about`.
- `Run A.S.C.A.` page exists at `/run`.
- Each page has a unique descriptive title or primary heading.
- Placeholder content must not claim completed functionality outside this feature.
