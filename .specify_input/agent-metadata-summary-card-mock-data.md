# 009: Mock Data for Agent Metadata Summary Card

This feature provides mock data for the Agent Metadata Summary Card component. 

## Requirements

- Each summary card SHALL display the content items in the card content area.
  - Knowledge summary card SHALL contain a `@/components/ui/item:ItemGroup` component with a `@/components/ui/item:Item` component for each knowledge item.
    - Each knowledge item SHALL contain a `@/components/ui/item:ItemContent` component.
      - The `@/components/ui/item:ItemContent` component SHALL contain a `@/components/ui/item:ItemTitle` component displaying the knowledge item title. The title text SHALL be truncated if it exceeds the maximum length.
      - The `@/components/ui/item:ItemContent` component SHALL contain a `@/components/ui/item:ItemDescription` component displaying the knowledge item description. The description text SHALL be truncated if it exceeds the maximum length.
    - The knowledge item list SHALL be scrollable if the number of knowledge items exceeds the viewport height.
  - Social summary card SHALL contain a `@/components/ui/item:ItemGroup` component with a `@/components/ui/item:Item` component for each player.
    - Each player item SHALL contain a `@/components/ui/item:ItemMedia` component and a `@/components/ui/item:ItemContent` component.
      - The `@/components/ui/item:ItemMedia` component SHALL contain a `@/components/ui/avatar:Avatar` component with the player avatar image.
      - The `@/components/ui/item:ItemContent` component SHALL contain a `@/components/ui/item:ItemTitle` component displaying the player name. The name text SHALL be truncated if it exceeds the maximum length.
    - The player item list SHALL be scrollable if the number of players exceeds the viewport height.
  - The artifact summary card SHALL contain a `@/components/ui/item:ItemGroup` component with a `@/components/ui/item:Item` component for each artifact.
    - Each artifact item SHALL contain a `@/components/ui/item:ItemMedia` component and a `@/components/ui/item:ItemContent` component.
      - The `@/components/ui/item:ItemMedia` component SHALL contain an icon representing the artifact type.
        - WHEN the artifact type is "document", the icon SHALL be a `@/components/icons/lucide-file-text:FileTextIcon` component.
        - WHEN the artifact type is "image", the icon SHALL be a `@/components/icons/lucide-file-image:FileImageIcon` component.
      - The `@/components/ui/item:ItemContent` component SHALL contain a `@/components/ui/item:ItemTitle` component displaying the artifact name. The name text SHALL be truncated if it exceeds the maximum length.
      - The `@/components/ui/item:ItemContent` component SHALL contain a `@/components/ui/item:ItemDescription` component displaying the artifact data size.
    - The artifact item list SHALL be scrollable if the number of artifacts exceeds the viewport height.
  - About token usage summary, the content is already displayed in the card content area, so no changes are needed for this summary card.

## Environment Variables

- `OPENAI_API_KEY`: The API key for accessing the OpenAI API.
  - The value is already set in the `.env.local` file, so you can use it for testing if needed.

## Out of Scope

- Each item in the summary cards SHALL not have any click functionality. The click functionality will be implemented in a future feature.
- The avatar images for the players in the social summary card SHALL not be fetched from the backend. It SHALL be just fallbacked to the initials of the player name. The avatar image fetching functionality will be implemented in a future feature.
