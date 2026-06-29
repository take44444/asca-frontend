# Data Model: Agent Metadata Summary Content

## KnowledgeItem

One deterministic piece of knowledge available to the demonstration agent.

**Fields**
- `id`: Stable unique string.
- `title`: Display string for the knowledge subject.
- `description`: Display string summarizing the knowledge content.

**Validation rules**
- Fixture ids are unique.
- The demonstration collection contains exactly 14 records.
- Title and description values remain unchanged in data even when visually truncated.
- Empty strings are renderable and must not widen or activate an item.

## SocialPlayer

One participant in the demonstration agent's social context.

**Fields**
- `id`: Stable unique string.
- `name`: Player display name used to derive the local avatar fallback.

**Derived value**
- `initials`: At most two uppercase initials from usable Unicode letters or numbers in the first and last non-empty name segments; a stable generic fallback is used when none exists.

**Validation rules**
- Fixture ids are unique.
- The demonstration collection contains exactly eight records.
- No image URL or backend avatar identifier is present.
- Empty, punctuation-only, one-word, multi-word, and non-Latin names produce deterministic fallback content.

## ArtifactType

Closed type identifier: `document` or `image`.

**Validation rules**
- `document` maps to `FileTextIcon`.
- `image` maps to `FileImageIcon`.
- No unknown fixture type is accepted.

## Artifact

One file-like demonstration resource associated with the agent.

**Fields**
- `id`: Stable unique string.
- `name`: Artifact display name.
- `type`: `ArtifactType`.
- `dataSize`: Human-readable display string such as `2.4 MB`.

**Validation rules**
- Fixture ids are unique.
- The demonstration collection contains exactly three records: two documents and one image.
- Empty names are renderable as blank display text and must not widen or activate an item.
- `dataSize` is display-only; no file transfer or numeric conversion is performed.
- Zero or unusually large display values remain contained and do not add interaction.

## Metadata Summary Aggregates

The existing summary cards derive their values from the detailed fixture arrays.

**Derivations**
- Knowledge `itemCount` = `knowledgeItems.length`.
- Social `playerCount` = `players.length`.
- Artifact `documentCount` = artifacts filtered by `document`.
- Artifact `imageCount` = artifacts filtered by `image`.
- Artifact primary total = `documentCount + imageCount`.
- Token totals and seven-point trend are unchanged.

## Relationships

- `demoKnowledgeSummary` owns or references `KnowledgeItem[]` and derives its total from that collection.
- `demoSocialSummary` owns or references `SocialPlayer[]` and derives its total from that collection.
- `demoArtifactSummary` owns or references `Artifact[]` and derives its total and type breakdown from that collection.
- `demoAgentMetadataSummaries` formats derived aggregate values for existing card headers.
- The card content renderer selects the matching detailed collection by `AgentMetadataSummaryId`; `tokens` continues to render `TokenUsageTrend`.

## UI State Transitions

```text
Viewport below existing content breakpoint
  -> metadata card headers remain visible
  -> detailed card content remains unavailable by existing behavior

Viewport at or above existing content breakpoint
  -> knowledge/social/artifact lists and token trend render
  -> overflowing detailed list scrolls independently

Activate any detailed record
  -> no selection, navigation, request, token change, or other state transition
```
