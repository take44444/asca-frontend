# Data Model: Thread List Design

## ThreadId

Stable identifier for one demonstration thread.

**Fields**
- `string` literal id for each static thread.

**Validation rules**
- Must be unique across the 20-entry demonstration set.
- Must be stable across renders so selected state and tests remain deterministic.

## ChatMessage

One message displayed in the selected thread content area.

**Fields**
- `id`: Stable message identifier.
- `role`: `user` or `assistant`.
- `content`: Message text displayed in the conversation panel.
- `createdAt`: ISO timestamp used by existing message rendering.
- `status`: `complete`, `streaming`, or `error`.
- `copyState`: `idle`, `copied`, or `failed`.

**Validation rules**
- Static demonstration messages use `complete` status and `idle` copy state.
- Live active-thread messages continue to be derived from the existing chat state.

## Thread

Selectable conversation entry shown in the thread list and displayed in the conversation panel.

**Fields**
- `id`: `ThreadId`.
- `title`: User-visible thread title.
- `isSelected`: Whether the entry is the active thread.
- `messages`: Ordered messages for the thread.

**Validation rules**
- Exactly one thread is selected at a time.
- Each thread title must be non-empty.
- Message count shown in the list is derived from `messages.length`.
- Long titles must remain contained within the entry and not overlap message counts.

## DemonstrationThreadSet

Static collection of 20 thread entries used by the Run A.S.C.A. page.

**Fields**
- `threads`: Ordered array of 20 `Thread` values after selected-state projection.
- `selectedThreadId`: Current selected `ThreadId`.

**Validation rules**
- Must contain exactly 20 threads.
- Must include the live demonstration thread used by the existing chat transport.
- Must include representative static messages for non-live threads so right-side content can update on selection.
- No backend fetch, persistence, or async loading state is associated with this collection.

## State Transitions

```text
Initial load
  -> selectedThreadId defaults to the live demonstration thread
  -> thread list renders 20 entries
  -> right-side conversation displays selected thread messages

Select a different thread
  -> selectedThreadId changes to clicked thread id
  -> exactly one list entry receives selected styling
  -> right-side conversation displays clicked thread content
  -> create-thread control remains disabled

Submit prompt while live demonstration thread is selected
  -> existing chat send/stream/error/copy behavior is preserved

Submit prompt while a static demonstration thread is selected
  -> existing prompt submission behavior uses the currently selected thread id
  -> no thread list backend fetch is introduced
```

## Relationships

- `ThreadList` renders a `DemonstrationThreadSet` as selectable `Thread` entries.
- `ConversationPanel` renders the currently selected `Thread`.
- Existing chat state supplies messages for the live demonstration thread.
- Static fixture messages supply content for non-live demonstration threads.
