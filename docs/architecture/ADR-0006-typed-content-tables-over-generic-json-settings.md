# ADR-0006: Prefer Typed Content Tables Over Generic JSON Or Catch-All Settings

## Status

Accepted

## Context

The CMS must manage homepage content, contact data, static pages, and structured product information without hiding important domain fields inside loosely typed payloads.

## Decision

- Use typed tables and typed columns for core content and settings.
- Avoid a generic JSON catch-all table for homepage sections, SEO, or public page content.
- Use narrowly scoped repeatable tables for structured editorial items such as craftsmanship steps and why-choose-us items.

## Consequences

- The schema stays clearer, more queryable, and more migration-friendly.
- Important business data remains explicit and indexable.
- Small amounts of field repetition are accepted in exchange for stronger structure.

## Trade-Offs

- Requires more tables and more deliberate migration design.
- Avoids the long-term ambiguity and hidden coupling of generic JSON-heavy content storage.
