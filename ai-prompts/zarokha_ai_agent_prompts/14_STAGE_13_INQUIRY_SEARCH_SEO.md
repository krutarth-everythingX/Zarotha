# Stage 13 — Inquiry Workflow, Search, Export, SEO Output, Sitemap, and Redirects

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

Complete the conversion, discoverability, and operational workflows that connect public browsing with CMS management.

## Inquiry Implementation

Implement:

- General contact inquiry
- Product-specific inquiry
- Product context stored with inquiry
- Validation
- Rate limiting
- Spam mitigation
- Safe success/error responses
- Notifications according to configured mail settings
- Admin unread count
- Status transitions: unread, read, replied, archived
- Internal notes
- Assignment if approved
- Reply logging
- Search and filters
- CSV export with authorization
- CSV formula-injection prevention
- Privacy-aware retention support

## Search

Implement approved public and admin search using indexed database queries for launch.

Requirements:

- Product-name search
- Category search
- Collection search if approved
- Admin CMS search
- Inquiry search
- Escaped queries
- Pagination
- Stable sorting
- Empty states
- Performance tests
- Upgrade path to a dedicated search engine without requiring one now

## SEO Output

Implement and verify:

- Per-page title
- Meta description
- Canonical URL
- Robots directives
- Open Graph
- Twitter Card
- Structured data
- Breadcrumb schema
- Organization/LocalBusiness schema
- Product schema without false offers
- Image alt text
- Correct 404 status
- Redirects for historical slugs
- Admin `noindex`

## Sitemap and Robots

- Generate XML sitemap from published indexable content.
- Exclude drafts, archived records, admin routes, and internal search combinations.
- Cache sitemap responsibly.
- Invalidate sitemap cache after publication changes.
- Implement environment-aware robots behavior to block non-production indexing.

## Validation

- Validate structured data.
- Validate sitemap XML.
- Test canonical URLs.
- Test redirected old slugs.
- Test inquiry rate limits and status changes.
- Test CSV safety.
- Test search performance and query plans.
- Test email failure handling.

## Acceptance Criteria

- All inquiry entry points store complete, valid data.
- Inquiry admin workflow is complete.
- Search is relevant and indexed.
- Export is secure.
- SEO output is unique and correct.
- Sitemap contains only published canonical URLs.
- Historical slugs redirect correctly.

End with the mandatory stage completion report and stop.
