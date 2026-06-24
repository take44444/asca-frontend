# UI Contract: Run A.S.C.A.

## Route

`/run`

The route is authenticated. Signed-out users redirect to `/login` before protected content is visible.

## Layout

- Supported desktop viewports show a left thread list and right conversation area.
- The page fits within the viewport height minus the global header and does not create whole-page vertical scrolling during normal chat use.
- The thread list scrolls independently when overflowing.
- The conversation message list scrolls independently while the prompt input remains anchored at the bottom.

## Thread List

- Shows one selected demonstration thread with a visible title.
- Shows a visible Create New Thread action at the top.
- Create New Thread is unavailable or non-functional in this feature.
- Selecting the demonstration thread renders its title, history, and prompt area.

## Conversation

- Empty history remains usable and still shows title and prompt input.
- Submitted user prompts appear immediately as user messages.
- While waiting for the route response, the exact text `A.S.C.A. is thinking...` is visible.
- A successful assistant response appears as the latest A.S.C.A. message.
- When a new assistant response arrives, the message list moves to the latest message.
- When the user is away from the bottom, a visible control returns to the latest message.

## Prompt Input

- Accepts text-only prompts.
- Empty or whitespace-only prompts do not create messages and do not call the route.
- Send is disabled while a response is pending.
- The prompt remains available at the bottom of the conversation area.

## Messages

- Each message identifies the sender as user or A.S.C.A.
- Each message includes a sender visual.
- Message bodies render common markdown formatting.
- Each message has a copy action that copies original unmodified text.
- Successful copy shows temporary success feedback.
- Failed copy shows a non-blocking failure state and leaves the message visible.

## Error States

- Route or network failures show a non-blocking error state in the conversation.
- The submitted user message remains visible after failure.
- The user can continue editing or submit again after a failure.
