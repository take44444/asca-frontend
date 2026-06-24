# Research: Run A.S.C.A.

## Decision: Use a Next.js Route Handler as the chat Backend-for-Frontend

**Rationale**: Route Handlers are the installed Next.js convention for public HTTP endpoints inside the App Router. A server-side BFF keeps `OPENAI_API_KEY` private, allows session authorization before model calls, and gives the client a stable typed contract.

**Alternatives considered**: Calling OpenAI directly from the Client Component was rejected because it would expose secrets. A separate backend API was rejected for this feature because the selected scope is a frontend-owned direct AI SDK call.

## Decision: Use AI SDK `generateText` with `@ai-sdk/openai`

**Rationale**: The installed `@ai-sdk/openai` package is the provider package and its documentation shows the provider used with `generateText` from the separate `ai` package. Adding `ai` gives the route handler the intended high-level text generation API while keeping provider configuration typed.

**Alternatives considered**: Using only lower-level provider APIs was rejected because it would add unnecessary implementation coupling. Streaming was rejected for this feature because the spec requires visible processing feedback and final text display, not token streaming.

## Decision: Configure the model with `ASCA_MODEL`

**Rationale**: The model must be environment-controlled so development, tests, and deployments can choose different models without source changes. Tests set `ASCA_MODEL=gpt-5.4-nano` to verify the selected model is passed through.

**Alternatives considered**: Hard-coding a model was rejected because it would make deployments less flexible. Exposing model selection in the UI was rejected because this feature is a focused chat workspace, not a model picker.

## Decision: Keep thread and message state local for v1

**Rationale**: The spec explicitly scopes the feature to one demonstration thread and excludes persistent thread fetching, real thread creation, and multimodal input. Local state supports the required chat behaviors without introducing storage contracts.

**Alternatives considered**: Browser storage was rejected because persistence is out of scope. Database-backed threads were rejected because this frontend repository must not reimplement backend orchestration or persistent agent state.

## Decision: Use existing chat-oriented UI primitives

**Rationale**: The repository already contains `Message`, `Markdown`, `PromptInput`, `ScrollButton`, copy icons, Tailwind utilities, and `use-stick-to-bottom`. Reusing these matches local patterns and avoids parallel component systems.

**Alternatives considered**: Introducing a third-party chat UI kit was rejected because it would duplicate existing primitives and increase styling inconsistency.

## Decision: Reject duplicate submissions while pending

**Rationale**: The spec requires predictable behavior for repeated submissions. Disabling send while pending is simpler and clearer than queueing prompts in a single demonstration thread.

**Alternatives considered**: Queueing messages was rejected because it requires additional ordering, cancellation, and error semantics that are not needed for the first version.
