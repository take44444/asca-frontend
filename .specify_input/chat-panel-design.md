# 005: Conversation Panel Design

This feature enhances the design of the conversation panel in the A.S.C.A. frontend, providing a more user-friendly and visually appealing interface for users to interact with A.S.C.A.

## Requirements

- Conversation Panel SHALL be `Card` component.
  - `CardHeader` SHALL contain the `CardTitle` with the title of the thread and the `CardDescription` with the number of messages in the thread.
  - `CardContent` SHALL contain the messages in the thread, displayed in a scrollable area.
  - `CardFooter` SHALL contain `PromptInput` component.
  - DO NOT change the existing functionality of the conversation panel, such as sending and receiving messages, scrolling behavior, message formatting, and other interactive features.
  - The conversation panel SHALL be responsive and adapt to different screen sizes, ensuring a consistent user experience across devices.

- Above the conversation panel, display 4 `Card` components in a single horizontal row.
  - Each `Card` component SHALL display metadata for the four types of artifacts or data related to the thread.
    - Each `Card` component SHALL be visually distinct and easily identifiable, using appropriate colors, icons, and typography to differentiate between the different types of artifacts or data.
  - The four types of artifacts or data to be displayed are:
    1. Tasks: (icon: `ListTodoIcon`)
    2. Artifacts: (icon: `PackageCheckIcon`)
    3. Knowledge (icon: `BrainCircuitIcon`)
    4. Total tokens (icon: `ChartSplineIcon`)
  - Task Card SHALL display the number of completed tasks and the number of pending tasks in the thread.
  - Artifacts Card SHALL display the number of artifacts in the thread, categorized by its type (research, document, image).
  - Knowledge Card SHALL display the number of knowledge items A.S.C.A. has acquired in the thread.
  - Total Tokens Card SHALL display a `ChartContainer` component that shows the number of input and output tokens used in the thread over time using `LineChart` component.
    - WHEN the user hovers over the chart, THEN a tooltip SHALL display the exact number of input and output tokens used at that point in time using `ChartTooltip` and `ChartTooltipContent` components.
    - Input and output tokens SHALL be displayed in different colors to differentiate between them.
    - The time period for the chart SHALL be last 7 days.
  - The four `Card` components SHALL be responsive and adapt to different screen sizes, ensuring a consistent user experience across devices. On smaller screens, the `Card` components SHALL be small and the only the icons and counts SHALL be displayed, while on larger screens, the full content of the `Card` components SHALL be displayed.

## Environment Variables

- `OPENAI_API_KEY`: The API key for accessing the OpenAI API.
  - The value is already set in the `.env.local` file, so you can use it for testing.

## Out of Scope

- Fetching and displaying the actual data for tasks, artifacts, knowledge, and total tokens is out of scope for this feature. The data will be mocked or static for design purposes. The focus is solely on the design and layout of the conversation panel and the four `Card` components above it.
