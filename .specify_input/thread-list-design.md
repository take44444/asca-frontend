# 005: Thread List Design

This feature enhances the design of the thread list in the A.S.C.A. frontend, providing a more user-friendly and visually appealing interface for users to interact with A.S.C.A.

## Requirements

- Thread List SHALL be `Card` component.
  - `CardHeader` SHALL contain the button to create a new thread. The title "Threads" is not required in the header because the button to create a new thread is self-explanatory and indicates the purpose of the section.
    - The button to create a new thread SHALL be displayed as a `Button` component.
    - The `Button` component SHALL have the text "Create New Thread".
    - The `Button` component SHALL have a `MessageSquarePlusIcon` on the left side of the text.
  - `CardContent` SHALL contain the list of threads.
    - The thread list SHALL be scrollable if the number of threads exceeds the viewport height.
    - Each thread card SHALL be displayed as a `Card` component, showing the thread title and the number of messages in the thread.

- WHEN a user clicks on a thread in the thread list, THEN it SHALL display the corresponding thread content on the right side of the page.

## Environment Variables

- `OPENAI_API_KEY`: The API key for accessing the OpenAI API.
  - The value is already set in the `.env.local` file, so you can use it for testing if needed.

## Out of Scope

- Fetching threads from the backend and displaying them in the thread list is out of scope for this feature. The thread list SHALL just have 20 threads for demonstration purposes.
- Creating a new thread is out of scope for this feature. The "Create New Thread" button SHALL not have any functionality in this feature.
- The design of the thread content on the right side of the page is out of scope for this feature. The focus is solely on the design and layout of the thread list on the left side of the page.
