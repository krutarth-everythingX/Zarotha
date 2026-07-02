# ADR-0002: Use Blade For Public And Inertia React For Admin

## Status

Accepted

## Context

The public website prioritizes SEO, resilience, and minimal JavaScript. The admin CMS needs richer authenticated interactions and should reuse the supplied admin UI kit.

## Decision

- Use Blade-rendered pages for the public website.
- Use Inertia.js with React and TypeScript for the admin CMS only.

## Consequences

- Public rendering remains fast, semantic, and less front-end heavy.
- Admin workflows gain richer UI behavior without forcing the public site into SPA complexity.
- The admin UI kit remains isolated to the CMS boundary.

## Trade-Offs

- Two presentation stacks must be maintained deliberately.
- This is still simpler than making the entire product a unified SPA.
