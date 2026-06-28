# 008: Agent

This feature implements the main functionality of A.S.C.A. Users can create or customize agents based on the job roles. Users can configure the agents with its name, role, knowledge, and the integration with external apps. The agents perform tasks autonomously based on the configuration.

We had called this feature "Thread" in the current implementation, but we will rename it to "Agent" in the future. Rename all the "thread" / "threads" keywords to "agent"/ "agents" in the codebase, including the file names, variable names, function names, class names, and comments.

## Requirements

- Thread list view SHALL be renamed to Agent list view.
  - "Create New Thread" button SHALL be renamed to "Create New Agent" button.
  - Each agent item in the list SHALL be displayed as a `@/components/ui/item:Item` component, showing the agent name.
    - The agent item SHALL have a `ItemContent` which contains an `ItemTitle` showing the agent name.
    - The number of messages SHALL not be displayed in the agent item.

- The agent card SHALL be displayed above the ~~Thread~~AgentMetadataSummaryCard.
  - The agent card SHALL be displayed as a `@/components/ui/card:Card` component.
    - The agent card SHALL contain a `@/components/ui/card:CardHeader` component.
      - The `CardHeader` SHALL contain a `@/components/ui/card:CardTitle` with the agent name.
      - The `CardHeader` SHALL contain a `@/components/ui/card:CardAction` with an configuration button on the right side of the card.
        - The configuration button SHALL be displayed as a `@/components/ui/tooltip:Tooltip` component containing a `@/components/ui/tooltip:TooltipTrigger` component with a `@/components/ui/button:Button` component.
        - The configuration button SHALL contain a `@/components/icons/lucide-settings:SettingsIcon`.
        - The `TooltipContent` SHALL display the text "Configure Agent".
    - The agent card SHALL contain a `@/components/ui/card:CardContent` component.
      - The `CardContent` SHALL contain a `@/components/ui/markdown:Markdown` component which displays the agent role in markdown format. The markdown content can be long, so the `CardContent` SHALL be scrollable if the content exceeds the viewport height.

- Conversation panel SHALL not have a header.

- The name of the agent which sends the message SHALL be the agent name instead of "A.S.C.A.".

## Environment Variables

- `OPENAI_API_KEY`: The API key for accessing the OpenAI API.
  - The value is already set in the `.env.local` file, so you can use it for testing if needed.

## Out of Scope

- Edit button in the agent card SHALL not have any functionality in this feature. The edit functionality will be implemented in a future feature. The 
