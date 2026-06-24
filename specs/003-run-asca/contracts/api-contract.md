# API Contract: Run A.S.C.A. Chat

## Endpoint

`POST /api/asca/chat`

Creates one assistant response for the selected demonstration thread.

## Authentication

The request requires an authenticated session from the existing Auth.js integration. Signed-out requests return `401`.

## Environment

- `OPENAI_API_KEY`: Required for real OpenAI calls.
- `ASCA_MODEL`: Required model id for the AI SDK OpenAI provider. Tests use `gpt-5.4-nano`.

## Request

```json
{
  "threadId": "demo",
  "messages": [
    {
      "role": "user",
      "content": "Summarize this project."
    }
  ]
}
```

**Rules**:

- `threadId` must be `demo`.
- `messages` must be a non-empty ordered array.
- `role` must be `user` or `assistant`.
- `content` must be a non-empty string after trimming.
- Text-only input is supported. Images, audio, files, and tools are out of scope.

## Success Response

Status: `200`

```json
{
  "message": {
    "role": "assistant",
    "content": "A.S.C.A. response text."
  },
  "model": "gpt-5.4-nano"
}
```

## Error Responses

Status: `400`

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Enter a prompt before sending."
  }
}
```

Status: `401`

```json
{
  "error": {
    "code": "unauthorized",
    "message": "Sign in to run A.S.C.A."
  }
}
```

Status: `500`

```json
{
  "error": {
    "code": "asca_unavailable",
    "message": "A.S.C.A. could not return a response. Try again."
  }
}
```

## Client Handling

- `200`: Append assistant message, clear pending state, scroll to latest message.
- `400`: Keep prompt context visible and show non-blocking validation feedback.
- `401`: Treat as an auth failure and return the user to the sign-in flow.
- `500`: Keep the submitted user message visible and show a retryable error state.
