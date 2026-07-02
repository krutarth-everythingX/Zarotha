# ADR-0008: Use Soft Deletes Only Where Recovery Or Historical Linkage Matters

## Status

Accepted

## Context

Some records benefit from restoration and historical continuity, while others are better handled through status fields or restricted deletion.

## Decision

- Use soft deletes for products, collections, and media assets.
- Use status-based lifecycle management for fixed pages and inquiries.
- Use restricted or inactive-state handling for lookup tables such as roles and categories.

## Consequences

- Recoverable public content can be restored without losing history immediately.
- Inquiry retention remains explicit and privacy-reviewable instead of silently hidden in soft-delete semantics.
- Lookup data stays simpler and safer.

## Trade-Offs

- Different lifecycle patterns exist across tables and must be documented clearly.
- This is preferable to applying soft deletes everywhere without a real operational need.
