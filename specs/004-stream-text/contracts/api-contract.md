# API Contract: Stream Text

## Endpoint

`POST /api/asca/chat`

The endpoint remains the frontend-owned A.S.C.A. chat boundary. It accepts the same text-only demonstration-thread request and changes successful responses from blocking JSON to streamed plain text.

## Request

**Headers**:

- `Content-Type: application/json`

**Body**:

```json
{
  "threadId": "demo",
  "messages": [
    {
      "role": "user",
      "content": "Explain this workspace."
    }
  ]
}
```

**Rules**:

- `threadId` must be `demo`
- `messages` must contain at least one message
- each message `role` must be `user` or `assistant`
- each message `content` must be a non-empty string after trimming
- at least one message must have `role: "user"`
- the route requires an authenticated session

## Successful Streaming Response

**Status**: `200`

**Headers**:

- `Content-Type: text/plain; charset=utf-8`

**Body**:

The body is a UTF-8 text stream. Each chunk is an ordered assistant text delta. The client appends chunks into the active A.S.C.A. message exactly in arrival order.

Example observable chunks:

```text
A.S.C.A.
 is
 streaming.
```

Client-visible accumulated text:

```text
A.S.C.A. is streaming.
```

## Error Response Before Streaming Starts

Pre-stream validation, authentication, and configuration failures use the existing JSON error shape.

**Status values**:

- `400` for invalid request payloads
- `401` for unauthenticated requests
- `500` for unavailable A.S.C.A. configuration or provider startup failures

**Body**:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Enter a prompt before sending."
  }
}
```

**Error codes**:

- `invalid_request`
- `unauthorized`
- `asca_unavailable`

## Stream Failure After Response Starts

If the response stream fails after status `200`, the client cannot rely on a JSON error payload. The client must treat a stream read failure as an interrupted response:

- preserve any assistant text already received
- mark the assistant message incomplete
- show `A.S.C.A. could not complete the response. Try again.`
- allow another prompt after the failure state settles

## Security and Privacy

- The route must not expose provider credentials, model provider internals, stack traces, or raw provider errors.
- The model is selected server-side from `ASCA_MODEL`.
- The client sends only the current text-only demonstration-thread message history.
