# Stage 9 — Backend Domain and CMS Implementation

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

Implement the approved database, domain models, validation, authorization, services, queries, and CMS backend workflows.

## Required Implementation

Implement approved migrations, models, enums, factories for tests, policies, Form Requests, controllers, actions/services, and queries for:

- Products
- Categories
- Collections
- Product gallery relations
- Banners
- Homepage sections
- About page
- Craftsmanship page
- Why-choose-us content
- Contact information
- Social links
- Inquiries
- SEO metadata
- Redirects
- Users and permissions
- Settings
- Activity history where approved

## Backend Quality Requirements

- Use transactions for multi-record content saves.
- Prevent invalid status transitions.
- Prevent unauthorized publishing.
- Normalize and validate slugs.
- Invalidate relevant caches after content changes.
- Prevent N+1 queries.
- Paginate admin lists.
- Use explicit sort rules.
- Avoid mass-assignment vulnerabilities.
- Provide consistent flash and validation responses for Inertia.
- Keep controllers thin.
- Keep services focused.
- Use repositories only where approved.
- Add model scopes or query objects for reusable filtering.
- Log sensitive administrative changes according to the approved plan.

## Content Publishing Rules

Support approved draft, published, and archived behavior.

Define:

- Publish validation
- Scheduled publication only if included in the approved scope
- Unpublish behavior
- Deleted-resource behavior
- Slug-change redirects
- Visibility of unpublished related content
- Cache invalidation

## Tests

Add tests for:

- Migrations and constraints
- Model relationships
- Slug behavior
- Status transitions
- Policies
- Validation
- CRUD workflows
- Sorting
- Publishing
- Redirect creation
- Cache invalidation
- Admin filters and pagination
- Unauthorized access

## Acceptance Criteria

- Every approved CMS entity has a complete backend workflow.
- Every write route is validated and authorized.
- Database constraints match the approved schema.
- No public draft or archived content leaks.
- Tests cover happy paths and failure paths.
- All test, style, and analysis checks pass.

End with the mandatory stage completion report and stop.
