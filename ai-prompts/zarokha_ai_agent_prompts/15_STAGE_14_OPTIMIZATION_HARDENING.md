# Stage 14 — Performance Optimization, Security Hardening, and Accessibility Remediation

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

Measure the implemented system, fix quality gaps, and harden it against production traffic and misuse.

## Performance Work

Measure and optimize:

- TTFB
- LCP
- INP
- CLS
- Public CSS and JavaScript payload
- Image bytes
- Font loading
- Database query count
- Slow queries
- Cache hit opportunities
- Admin bundle sizes
- Route-level code splitting
- Compression
- Browser caching
- Server-side cache behavior
- Queue throughput

Do not optimize by hiding functionality or reducing accessibility.

## Security Hardening

Verify and remediate:

- Authentication throttling
- Password reset behavior
- Session/cookie flags
- CSRF
- XSS
- SQL injection resistance
- Mass assignment
- Authorization
- Upload attacks
- File disclosure
- Rate limits
- Spam controls
- CSV injection
- Security headers
- Error disclosure
- Production debug settings
- Dependency vulnerabilities
- Secrets
- Logging of sensitive data
- Admin indexing
- Backup and restore documentation

## Accessibility Remediation

Run manual and automated checks for:

- Keyboard navigation
- Focus visibility
- Focus order
- Skip link
- Heading structure
- Landmarks
- Form labels/errors
- Dialogs
- Mobile menu
- Gallery/lightbox
- Carousels
- Tables
- Pagination
- Upload UI
- Color contrast
- Reduced motion
- Screen-reader announcements
- Touch target sizes

## Required Evidence

Provide:

- Before/after metrics
- Lighthouse reports for representative pages
- Bundle analysis
- Query counts
- Accessibility issue log and fixes
- Security checklist results
- Remaining accepted risks with reasons

## Acceptance Criteria

- Representative public pages meet approved performance budgets or have documented external-content exceptions.
- Lighthouse targets are evaluated under production-like conditions.
- No critical or high-severity known vulnerability remains.
- Critical user journeys pass keyboard and screen-reader checks.
- No layout shift is caused by images or late-loading UI.
- Admin and public production builds remain warning-free.

End with the mandatory stage completion report and stop.
