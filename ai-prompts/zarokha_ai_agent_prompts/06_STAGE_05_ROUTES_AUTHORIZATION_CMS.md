# Stage 5 — Routes, Controllers, Authorization, CMS Actions, and Data Contracts

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

Plan every public route, admin route, controller responsibility, request object, policy, action/service, query, and Inertia data contract before implementation.

## Deliverables

Create:

- `docs/architecture/routes.md`
- `docs/architecture/controller-map.md`
- `docs/architecture/authorization-matrix.md`
- `docs/architecture/form-requests.md`
- `docs/architecture/service-action-map.md`
- `docs/architecture/admin-data-contracts.md`
- `docs/architecture/search-and-filtering.md`
- `docs/architecture/export.md`

## Public Routes to Plan

At minimum:

- Home
- Collections index
- Collection details
- Products index
- Product details
- About
- Craftsmanship
- Contact display
- Contact/inquiry submission
- Privacy
- Terms
- Sitemap
- Robots
- 404 behavior
- Redirect resolution for historical slugs

Define route names, URL patterns, parameters, canonical behavior, cache behavior, and status codes.

## Admin Routes to Plan

At minimum:

- Login, logout, password reset
- Dashboard
- Products CRUD and publishing
- Categories CRUD and sorting
- Collections CRUD and sorting
- Product gallery management
- Media library
- Homepage sections
- Banners
- About page
- Craftsmanship page
- Contact details
- Inquiries list/detail/status/notes/export
- SEO settings
- Redirects
- Users and permissions
- General settings
- Activity history if included

## Authorization Matrix

Define permissions for example roles such as:

- Super administrator
- Content administrator/editor
- Inquiry manager

Do not overbuild roles if the actual client only needs one admin role, but keep policy design extensible.

For every admin action define:

- Permission
- Policy method
- Validation request
- Rate-limit requirement
- Audit requirement
- Side effects
- Transaction boundary
- Cache invalidation
- Expected response

## Admin Data Contracts

For each Inertia page define typed props, filters, pagination shape, errors, flash messages, form payloads, and shared data.

No untyped associative payloads should be left undocumented.

## Inquiry Flow

Plan:

- Contact inquiry
- Product-specific inquiry
- Server-side validation
- Spam protection
- Rate limiting
- Storage
- Notification strategy
- Admin unread count
- Status transitions
- Notes
- Reply logging
- CSV export
- Privacy handling

## Acceptance Criteria

- Every required page and CMS action has a named route.
- Every write action has validation and authorization.
- Every admin page has a typed data contract.
- Cache invalidation is defined for content changes.
- Search, filters, pagination, sorting, and export behavior are specified.
- HTTP status codes and redirect behavior are explicit.

End with the mandatory stage completion report and stop.
