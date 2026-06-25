# 004: Stream Text

This feature implements the "Stream Text" functionality for the A.S.C.A. frontend. It allows users to receive streaming responses from A.S.C.A. in real-time, providing a more interactive and engaging chat experience.

## Requirements (EARS Format)

- The system SHALL support streaming responses from A.S.C.A. using the OpenAI API.
  - WHEN a user sends a message to A.S.C.A., THEN the system SHALL initiate a streaming response from the OpenAI API.
  - The system SHALL display the streaming response in real-time as it is received from the OpenAI API.

## Environment Variables

- `OPENAI_API_KEY`: The API key for accessing the OpenAI API.
  - The value is already set in the `.env.local` file, so you can use it for testing.
