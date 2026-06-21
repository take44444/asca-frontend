# A.S.C.A. Frontend Constitution

A.S.C.A. - A Slightly Clever Agent - is an autonomous research assistant designed to assist users in various tasks.

This project is a frontend implementation of the A.S.C.A. agent. The frontend is responsible for providing a user-friendly interface for users to interact with the A.S.C.A. agent.

The backend of A.S.C.A. is developed in another repository. The backend provides the core harness and logic for the agent's functionality. The frontend communicates with the backend to send user inputs and receive responses from the agent.

## Core Principles

### 1. Test-Driven Development (TDD)

- Red-Green-Refactor cycle **MUST** be followed for all development.
- All new features and bug fixes **MUST** have corresponding tests that cover the functionality being implemented or fixed.
- Tests **MUST** be written before the implementation based on the requirements and expected behavior of the feature or bug fix.

### 2. Quality Gates

- All code **MUST** pass linting checks and adhere to the project's coding standards.
- All code **MUST** have a code coverage of at least 80% for new features and bug fixes.
- All tests **MUST** pass.

## Technical Stack

- TypeScript
- Next.js for the frontend framework
- shadcn/ui for UI components
- Tailwind CSS for styling
- Jest for unit testing
- Playwright for end-to-end testing
- Auth.js for authentication
- ESLint and Prettier for linting and code formatting

## Project and Code Guidelines

- Must follow Google TypeScript Style Guide
- Types must be explicitly defined for all classes, interfaces, constants, variables, function parameters, and return types.
- Type "any" **MUST NOT** be used. All types must be explicitly defined to ensure type safety and maintainability.
- Docstrings **MUST** be provided for all public classes, interfaces, and functions.
- Must use Next.js App Router for routing.

## Governance

Constitution supersedes all other practices

### Governance Rules

- This constitution supersedes all other practices and preferences in the project. Any deviations from the principles and guidelines outlined in this constitution **MUST** be documented, justified, and approved by the project maintainers.
- Any amendments to this constitution **MUST** include a reason for the change, a clear description of the amendment, date, and a migration plan if necessary.
