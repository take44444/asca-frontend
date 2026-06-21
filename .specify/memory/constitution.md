<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template principle 1 -> I. Test-Driven Development
- Template principle 2 -> II. Quality Gates
- Template principle 3 -> III. Type Safety and Public API Documentation
- Template principle 4 -> IV. Next.js App Router Frontend Architecture
- Template principle 5 -> V. Backend Boundary and User Experience
Added sections:
- Technical Stack
- Development Workflow and Code Guidelines
Removed sections:
- None
Templates requiring updates:
- Updated: .specify/templates/plan-template.md
- Updated: .specify/templates/spec-template.md
- Updated: .specify/templates/tasks-template.md
- Reviewed: .specify/extensions/*/commands/*.md (no updates required)
- Reviewed: README.md and AGENTS.md (no updates required)
Follow-up TODOs:
- None
-->
# A.S.C.A. Frontend Constitution

## Core Principles

### I. Test-Driven Development

All feature development and bug fixes MUST follow Red-Green-Refactor. Tests
MUST be written from the requirement and expected behavior before the
implementation, and the failing test state MUST be observed before production
code is changed. This is non-negotiable because the frontend is the user-facing
contract for the A.S.C.A. agent and regressions must be caught at the behavior
level before they reach users.

### II. Quality Gates

Every change MUST pass linting, formatting, type checking, and the complete
test suite before it is considered complete. New features and bug fixes MUST
maintain at least 80% coverage for the changed behavior, measured by the
project's configured coverage tooling. Work that cannot meet a gate MUST record
the reason, owner, and remediation plan in the implementation plan before it can
proceed.

### III. Type Safety and Public API Documentation

TypeScript strictness MUST be preserved. Public classes, interfaces, exported
functions, component props, constants, variables, function parameters, and
return values MUST have explicit types where TypeScript cannot infer a precise,
stable contract. The `any` type MUST NOT be introduced; unknown data from the
A.S.C.A. backend MUST be modeled, narrowed, or validated before use. Public
classes, interfaces, and exported functions MUST include docstrings because
frontend-backend contracts and reusable UI APIs must remain understandable
outside their original implementation context.

### IV. Next.js App Router Frontend Architecture

The application MUST use the Next.js App Router for routing and page
composition. Before implementing Next.js-specific behavior, contributors MUST
read the relevant guide in `node_modules/next/dist/docs/` for the installed
Next.js version and follow current conventions and deprecation guidance. UI
implementation MUST prefer shadcn/ui components and Tailwind CSS utilities
already present in the project, extending local patterns instead of introducing
parallel component systems.

### V. Backend Boundary and User Experience

This repository owns the A.S.C.A. frontend only. Agent harness, orchestration,
and core reasoning logic belong to the backend repository and MUST NOT be
reimplemented here. Frontend features MUST communicate with the backend through
explicit, typed request and response boundaries. User-facing behavior MUST be
designed for clear interaction with the A.S.C.A. agent, including accessible
states for loading, errors, empty results, and successful responses.

## Technical Stack

The project standard stack is TypeScript, Next.js App Router, React, shadcn/ui,
Tailwind CSS, Auth.js for authentication when authentication is required, Jest
for unit tests, Playwright for end-to-end tests, ESLint for linting, and
Prettier for formatting. The current repository already contains Next.js,
React, TypeScript, shadcn/ui, Tailwind CSS, ESLint, and Prettier; features that
need authentication or test execution MUST add or configure the missing required
tools as part of their plan.

## Development Workflow and Code Guidelines

Contributors MUST follow the Google TypeScript Style Guide unless local project
configuration provides a stricter rule. Work MUST start from a specification
with independently testable user stories, then an implementation plan that
records the real repository paths touched by the feature. Tasks MUST include
test-first work before implementation for each user story, and each story MUST
be independently demonstrable before later stories depend on it.

Implementation plans MUST include the current Next.js documentation consulted
when the feature uses Next.js APIs, routing, rendering behavior, metadata,
server actions, caching, or data fetching. Plans MUST explicitly identify any
backend API dependency and whether it already exists, is mocked for frontend
development, or requires coordination with the backend repository.

## Governance

This constitution supersedes other project practices and preferences. Pull
requests, reviews, specifications, plans, and task lists MUST verify compliance
with these principles. Any deviation MUST be documented in the plan with a
specific reason, approving maintainer, and migration or remediation plan.

Amendments MUST include the reason for change, affected principles or sections,
date of change, version bump, and migration guidance when existing work is
affected. Versioning follows semantic versioning: MAJOR for removals or
backward-incompatible redefinitions of governance or principles, MINOR for new
principles or materially expanded guidance, and PATCH for clarifications,
wording improvements, or non-semantic refinements.

Compliance is reviewed at three points: specification review for testable user
outcomes and backend boundaries, plan review for constitution gate compliance,
and implementation review for tests, coverage, linting, formatting, typing, and
documented deviations.

**Version**: 1.0.0 | **Ratified**: 2026-06-21 | **Last Amended**: 2026-06-21
