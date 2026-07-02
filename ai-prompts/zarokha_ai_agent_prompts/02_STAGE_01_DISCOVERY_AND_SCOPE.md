# Stage 1 — Discovery, Scope, Assumptions, and Risk Register

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

Convert the business brief into a precise, testable product scope before any architecture or code is created.

## Instructions

Do not write application code, migrations, controllers, components, CSS, or JavaScript in this stage.

Create and complete:

- `docs/discovery/project-brief.md`
- `docs/discovery/scope.md`
- `docs/discovery/personas-and-journeys.md`
- `docs/discovery/functional-requirements.md`
- `docs/discovery/non-functional-requirements.md`
- `docs/discovery/assumptions.md`
- `docs/discovery/risk-register.md`
- `docs/content/content-requirements.md`
- `docs/PROJECT_PROGRESS.md`

## Required Analysis

Define:

- Business objective
- Primary conversion actions
- Target visitors
- Admin user types
- Public-page responsibilities
- CMS responsibilities
- Explicitly excluded ecommerce features
- Launch scope
- Future scope
- Content dependencies
- Image dependencies
- Legal-content dependencies
- Google Maps dependency
- WhatsApp behavior
- Contact and inquiry workflows
- Success metrics
- Technical and delivery risks

## Required User Journeys

Document at least:

- Visitor discovers the brand from search
- Visitor browses a collection
- Visitor filters or searches products
- Visitor opens a product
- Visitor examines imagery and specifications
- Visitor sends a product inquiry
- Visitor contacts through WhatsApp
- Visitor submits the contact form
- Admin signs in
- Admin creates and publishes a product
- Admin manages a gallery
- Admin updates homepage sections
- Admin reviews, filters, replies to, exports, and archives inquiries
- Admin updates SEO settings
- Admin manages another CMS user according to permissions

## Scope Clarifications to Lock

State clearly:

- No cart
- No checkout
- No online payment
- No order management
- No inventory management
- No customer account area
- No public user registration
- No invented testimonials or business statistics
- Collections are curated product groups and categories are product taxonomy
- “Best selling” is an editorial CMS flag unless real sales data is later integrated
- “Latest” is based on publication date and/or a controlled CMS flag
- Instagram gallery is optional and must not depend on a fragile unauthorized scraper

## Acceptance Criteria

- Every requested page and CMS module appears in the requirements.
- Current-scope and future-scope features are separated.
- Every unknown business fact is listed as a content dependency.
- No ecommerce feature is accidentally included.
- Every major visitor and admin journey has success and failure states.
- Risks have probability, impact, mitigation, and owner.
- `docs/PROJECT_PROGRESS.md` records Stage 1 as ready for review.

End with the mandatory stage completion report and stop.
