# Architecture Overview

## Summary

Zarokha will use a modular Laravel monolith. One Laravel application will serve the public catalogue, power the admin CMS, handle authentication and authorization, manage inquiries, and coordinate media, caching, queues, and SEO behavior.

## Why This Architecture

- It keeps public and admin concerns in one deployable system while still allowing clean separation of responsibilities.
- It avoids unnecessary microservice overhead for a catalogue and inquiry platform.
- It supports strong SEO on the public site through Blade-rendered pages with minimal client-side JavaScript.
- It supports a richer authenticated CMS experience through Inertia.js with React and TypeScript.
- It preserves room for future modules such as ecommerce, multilingual content, and blog features without requiring a rewrite.

## Core Architectural Decisions

- Public website: Laravel Blade with semantic HTML and progressive enhancement.
- Admin CMS: Laravel + Inertia.js + React + TypeScript using the supplied admin UI kit.
- Authentication: session-based Laravel authentication for CMS users only.
- Authorization: policies, gates where appropriate, and role-based permission mapping.
- Database: MySQL as the primary system of record.
- Queues: used for image processing, exports, and other slow or retryable work.
- Caching: environment-appropriate cache drivers with scoped usage for read-heavy public and configuration concerns.
- Media: centralized media handling with validated uploads and derivative generation strategy.
- Logging: structured application logging with clear public and admin event boundaries.

## Public Rendering Decision

- Blade is used for the public website because the launch site is SEO-sensitive, content-led, and should stay resilient with minimal client-side JavaScript.
- Public interactivity should be progressive enhancement rather than a front-end application shell.

## Admin Rendering Decision

- Inertia React is restricted to admin because the CMS needs richer authenticated interactions and form-heavy workflows.
- Keeping React inside admin avoids coupling public rendering to the admin UI kit or turning the catalogue into an unnecessary SPA.

## Session Authentication Strategy

- Only CMS users authenticate.
- Authentication should rely on Laravel's session-based approach, which fits an internal admin panel better than a token-driven public API model.
- Public visitors do not have accounts in launch scope.

## Authorization Model

- Policies are the primary authorization layer for resource access and mutation.
- Gates or role-aware middleware may support high-level route protections where they improve clarity.
- Permission mapping should separate content management, inquiry operations, SEO changes, and user administration.

## Launch Search Strategy

- Search remains inside the products index using validated query parameters.
- Launch search should use database-backed Eloquent query composition across published products, categories, and collection relationships.
- This avoids premature external search infrastructure while keeping a clean upgrade path if search complexity grows later.

## Media Storage Strategy

- Uploaded originals should be stored through a centralized media workflow using safe generated filenames.
- Publicly renderable derivatives should be generated from approved originals rather than hand-managed copies.
- Storage driver choice depends on environment, but the application should keep media concerns behind services so storage can evolve later.

## Rich-Text Policy

- Rich text should be allowed only where editorial flexibility truly requires it, such as legal pages or select static-page sections.
- Product descriptions and structured catalogue fields should stay mostly field-based and predictable rather than fully free-form.
- Any rich-text output must pass through a constrained, sanitization-aware rendering policy in implementation.

## System Boundaries

### Public boundary

- Public routes return Blade-rendered responses.
- Public pages remain mostly server-rendered to minimize JavaScript cost and improve resilience.
- JavaScript is used only where progressive enhancement adds clear value, such as galleries, search refinements, or UI state.

### Admin boundary

- Admin routes are isolated behind authentication and authorization middleware.
- Admin screens use Inertia.js responses backed by React and TypeScript pages.
- The admin UI kit is reused within the admin boundary only and must not leak into public rendering concerns.

### Shared backend boundary

- Domain models, validation, policies, services, jobs, media handling, SEO support, exports, and logging are shared at the Laravel application layer.
- Shared logic must stay independent from Blade and React presentation details.

## Request Categories

- Public content delivery: Home, collections, products, static pages, and sitemap responses.
- Public conversion handling: contact form and product inquiry submissions.
- Admin read and write operations: CMS management for catalogue, pages, inquiries, and settings.
- Background processing: image optimization, export generation, and future notification tasks.

## Trade-Offs

- A monolith is simpler and faster to ship than services split by function, but requires disciplined module boundaries.
- Blade on the public site reduces front-end complexity and improves SEO, but it means interactivity should be deliberately scoped.
- Inertia React improves admin productivity and stateful workflows, but it must remain confined to the admin so the public site stays lean.

## Assumptions Carried Forward

- The website remains inquiry-based and non-ecommerce in launch scope.
- Instagram and Google Maps remain out of implementation scope unless later approved.
- Client-dependent content and business facts must not be invented.
