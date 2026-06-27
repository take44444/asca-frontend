# 007: Event

This feature implements an event view in the A.S.C.A. frontend. The event view shows a list of external events related to the current thread that have been submitted to A.S.C.A.

## Requirements

- The event view SHALL be displayed as a `Card` component.
  - `CardHeader` SHALL contain a `CardTitle` with the text "Events".
  - `CardContent` SHALL contain the list of events.
    - The event list SHALL be scrollable if the number of events exceeds the viewport height.

- Each event item in the list SHALL be displayed as a `@/components/ui/item:Item` component, showing the app icon which published the event, the name who submitted the event, the content of the event, and the date of the event.
  - The event item SHALL have a `ItemMedia` with `variant="image"` with the app icon on the left side of the item.
    - It SHALL show the app icon of the app which published the event. The app SHALL be determined by the `app` field in the event data. The following mapping SHALL be used to determine the app icon:
      - `slack` -> `@/components/icons/logos-slack-icon:SlackIconIcon`
      - `microsoft-teams` -> `@/components/icons/logos-microsoft-teams:MicrosoftTeamsIcon`
      - `discord` -> `@/components/icons/logos-discord-icon:DiscordIconIcon`
      - `x` -> `@/components/icons/logos-x:XIcon`
      - `github` -> `@/components/icons/logos-github-icon:GithubIconIcon`
      - The app is always one of the above apps, so no other app icons are needed.
  - The event item SHALL have a `ItemContent`.
    - It SHALL contain an `ItemTitle` showing the sender who submitted the event and the thread in the external app, where the event was submitted. The following format SHALL be used for the title: "{sender} `in: {thread}`".
      - The `sender` SHALL be determined by the `sender` field in the event data.
      - The `thread` SHALL be determined by the `thread` field in the event data. The `thread` SHALL be displayed as a `@/components/badge:Badge` component with "in: {thread}". The thread field is optional in the event data, so if it is not present, the title SHALL just show the sender without the thread.
    - It SHALL contain an `ItemDescription` with the content of the event.
  - The event item SHALL have a `ItemActions` with the date of the event on the right side of the item.

## Environment Variables

- `OPENAI_API_KEY`: The API key for accessing the OpenAI API.
  - The value is already set in the `.env.local` file, so you can use it for testing.

## Out of Scope

- Fetching events from the backend and displaying them in the event list is out of scope for this feature. The event list SHALL just have 20 events for demonstration purposes.
  - To check the visual design of the event list, make various events with different app icons, senders, threads, and content.
- The event item SHALL not have any functionality on click in this feature.
