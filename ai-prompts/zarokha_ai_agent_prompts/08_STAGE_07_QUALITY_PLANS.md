# Stage 7 — SEO, Performance, Accessibility, Security, and Testing Plans

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

Finalize measurable quality plans and budgets before implementation begins.

## Deliverables

Create:

- `docs/architecture/seo.md`
- `docs/architecture/performance.md`
- `docs/architecture/security.md`
- `docs/architecture/accessibility.md`
- `docs/testing/test-strategy.md`
- `docs/testing/acceptance-test-matrix.md`
- `docs/testing/browser-device-matrix.md`
- `docs/testing/performance-budget.md`
- `docs/testing/security-checklist.md`

## SEO Plan

Define:

- URL conventions
- Slug rules
- Canonicals
- Meta-title and description fallback hierarchy
- Open Graph
- Twitter Cards
- Organization and LocalBusiness schema
- Product schema without ecommerce offers unless real pricing is published
- BreadcrumbList schema
- WebSite schema
- XML sitemap composition
- Robots rules
- Redirects
- Pagination indexing behavior
- Search-result indexing behavior
- Image SEO
- 404 and 410 behavior
- Admin noindex protections

## Performance Budget

Set budgets for:

- LCP
- INP
- CLS
- TTFB
- Initial public JavaScript
- Initial public CSS
- Largest hero image
- Product-card images
- Font files
- Total requests above the fold
- Admin route chunks
- Database query count for key pages

Define how each will be measured in development, CI, and production-like testing.

## Accessibility Plan

Define tests for:

- Keyboard-only navigation
- Focus order
- Focus trapping
- Skip links
- Form labeling and errors
- Color contrast
- Reduced motion
- Screen-reader announcements
- Carousel controls
- Gallery and zoom
- Mobile menu
- Inertia navigation
- Data tables
- Upload components
- Dialogs
- Toasts
- 404 page

## Security Plan

Include:

- Authentication
- Password reset
- Session hardening
- CSRF
- XSS
- Validation
- Authorization
- File upload security
- Rate limits
- Inquiry spam protection
- CSV injection
- Security headers
- Logging
- Secrets
- Backups
- Dependency scanning
- Error disclosure
- Admin route protection
- Account lifecycle
- Data retention

## Test Strategy

Plan:

- Unit tests
- Feature tests
- Policy tests
- Form Request tests
- Public route tests
- CMS CRUD tests
- Inquiry workflow tests
- Media tests
- SEO tests
- Sitemap tests
- Redirect tests
- Inertia page/prop tests
- React component tests where valuable
- End-to-end smoke tests
- Accessibility tests
- Performance tests
- Security regression tests

## Final Planning Gate

Before approving this stage, verify that Stages 1–7 together provide enough detail to begin implementation without major architectural improvisation.

## Acceptance Criteria

- Every quality target is measurable.
- Security controls map to routes and workflows.
- Performance budgets are realistic and explicit.
- Accessibility checks cover public and admin interactions.
- Test coverage maps to all critical acceptance criteria.
- No implementation has started prematurely.

End with the mandatory stage completion report and stop.
