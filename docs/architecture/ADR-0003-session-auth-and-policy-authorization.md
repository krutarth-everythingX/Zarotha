# ADR-0003: Use Session Authentication With Policy-Led Authorization

## Status

Accepted

## Context

The CMS is for authorized internal users only. Public visitors do not need public accounts in launch scope.

## Decision

- Use Laravel session-based authentication for admin users.
- Use policies as the primary authorization mechanism, with gates or middleware only where they clearly fit.

## Consequences

- Keeps authentication aligned with Laravel defaults and CMS-only usage.
- Avoids premature token-based public API complexity.
- Encourages resource-level authorization discipline across admin modules.

## Trade-Offs

- Less aligned with headless API-first patterns, which are not needed for launch.
- Requires clear role and policy mapping during later implementation.
