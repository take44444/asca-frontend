# Data Model: Event View

## EventApp

Closed source identifier: `slack`, `microsoft-teams`, `discord`, `x`, or `github`.

**Validation rules**
- Every value maps exhaustively to one existing source logo and accessible application name.
- No unknown or fallback source is accepted.

## ThreadEvent

One external event associated with a Run A.S.C.A. demonstration thread.

**Fields**
- `id`: Stable unique string.
- `threadId`: Owning `ThreadId`.
- `app`: `EventApp` source.
- `sender`: Non-empty submitter name.
- `externalThread`: Optional non-empty external thread or channel name.
- `content`: Non-empty event text.
- `occurredAt`: Fixed ISO timestamp.

**Validation rules**
- IDs are unique across all fixture sets.
- `threadId` matches the key of the containing fixture collection.
- Only `externalThread` may be absent.
- Timestamps must remain deterministic for tests and locale formatting.

## EventsByThread

Complete mapping from every `ThreadId` to an ordered event collection.

**Validation rules**
- Every known thread id has an array.
- `demo` contains exactly 20 events and covers all five sources plus present/absent external-thread cases.
- Every non-demo thread contains exactly three events.
- No asynchronous state or backend data is associated with the mapping.

## State Transitions

```text
Initial load
  -> selectedThreadId = demo
  -> conversation renders demo thread
  -> event view renders 20 demo events

Select another thread
  -> selectedThreadId changes
  -> conversation renders selected thread
  -> event view renders that thread's three events

Scroll events
  -> only event content scroll position changes
  -> event header, conversation, and thread rail remain usable
```

## Relationships

- `RunAscaChat` derives both the selected `Thread` and selected `ThreadEvent[]` from `selectedThreadId`.
- `EventView` renders one selected array without owning selection state.
- Event sources map to existing logo components; external thread names render as optional badges.
