# 003: Run A,S.C.A.

This feature implements the "Run A.S.C.A." page for the A.S.C.A. frontend. Users can chat with A.S.C.A. in a thread in the page. The page is designed to be user-friendly and responsive, providing an intuitive chat experience.

## Requirements

- The page SHALL not be scrollable and SHALL fit within the viewport height.

- Thread list SHALL be displayed on the left side of the page.
  - Thread list SHALL be displayed as a `Card` component.
  - The height of the thread list SHALL be 100% of the viewport height.
  - The thread list SHALL be scrollable if the number of threads exceeds the viewport height.
  - The thread list SHALL display a list of threads.
    - Each thread card SHALL display the thread title.
  - The button to create a new thread SHALL be displayed as a `Button` component at the top of the thread list.
    - The `Button` component SHALL have the text "Create New Thread".
    - The `Button` component SHALL have a `MessageSquarePlusIcon` on the left side of the text.

- WHEN a user clicks on a thread in the thread list, THEN it SHALL display the corresponding thread content on the right side of the page.
  - The height of the thread content SHALL be 100% of the viewport height.
  - The thread content SHALL display the title on the top of the thread.
  - The thread content SHALL display a text input field as a `PromptInput` component at the bottom of the thread for users to type their messages.
  - The thread content SHALL display the list of messages as `Message` components in the thread.
  - Each `Message` component SHALL include `Avatar`, `MessageContent`, and `MessageActions` components.
    - The `Avatar` component SHALL display the profile picture of the user who sent the message.
    - The `MessageContent` component SHALL display the text of the message.
      - The text of the message SHALL be displayed as a `Markdown` component to support markdown formatting.
    - The `MessageActions` component SHALL include a "Copy to clipboard" button for each message.
      - The `MessageActions` component SHALL include a `MessageAction` component whose tooltip parameter is set to "Copy to clipboard".
        - The `Button` component SHALL have a `CopyIcon`.
      - WHEN the user clicks the button, THEN it SHALL copy the message text to the clipboard and the `Button` SHALL display a `CopyCheckIcon` for a short duration.
  - The thread content SHALL be scrollable if the number of messages exceeds the viewport height.
  - WHEN the scroll position is a middle of thread content, THEN it SHALL display a `ScrollButton` component at the bottom of the thread content.
  - WHEN the message from A.S.C.A. is received, THEN it SHALL automatically scroll to the bottom of the thread content to show the latest message.
  - WHEN receiving a message from A.S.C.A., THEN it SHALL display the text "A.S.C.A. is thinking..." as a `TextShimmer` component in the thread content to indicate that A.S.C.A. is processing the request.

- For chatting functionality, use `useChat` hook to manage the state of the chat messages and handle sending and receiving messages.

## Environment Variables

- `OPENAI_API_KEY`: The API key for accessing the OpenAI API.
  - The value is already set in the `.env.local` file, so you can use it for testing.

## Out of Scope

- Fetching threads from the backend and displaying them in the thread list is out of scope for this feature. The thread list SHALL just have one thread for demonstration purposes.
- Creating a new thread is out of scope for this feature. The "Create New Thread" button SHALL not have any functionality in this feature.
- Multi-modal input (e.g., image, audio) is out of scope for this feature. The `PromptInput` component SHALL only support text input for this feature.
