# ADR-0001: Use A Modular Laravel Monolith

## Status

Accepted

## Context

Zarokha needs one public catalogue, one admin CMS, shared authentication, shared content models, and a relatively small but production-grade operational surface.

## Decision

Use one modular Laravel monolith rather than splitting the system into microservices or separate public and admin backends.

## Consequences

- Simpler deployment, hosting, and operational ownership.
- Shared business rules, policies, and models stay in one codebase.
- Requires disciplined boundaries so public and admin concerns do not become tangled.

## Trade-Offs

- Less independent scaling than a decomposed service architecture.
- Easier to build and maintain for current scope.
