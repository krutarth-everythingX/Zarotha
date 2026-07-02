# Stage 3 — Technical Architecture and Repository Structure

## Project Snapshot

**Client:** Zarokha Wooden Arts  
**Location:** Vadodara, Gujarat, India  
**Business:** Manufacturer and seller of handcrafted wooden décor, including wooden jharokhas, elephants, wall décor, sculptures, temple décor, handcrafted art, and custom decorative pieces.

**Website model:** Product catalogue and inquiry website. It is not an ecommerce website. There is no cart, checkout, online payment, order management, or inventory management in the current scope.

**Public website:** Laravel-rendered semantic HTML5 with production CSS and JavaScript.  
**Admin CMS:** React + Inertia.js + TypeScript using the supplied admin UI kit without redesigning it.  
**Backend:** Latest stable Laravel version available when implementation starts.  
**Database:** MySQL.  
**Authentication:** Laravel authentication for authorized CMS users.  
**Primary goals:** Luxury brand presentation, fast product discovery, strong SEO, high-quality product imagery, inquiry conversion, easy CMS management, accessibility, security, and future extensibility.

## Objective

Finalize the production architecture before database design or implementation.

## Required Architecture Direction

Use a modular Laravel monolith unless a documented constraint proves another design is superior.

Public website:

- Blade-rendered pages
- Semantic HTML
- Dedicated public CSS and JavaScript entry points
- Progressive enhancement
- Minimal client-side JavaScript

Admin CMS:

- Inertia.js
- React
- TypeScript
- Supplied admin UI kit
- Route-level or feature-level code splitting where practical

Shared backend:

- Laravel authentication
- MySQL
- Queues for image processing and slow jobs
- Cache abstraction using environment-appropriate drivers
- Vite asset pipeline
- Centralized media handling
- Policies and Form Requests
- Structured logging

## Deliverables

Create:

- `docs/architecture/overview.md`
- `docs/architecture/context-diagram.md`
- `docs/architecture/container-diagram.md`
- `docs/architecture/folder-structure.md`
- `docs/architecture/request-lifecycle.md`
- `docs/architecture/caching-and-queues.md`
- `docs/architecture/error-handling.md`
- `docs/architecture/logging-and-observability.md`
- `docs/architecture/future-expansion.md`
- ADRs for major decisions

## Folder Structure Requirements

Design and explain a concrete folder structure for:

- Public controllers
- Admin controllers
- Form Requests
- Policies
- Models
- Enums
- DTOs/data objects
- Services/actions
- Repositories only where justified
- Jobs
- Events/listeners only where justified
- Observers only where justified
- Console commands
- Middleware
- SEO classes
- Media classes
- Search classes
- Export classes
- Blade layouts, pages, partials, and components
- Public CSS and JavaScript
- React admin layouts, pages, components, hooks, utilities, and types
- Tests
- Documentation

## Required Decisions

Document:

- Why Blade is used for the public website
- Why Inertia React is restricted to admin
- Session-based authentication strategy
- Authorization model
- Cache boundaries
- Queue use cases
- Media storage strategy
- Search strategy for launch
- Rich-text policy
- Logging and error-reporting strategy
- Backup assumptions
- Deployment assumptions
- Future modules for cart, orders, payments, inventory, multilingual content, and blog

## Architecture Quality Rules

- Avoid unnecessary microservices.
- Avoid “repository for every model.”
- Avoid global helper sprawl.
- Avoid fat controllers and fat React pages.
- Avoid business logic in Blade templates.
- Avoid untyped admin data contracts.
- Avoid coupling public rendering to the admin UI kit.
- Avoid route names and folder names that make future ecommerce expansion confusing.

## Acceptance Criteria

- Every major request path is traceable from route to response.
- Public and admin concerns are clearly separated.
- Future features have extension points without premature implementation.
- Services, repositories, events, jobs, and observers each have documented use criteria.
- Folder structure is concrete enough to implement without improvisation.
- Architecture decisions include trade-offs.

End with the mandatory stage completion report and stop.
