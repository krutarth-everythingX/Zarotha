# ADR-0005: Use Flat Categories And One Required Category Per Product

## Status

Accepted

## Context

Launch scope needs clear catalogue filtering and manageable CMS taxonomy without introducing premature complexity.

## Decision

- Use a flat `categories` table for launch.
- Require each product to belong to one category.
- Use collections, not extra category nesting, for editorial grouping.

## Consequences

- Product filtering and admin data entry stay simpler.
- The schema matches the approved launch decision that categories are taxonomy and collections are curated groupings.
- A future multi-category or hierarchical taxonomy can be added later through a migration if a real requirement emerges.

## Trade-Offs

- Less flexible than a many-to-many hierarchical taxonomy from day one.
- Better aligned with current scope and reduces unnecessary query complexity.
