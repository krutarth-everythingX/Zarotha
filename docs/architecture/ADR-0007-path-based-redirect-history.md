# ADR-0007: Store Slug History As Path-Based Redirect Records

## Status

Accepted

## Context

Products, collections, and fixed pages need a reliable redirect strategy when slugs change, and old URLs may span multiple route patterns.

## Decision

- Store redirects in a dedicated `redirects` table keyed by `source_path`.
- Record the destination as `target_path` plus lightweight source metadata.
- Do not force one redirect table per content type.

## Consequences

- Redirect lookup remains simple and fast.
- Old URLs can be preserved across multiple route types.
- Sitemap and canonical logic can coexist with redirect history without schema duplication.

## Trade-Offs

- Redirect rows do not use strict foreign keys to every possible destination entity.
- This is acceptable because path continuity is the real concern, not only entity identity.
