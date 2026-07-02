# Zarokha Wooden Arts — Complete Staged AI Agent Prompt

Use the individual files when possible. This combined file contains the same prompts in execution order.



---

# FILE: 00_MASTER_RULES.md

# Zarokha Wooden Arts — Master AI Agent Instructions

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

## How This Prompt System Must Be Used

1. Load this master file first.
2. Execute only the current stage file.
3. Never skip a stage.
4. Never begin implementation until all planning stages are approved.
5. At the end of every stage, stop and return the required review report.
6. Do not continue to the next stage until the user explicitly approves the current stage.
7. Maintain `docs/PROJECT_PROGRESS.md` throughout the project.
8. Record architecture decisions in `docs/architecture/ADR-XXXX-*.md`.
9. Keep all commands, generated files, validations, and known limitations visible to the user.
10. Never claim that something works unless it was implemented and validated.

## Senior Engineering Role

Act as a senior full-stack engineer, Laravel architect, React engineer, TypeScript expert, UI/UX designer, SEO engineer, accessibility specialist, security engineer, and performance engineer working as an agency for a premium handcrafted décor brand.

Make decisions for production use, not for a tutorial, prototype, demo, theme, or code sample.

## Non-Negotiable Product Rules

- The website is an inquiry-based catalogue, not ecommerce.
- Do not create cart, checkout, payment, order, shipping, or inventory features in the current implementation.
- Product pages must prominently support inquiry, phone, email, and WhatsApp actions.
- The admin panel UI kit will be supplied. Reuse its existing components, patterns, spacing, typography, colors, forms, tables, dialogs, navigation, and feedback states.
- Do not redesign the admin panel.
- The public website must not look like Bootstrap, a purchased template, a generic SaaS site, or a corporate website.
- The visual language must feel warm, minimal, artistic, handcrafted, premium, calm, and editorial.
- Avoid cheap gradients, excessive colors, heavy borders, decorative clutter, and animation overload.

## Public Website Pages

- Home
- Collections
- Collection Details
- Products
- Product Details
- About Us
- Our Craftsmanship
- Contact
- Privacy Policy
- Terms and Conditions
- 404

## Homepage Sections

- Hero banner or slider
- Featured collections
- Best-selling products
- About Zarokha
- Why choose us
- Craftsmanship process
- Latest products
- Customer inquiry call to action
- Optional Instagram or gallery section
- Footer

## Product Experience

Each product detail page must support:

- SEO-friendly canonical URL
- Breadcrumbs
- Large optimized product imagery
- Accessible image gallery
- Zoom or high-resolution image viewing
- Product name
- Short description
- Full description
- Dimensions
- Material
- Finish
- Category
- Collection when applicable
- Related products
- Inquiry action
- WhatsApp action
- Structured data
- Open Graph and Twitter sharing data

## CMS Modules

- Dashboard
- Products
- Categories
- Collections
- Product galleries
- Media library
- Homepage content
- Banners
- About page
- Craftsmanship page
- Contact information
- Inquiries
- SEO
- Users and roles
- Settings
- Activity history where appropriate

## Product Fields

At minimum:

- Name
- Slug
- Category
- Collections
- Short description
- Full description
- Featured image
- Gallery images
- Dimensions
- Material
- Finish
- Meta title
- Meta description
- Open Graph image where needed
- Status
- Sort order
- Featured flag
- Best-selling flag
- Latest flag or publish date
- Canonical URL behavior
- Created by
- Updated by
- Published at

## Inquiry Requirements

Store all inquiries with:

- Name
- Email
- Phone
- WhatsApp number when provided
- Subject
- Message
- Product reference when inquiry originates from a product
- Source page
- UTM/referrer information when safely available
- Consent confirmation where required
- IP or abuse-prevention metadata only when justified and privacy compliant
- Status: unread, read, replied, archived
- Internal notes
- Assigned user when applicable
- Created and updated timestamps

Provide search, filters, status changes, reply tracking, archive behavior, and CSV export with authorization and spreadsheet-injection protection.

## SEO Requirements

- Human-readable URLs
- Unique meta titles and descriptions
- Canonical URLs
- Open Graph metadata
- Twitter Card metadata
- Product, organization, breadcrumb, website, and local business structured data where applicable
- XML sitemap
- `robots.txt`
- Correct status codes
- Redirect strategy for changed slugs
- Image alt text
- Breadcrumbs
- Social preview images
- No duplicate indexable pages
- Admin and internal routes blocked from indexing

## Performance Requirements

Target Lighthouse scores above 95 where realistically measurable for production-like pages and content.

Implement:

- Responsive image generation
- WebP support and optional AVIF when the selected image stack supports it reliably
- Width and height attributes to reduce layout shift
- Lazy loading below the fold
- Priority loading for the largest contentful image
- CSS and JavaScript minification
- Code splitting for the admin application
- Route-level asset discipline
- Font subsetting or system font strategy
- Preload only for critical assets
- Prefetch only when justified
- Server and application caching
- Compression at the web server/CDN layer
- Queue-based image processing where appropriate
- Database indexes and query optimization
- Pagination
- N+1 query prevention
- Reduced-motion support
- Performance budgets documented before implementation

## Accessibility Requirements

Aim for WCAG 2.2 AA:

- Semantic HTML
- Correct heading order
- Keyboard navigation
- Visible focus states
- Skip links
- Accessible menus, dialogs, forms, galleries, sliders, and zoom controls
- ARIA only where native semantics are insufficient
- Form labels and useful error messages
- Sufficient contrast
- Reduced-motion support
- Screen-reader-friendly status messages
- Touch targets appropriate for mobile use

## Security Requirements

- CSRF protection
- Output escaping
- Strict validation through Form Requests
- Authorization through policies and gates
- Rate limiting for login, inquiries, uploads, exports, and sensitive actions
- Secure session and cookie configuration
- Password hashing using Laravel defaults
- Secure password reset
- Login throttling
- File MIME validation and content-based validation
- Randomized stored filenames
- Non-public storage for originals when justified
- Malware scanning integration point documented
- Protection against mass assignment
- SQL injection prevention through Laravel query bindings
- XSS prevention
- CSV formula injection prevention
- Auditability for sensitive admin changes
- Security headers documented and configured
- No secrets committed to source control
- Sanitization only where rich text is intentionally supported

## Code Quality Rules

- Follow Laravel conventions and PSR standards.
- Use SOLID principles without creating unnecessary abstractions.
- Use services for meaningful business workflows.
- Use repositories only where they provide a real boundary, replaceable data source, or reusable query abstraction.
- Do not create repository classes for every model by habit.
- Use Form Requests for validation and authorization.
- Use policies for resource authorization.
- Use DTOs or typed data objects where they improve boundary clarity.
- Use enums for stable statuses and types.
- Use transactions for multi-write operations.
- Use jobs for slow or retryable work.
- Use events only when decoupling has a concrete benefit.
- Use observers only for model-lifecycle behavior that remains predictable and testable.
- Use strict TypeScript.
- Do not use `any` unless unavoidable and documented.
- Remove unused code, imports, assets, dependencies, and dead routes.
- Never leave TODOs, stubs, empty handlers, fake implementations, placeholder copy, placeholder images, or incomplete methods.
- Do not insert invented customer testimonials, statistics, certifications, awards, addresses, contact details, or legal claims.
- Where real business content is not yet supplied, implement the CMS capability and clearly identify the required content without publishing fabricated facts.

## Architecture Direction

Use a modular Laravel monolith:

- Public site rendered by Laravel Blade for strong SEO, low JavaScript cost, and resilient delivery.
- Admin area rendered through Inertia.js with React and TypeScript.
- One Laravel application, one authentication system, one MySQL database, one Vite build pipeline.
- Separate public and admin route groups, layouts, middleware, controllers, requests, policies, and frontend assets.
- Use domain-oriented folders where they improve clarity.
- Keep future ecommerce modules isolated so cart, payment, orders, inventory, multilingual content, and blog features can be added without rewriting the current product catalogue.

## Expected Repository Documentation

Maintain:

- `README.md`
- `.env.example`
- `docs/PROJECT_PROGRESS.md`
- `docs/architecture/overview.md`
- `docs/architecture/folder-structure.md`
- `docs/architecture/database.md`
- `docs/architecture/routes.md`
- `docs/architecture/security.md`
- `docs/architecture/performance.md`
- `docs/architecture/seo.md`
- `docs/architecture/accessibility.md`
- `docs/architecture/deployment.md`
- `docs/content/content-requirements.md`
- `docs/testing/test-strategy.md`
- ADR files for important decisions

## Mandatory Stage Completion Report

At the end of every stage, provide:

1. Stage objective.
2. Work completed.
3. Decisions made and why.
4. Files created or changed.
5. Commands executed.
6. Validation results.
7. Acceptance checklist with pass/fail states.
8. Risks, assumptions, and unresolved blockers.
9. Exact items requiring user review.
10. A final line: `STAGE COMPLETE — WAITING FOR APPROVAL`.

Do not continue after that line.


---

# FILE: 01_USAGE_GUIDE.md

# How to Use the Zarokha AI Agent Prompt Pack

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

## Recommended Workflow

1. Start a new coding-agent session in the project repository.
2. Paste `00_MASTER_RULES.md`.
3. Paste `02_STAGE_01_DISCOVERY_AND_SCOPE.md`.
4. Review the agent's stage completion report.
5. Approve only after the corresponding checklist passes.
6. Paste the next stage file.
7. Continue until the final audit is complete.

## Important Operating Rule

Do not paste all implementation stages at once. The purpose of this pack is to prevent the agent from rushing into code before architecture and requirements are settled.

## Approval Message Template

Use this after checking a stage:

```text
Stage [number] is approved.

Approved decisions:
- [decision]
- [decision]

Required corrections before the next stage:
- None

Proceed only with Stage [next number].
```

When corrections are required:

```text
Stage [number] is not approved.

Fix only these items:
1. [issue]
2. [issue]
3. [issue]

Re-run the stage validation and return the complete stage report again.
Do not start the next stage.
```

## Files the Agent Must Maintain

- `docs/PROJECT_PROGRESS.md`
- `docs/architecture/*`
- `docs/content/content-requirements.md`
- `docs/testing/test-strategy.md`
- ADR records for major technical decisions

## Content Safety

The agent must not publish invented business facts. Until the client supplies real phone numbers, email addresses, map location, social links, legal text, testimonials, project counts, years of experience, awards, or certifications, those values must remain unpublished CMS content requirements rather than fabricated frontend data.

## Stage Map

| Stage | Purpose | Coding Allowed |
|---|---|---:|
| 1 | Discovery and scope | No |
| 2 | Information architecture and content | No |
| 3 | Technical architecture and folder structure | No |
| 4 | Database and domain design | No |
| 5 | Routes, authorization, CMS, and APIs | No |
| 6 | UI/UX system and responsive behavior | No |
| 7 | SEO, performance, accessibility, and security plans | No |
| 8 | Project foundation and authentication | Yes |
| 9 | Backend CMS implementation | Yes |
| 10 | Media and image pipeline | Yes |
| 11 | Public website implementation | Yes |
| 12 | Admin panel implementation | Yes |
| 13 | Inquiry, search, export, SEO, and sitemap | Yes |
| 14 | Optimization and hardening | Yes |
| 15 | Automated testing and QA | Yes |
| 16 | Deployment and documentation | Yes |
| 17 | Final production audit | Fixes only |


---

# FILE: 02_STAGE_01_DISCOVERY_AND_SCOPE.md

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


---

# FILE: 03_STAGE_02_INFORMATION_ARCHITECTURE.md

# Stage 2 — Information Architecture, Content Model, and Page Specifications

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

Design the complete public-site information architecture and page-level content requirements before technical implementation.

## Instructions

Do not write application code.

Create:

- `docs/ux/sitemap.md`
- `docs/ux/navigation.md`
- `docs/ux/page-specifications.md`
- `docs/ux/user-flows.md`
- `docs/content/content-model.md`
- `docs/content/editorial-guidelines.md`
- `docs/content/image-guidelines.md`
- `docs/content/legal-content-needs.md`

## Required Sitemap

Include:

- Home
- Collections index
- Collection detail
- Products index
- Product detail
- About Us
- Our Craftsmanship
- Contact
- Privacy Policy
- Terms and Conditions
- 404
- XML sitemap endpoint
- Search results behavior if public product search is included

## Page Specification Requirements

For each page define:

- Purpose
- Primary audience
- Primary action
- Secondary action
- Required content
- Required CMS fields
- SEO intent
- Structured-data type
- Breadcrumb behavior
- Empty states
- Error states
- Responsive behavior
- Accessibility concerns
- Performance concerns

## Homepage Content Model

Specify editable fields and ordering rules for:

- Hero slider or banner
- Featured collections
- Best-selling products
- About section
- Why choose us
- Craftsmanship process
- Latest products
- Inquiry CTA
- Optional social/gallery section
- Footer content
- Contact details
- Social links

Decide which sections are:

- Structured CMS records
- Reorderable
- Hideable
- Globally reusable
- Page-specific
- Media-dependent

## Navigation Requirements

Define:

- Desktop header
- Mobile menu
- Sticky behavior
- Active states
- Keyboard behavior
- Focus management
- Footer navigation
- Legal links
- Contact shortcuts
- WhatsApp shortcut
- Breadcrumbs

## Content Rules

- Do not invent business claims.
- Define editorial tone: warm, refined, human, craft-focused, and concise.
- Define product-description structure.
- Define alt-text guidelines.
- Define acceptable title and meta-description lengths.
- Define image orientation and crop requirements.
- Define content fallback rules without using public placeholder copy.

## Acceptance Criteria

- Every route has a page specification.
- Every page section maps to CMS-managed or fixed system content.
- Category and collection responsibilities are unambiguous.
- Responsive and accessibility expectations are documented.
- Content requirements identify every item the client must supply.
- Navigation works as a coherent visitor journey.

End with the mandatory stage completion report and stop.


---

# FILE: 04_STAGE_03_TECHNICAL_ARCHITECTURE.md

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


---

# FILE: 05_STAGE_04_DATABASE_AND_DOMAIN.md

# Stage 4 — Database Schema and Domain Model

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

Design the complete normalized MySQL schema, model relationships, indexes, statuses, deletion behavior, and migration order before writing migrations.

## Deliverables

Create:

- `docs/architecture/database.md`
- `docs/architecture/erd.md`
- `docs/architecture/model-catalog.md`
- `docs/architecture/index-strategy.md`
- `docs/architecture/data-retention.md`
- `docs/architecture/migration-order.md`
- ADRs for schema decisions that affect future extensibility

## Required Core Entities

At minimum evaluate and define:

- Users
- Roles and permissions or a simpler policy-backed role model
- Categories
- Collections
- Products
- Product-category relationship if multiple categories are allowed
- Collection-product relationship
- Product media/gallery ordering
- Media library
- Hero banners
- Homepage sections/items
- Craftsmanship steps
- Why-choose-us items
- Page content
- Contact information
- Social links
- Inquiries
- Inquiry notes or activity
- SEO metadata
- Redirects for changed slugs
- Settings
- Activity/audit logs where justified

## Product Schema Requirements

Support:

- Name
- Unique slug
- Short description
- Full description
- Dimensions
- Material
- Finish
- Featured image
- Ordered gallery
- Category
- Collections
- Status
- Publication date
- Sort order
- Featured flag
- Best-selling editorial flag
- Latest behavior
- SEO fields
- Open Graph image
- Created by
- Updated by
- Soft delete decision
- Timestamps

## Schema Decisions to Explain

- Category hierarchy or flat taxonomy
- Whether a product can have multiple categories
- Collection behavior
- Slug uniqueness and history
- Draft/published/archived behavior
- Soft deletion
- Media reuse
- Media variants
- Global versus page-specific SEO fields
- Flexible settings versus typed tables
- Inquiry privacy retention
- Audit history
- Sorting
- Database collation
- Text column choices
- Foreign-key delete behavior
- Indexes for public lists, admin filters, search, sitemap, and latest/featured queries

## Future-Readiness Rules

The current schema must not implement ecommerce, but it must avoid blocking future:

- Product variants
- Prices
- Inventory
- Orders
- Payments
- Multiple languages
- Blog content

Do not add unused ecommerce tables now.

## Required ERD Quality

For every table specify:

- Columns and data types
- Nullability
- Default values
- Unique constraints
- Foreign keys
- Indexes
- Relationships
- Cascade/restrict/set-null behavior
- Data ownership
- Expected row volume
- Sensitive-data classification

## Acceptance Criteria

- All CMS entities map to tables or justified configuration.
- Public queries have indexes.
- Slug changes have a redirect/history strategy.
- Media ordering and replacement are fully modeled.
- Inquiry statuses and audit behavior are modeled.
- No generic JSON “catch-all” replaces important typed data.
- Migration order is executable and free of circular dependency.

End with the mandatory stage completion report and stop.


---

# FILE: 06_STAGE_05_ROUTES_AUTHORIZATION_CMS.md

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


---

# FILE: 07_STAGE_06_UI_UX_AND_ADMIN_KIT.md

# Stage 6 — Public UI/UX System and Admin UI Kit Integration Plan

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

Finalize the visual system, interaction model, responsive rules, component inventory, and supplied admin UI kit mapping before frontend coding.

## Design Direction

Create an original luxury handcrafted-art experience influenced by refined editorial and furniture brands, without copying another brand's layout or assets.

Visual characteristics:

- Warm neutral palette
- Rich wood-inspired accent tones
- Generous whitespace
- Editorial image composition
- Elegant typography
- Quiet hierarchy
- Soft shadows
- Restrained borders
- High-quality motion
- Strong product focus

## Deliverables

Create:

- `docs/ux/design-principles.md`
- `docs/ux/design-tokens.md`
- `docs/ux/typography.md`
- `docs/ux/color-system.md`
- `docs/ux/spacing-and-layout.md`
- `docs/ux/responsive-breakpoints.md`
- `docs/ux/public-component-inventory.md`
- `docs/ux/interaction-and-motion.md`
- `docs/ux/admin-ui-kit-mapping.md`
- `docs/ux/accessibility-behavior.md`
- Text wireframes or low-fidelity screen specifications for every page

## Public Component Inventory

Plan components such as:

- Announcement/contact strip when justified
- Header
- Desktop navigation
- Mobile navigation
- Hero
- Section heading
- Collection card
- Product card
- Product grid
- Filters/search controls
- Product gallery
- Product zoom/lightbox
- Breadcrumbs
- Specification list
- Related products
- Craftsmanship timeline/process
- Inquiry CTA
- Contact form
- Map embed wrapper
- Social links
- Footer
- Empty state
- Error state
- Pagination
- Cookie/privacy notice only if legally required

## Responsive Coverage

Define behavior for:

- Small mobile
- Large mobile
- Tablet portrait
- Tablet landscape
- Laptop
- Desktop
- Large desktop
- Ultra-wide

Include max-content widths, readable line lengths, grid column changes, image ratios, menu behavior, gallery behavior, and touch interactions.

## Motion Plan

Use:

- Page-entry transitions
- Scroll reveals
- Fade, slide, scale, and image reveal
- Button micro-interactions
- Product-card hover
- Optional counters only where real numeric content exists
- Parallax only where it improves storytelling

Rules:

- Animate transform and opacity where possible.
- Respect `prefers-reduced-motion`.
- Prevent layout shift.
- Do not block interaction.
- Do not animate every element.
- Keep motion timings and easing tokens documented.

## Admin UI Kit Mapping

Inspect the supplied kit before implementation and document:

- Existing layouts
- Sidebar/header
- Form controls
- Tables
- Cards
- Modals/dialogs
- Drawers
- Toasts
- Pagination
- File upload
- Tabs
- Badges
- Empty states
- Loading states
- Theme support
- Accessibility gaps that must be corrected without visually redesigning the kit

## Acceptance Criteria

- Every page can be composed from the documented component system.
- Public visual identity is original and premium.
- Admin implementation reuses the UI kit rather than recreating it.
- Responsive rules cover all required viewport classes.
- Motion has reduced-motion alternatives.
- Forms, menus, gallery, dialog, and lightbox behavior are keyboard-accessible.

End with the mandatory stage completion report and stop.


---

# FILE: 08_STAGE_07_QUALITY_PLANS.md

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


---

# FILE: 09_STAGE_08_PROJECT_FOUNDATION.md

# Stage 8 — Project Foundation, Tooling, Authentication, and Shared Infrastructure

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

Begin implementation only after Stages 1–7 are approved. Establish the production project foundation without yet completing all CMS modules.

## Required Implementation

- Install the latest stable Laravel version available at implementation time.
- Record exact PHP, Laravel, Node.js, npm/pnpm, Inertia, React, TypeScript, and MySQL requirements.
- Configure Vite for separate public and admin entry points.
- Configure strict TypeScript.
- Configure formatting, linting, and static analysis.
- Configure testing tools.
- Implement Laravel authentication for admin users.
- Implement admin route protection.
- Implement base roles/permissions according to the approved authorization plan.
- Implement shared Blade public layout.
- Integrate the supplied admin UI kit base layout without redesign.
- Implement global exception handling and user-safe error pages.
- Configure queues, cache, filesystem, mail, and logs through environment variables.
- Create `.env.example`.
- Create the approved folder structure.
- Add health-check behavior that does not expose sensitive details.
- Add base security headers according to the approved plan.
- Add project documentation and setup commands.

## Rules

- Do not add demo users to production seeding.
- A local-only development admin seeder may exist only if it is clearly environment-gated and documented.
- Do not hardcode secrets.
- Do not expose stack traces in production.
- Do not use CDN-hosted runtime dependencies unless approved.
- Do not replace the admin UI kit with a new component library.

## Validation

Run and report:

- Dependency installation
- Laravel test suite
- Static analysis
- PHP code style
- TypeScript type check
- JavaScript lint
- Production asset build
- Route inspection
- Configuration/cache smoke test
- Authentication feature tests

## Acceptance Criteria

- Fresh clone setup is documented and repeatable.
- Public and admin builds compile without warnings.
- Admin authentication works.
- Unauthorized users cannot access CMS routes.
- Strict TypeScript passes.
- No console errors on base pages.
- No secrets or local paths are committed.
- Project structure matches the approved architecture.

End with the mandatory stage completion report and stop.


---

# FILE: 10_STAGE_09_BACKEND_CMS.md

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


---

# FILE: 11_STAGE_10_MEDIA_PIPELINE.md

# Stage 10 — Secure Media Library and Image Processing Pipeline

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

Implement secure, reusable, optimized media handling for product photography and CMS imagery.

## Required Features

- JPG, JPEG, PNG, and WebP input
- Content-based MIME validation
- File-size and dimension limits
- Randomized storage names
- Metadata storage
- Alt text
- Caption where approved
- Media library search and filtering
- Drag-and-drop upload in admin
- Upload progress
- Replace
- Delete with reference protection
- Reorder product gallery images
- Featured-image selection
- Automatic thumbnail generation
- Responsive variants
- WebP output
- Optional AVIF only if reliably supported by the selected stack
- Queue-based processing where appropriate
- Failed-job handling
- Orphan cleanup strategy
- Safe SVG policy: reject by default unless a sanitizer and explicit business need are approved

## Image Variant Plan

Implement the approved named sizes for:

- Hero banners
- Collection cards
- Product cards
- Product detail gallery
- Thumbnails
- Social preview images when generated

Preserve aspect ratios according to approved crop rules.

## Security Requirements

- Do not trust extensions.
- Reject executable or polyglot content.
- Do not render unprocessed uploads directly.
- Avoid user-controlled storage paths.
- Protect private originals if the approved storage plan requires it.
- Apply authorization to upload, replace, delete, and browse.
- Rate limit uploads.
- Log upload failures.
- Document malware scanning integration for production.

## Performance Requirements

- Avoid processing large images in the web request when queues are available.
- Strip unnecessary metadata unless business needs require retention.
- Set width and height metadata.
- Use appropriate quality settings without visibly degrading luxury product photography.
- Ensure public image markup supports `srcset` and `sizes`.

## Tests

Add tests for:

- Valid files
- Invalid MIME
- Oversized files
- Corrupt images
- Unauthorized uploads
- Replacement
- Deletion constraints
- Variant generation
- Gallery sorting
- Queue failures
- Orphan cleanup

## Acceptance Criteria

- Uploading, replacing, deleting, selecting, and sorting media work.
- Invalid files are rejected safely.
- Responsive variants are generated.
- Product pages can render optimized responsive images.
- No public page uses unoptimized original uploads by default.
- All media tests pass.

End with the mandatory stage completion report and stop.


---

# FILE: 12_STAGE_11_PUBLIC_WEBSITE.md

# Stage 11 — Public Website Implementation

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

Implement the complete premium public website using Blade, semantic HTML, production CSS, and focused JavaScript.

## Required Pages

- Home
- Collections
- Collection Details
- Products
- Product Details
- About Us
- Our Craftsmanship
- Contact
- Privacy Policy
- Terms and Conditions
- 404

## Required Homepage Sections

- Hero
- Featured collections
- Best-selling products
- About Zarokha
- Why choose us
- Craftsmanship process
- Latest products
- Inquiry CTA
- Optional gallery/social section
- Footer

## Required Product Experience

- Breadcrumb
- Image gallery
- Zoom or accessible lightbox
- Responsive images
- Product information
- Dimensions
- Material
- Finish
- Category
- Collections where relevant
- Related products
- Inquiry button
- WhatsApp button
- SEO metadata
- Structured data
- Graceful behavior when optional fields are absent

## Public Search and Filtering

Implement only the approved launch behavior:

- Product search
- Category filter
- Collection filter if approved
- Sort behavior if approved
- Pagination
- Query-string persistence
- Empty state
- No-results state
- Canonical/indexing rules

## Contact Page

Implement:

- Business information from CMS
- Contact form
- Phone
- Email
- WhatsApp
- Social links
- Google Map using a privacy-conscious loading strategy
- Accessible fallback link when map embed is blocked
- Success, validation, rate-limit, and server-error states

## Design and Motion

- Use approved design tokens.
- Preserve large spacing and editorial image treatment.
- Implement subtle page transitions and reveals.
- Respect reduced motion.
- Keep interactions responsive and keyboard-accessible.
- Avoid layout shift.
- Avoid animation libraries unless their value outweighs payload cost.

## Validation

Test:

- All routes
- Navigation
- Breadcrumbs
- Forms
- Gallery
- Zoom
- Search
- Filtering
- Pagination
- Responsive layouts
- Keyboard navigation
- Reduced motion
- No-JavaScript baseline for essential content
- Browser matrix
- Console errors
- Broken links
- Missing images
- Lighthouse against approved budgets

## Acceptance Criteria

- Every public page is complete and CMS-driven.
- No placeholder content is published.
- All essential content works without client-side application boot.
- Mobile and ultra-wide layouts are intentionally designed.
- Forms and interactive media are accessible.
- No broken links, console errors, or missing assets exist.
- Public performance stays within approved budgets.

End with the mandatory stage completion report and stop.


---

# FILE: 13_STAGE_12_ADMIN_PANEL.md

# Stage 12 — React + Inertia Admin Panel Implementation

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

Implement the complete CMS interface using React, Inertia.js, TypeScript, and the supplied admin UI kit.

## Non-Negotiable UI Rule

Inspect and reuse the supplied UI kit. Do not replace its design language, recreate existing primitives, or introduce a competing component library. Correct accessibility or functional defects with minimal visual disruption.

## Required Modules

- Dashboard
- Products
- Categories
- Collections
- Product galleries
- Media library
- Homepage management
- Banner management
- About page
- Craftsmanship page
- Contact information
- Inquiries
- SEO
- Redirects
- Users and permissions
- Settings
- Activity history if approved

## Dashboard

Implement:

- Quick statistics
- Recent products
- Recent inquiries
- Recent activity
- System status that reports only safe operational information
- Useful empty states
- Links to common actions

Do not show invented business metrics.

## React Architecture

Use:

- Strict TypeScript
- Typed Inertia page props
- Reusable feature components
- Shared form controls from the UI kit
- Feature-specific hooks
- Predictable form state
- Accessible dialogs and drawers
- Loading, success, warning, empty, and error states
- Lazy loading for suitable admin routes
- No duplicated CRUD form logic
- No `any` unless documented and unavoidable

## Forms

Support:

- Client-side usability validation
- Server-authoritative validation
- Unsaved-change protection where useful
- Accessible error summaries
- Field-level errors
- Disabled/submitting states
- Success feedback
- Destructive-action confirmation
- Correct focus movement after errors or dialogs

## Tables and Lists

Support approved:

- Search
- Filtering
- Sorting
- Pagination
- Bulk actions only where approved
- Status badges
- Responsive behavior
- Keyboard access
- Empty states
- Error states

## Tests and Validation

Run:

- Type check
- Lint
- Production build
- Inertia feature tests
- React component tests for critical reusable interactions
- End-to-end CMS smoke tests
- Keyboard checks
- Console error checks
- Permission checks

## Acceptance Criteria

- Every required CMS module is operational.
- The supplied UI kit is consistently used.
- All forms and lists have complete states.
- Permissions are reflected in visible actions and enforced server-side.
- No TypeScript errors, console errors, warnings, dead code, or unused imports remain.
- Admin routes are code-split where valuable and practical.

End with the mandatory stage completion report and stop.


---

# FILE: 14_STAGE_13_INQUIRY_SEARCH_SEO.md

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


---

# FILE: 15_STAGE_14_OPTIMIZATION_HARDENING.md

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


---

# FILE: 16_STAGE_15_TESTING_QA.md

# Stage 15 — Automated Testing, Cross-Browser QA, and Content QA

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

Execute the full test strategy, fix defects, and prove that the system is ready for deployment.

## Automated Test Requirements

Run and complete:

- Unit tests
- Feature tests
- Policy tests
- Form Request tests
- Authentication tests
- CMS CRUD tests
- Publishing tests
- Slug and redirect tests
- Media upload and processing tests
- Inquiry tests
- Search and filter tests
- Export tests
- SEO tests
- Sitemap tests
- Inertia page/prop tests
- Critical React component tests
- End-to-end smoke tests
- Accessibility automation
- Production build tests

## Manual QA

Test:

- Desktop
- Laptop
- Tablet portrait and landscape
- Small and large mobile
- Large desktop
- Ultra-wide

Browsers:

- Current Chrome
- Current Edge
- Current Firefox
- Current Safari where available
- Mobile Safari
- Chrome on Android

## Content QA

Verify:

- No placeholder or invented content
- No broken images
- Correct alt text
- Correct phone/email/WhatsApp links
- Correct map
- Correct legal links
- Consistent product fields
- Consistent capitalization and punctuation
- Meta title and description uniqueness
- No accidental draft content
- No empty required section
- No duplicate slugs
- No lorem ipsum
- No test inquiries or demo users in production data

## Defect Handling

For every defect record:

- Severity
- Steps to reproduce
- Expected result
- Actual result
- Fix
- Regression test
- Validation evidence

## Acceptance Criteria

- All critical and high-priority tests pass.
- No severity-one or severity-two defect remains.
- All pages and actions work across the approved browser matrix.
- Content QA passes.
- Production build is clean.
- Test documentation matches actual commands and results.

End with the mandatory stage completion report and stop.


---

# FILE: 17_STAGE_16_DEPLOYMENT_DOCUMENTATION.md

# Stage 16 — Deployment, Operations, Backups, and Documentation

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

Prepare the application for repeatable, secure production deployment and ongoing maintenance.

## Required Documentation

Complete:

- `README.md`
- `.env.example`
- `docs/setup/local-development.md`
- `docs/deployment/production.md`
- `docs/deployment/web-server.md`
- `docs/deployment/ssl-and-domain.md`
- `docs/deployment/queue-worker.md`
- `docs/deployment/scheduler.md`
- `docs/deployment/storage.md`
- `docs/deployment/cache.md`
- `docs/deployment/email.md`
- `docs/deployment/backups.md`
- `docs/deployment/restore-test.md`
- `docs/deployment/monitoring.md`
- `docs/deployment/logging.md`
- `docs/deployment/rollback.md`
- `docs/deployment/release-checklist.md`
- `docs/admin/cms-user-guide.md`

## Deployment Requirements

Document and validate:

- PHP extensions
- MySQL requirements
- Node/build requirements
- Environment variables
- Production `APP_ENV` and debug settings
- Composer install flags
- Asset build
- Migration strategy
- Seed strategy
- Storage linking or object storage
- File permissions
- Queue workers
- Scheduler
- Cache warmup
- Config/route/view caching
- Web-server compression
- Browser cache headers
- HTTPS
- Security headers
- Email delivery
- DNS assumptions
- Health checks
- Log rotation
- Error monitoring
- Backups
- Restore procedure
- Rollback procedure
- Zero- or low-downtime deployment approach
- Maintenance mode behavior

## Admin Guide

Document how an authorized user can:

- Sign in and reset password
- Add and publish a product
- Manage categories and collections
- Upload and reorder images
- Update homepage sections
- Update banners
- Update About and Craftsmanship content
- Update contact details and social links
- Review and update inquiries
- Export inquiries
- Manage SEO
- Manage redirects
- Manage users according to permission

## Acceptance Criteria

- A fresh environment can be deployed from documentation.
- Backup and restore instructions are testable.
- Queue and scheduler operations are documented.
- Rollback steps are explicit.
- Production security settings are clear.
- CMS guide covers every routine operation.
- No documentation references nonexistent commands or files.

End with the mandatory stage completion report and stop.


---

# FILE: 18_STAGE_17_FINAL_AUDIT.md

# Stage 17 — Final Production Audit and Release Sign-Off

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

Perform a final evidence-based audit. Only fixes are allowed in this stage; do not add new scope.

## Audit Areas

### Scope

- All approved pages exist.
- All approved CMS modules exist.
- No excluded ecommerce feature was introduced.
- Future-ready architecture remains documented but unimplemented.

### Functionality

- Navigation
- Search
- Filters
- Product browsing
- Gallery
- Zoom/lightbox
- Inquiry forms
- WhatsApp links
- Phone and email links
- CMS CRUD
- Publishing
- Media management
- Inquiry workflow
- Export
- SEO settings
- Users and permissions
- 404 and redirects

### Quality

- No console errors
- No warnings
- No broken links
- No broken images
- No placeholder content
- No TODOs
- No dead routes
- No unused dependencies
- No unused code
- No failing tests
- No accessibility-critical defects
- No critical/high security findings
- No performance-budget regressions

### Production Configuration

- Debug disabled
- Correct environment
- HTTPS
- Secure cookies
- Cache configured
- Queue running
- Scheduler configured
- Storage configured
- Mail configured
- Backups configured
- Monitoring configured
- Robots correct for production
- Sitemap reachable
- Admin blocked from indexing
- Canonicals correct

## Required Release Artifacts

Produce:

- Final file-change summary
- Final route inventory
- Final database migration inventory
- Final dependency inventory
- Final test report
- Final accessibility report
- Final security report
- Final performance report
- Final deployment checklist
- Known limitations
- Accepted risks
- Client content still required
- CMS handover checklist
- Release notes

## Sign-Off Rule

Do not state “production ready” unless every mandatory acceptance criterion passes or an explicit, documented, user-approved exception exists.

## Final Acceptance Criteria

- All previous stages are approved.
- All tests pass.
- Production build passes.
- Deployment documentation is verified.
- Critical public and admin journeys pass.
- Security, accessibility, SEO, and performance audits pass.
- Real client content dependencies are clearly separated from technical completeness.

End with:

`FINAL AUDIT COMPLETE — READY FOR CLIENT RELEASE APPROVAL`

Then stop.


---

# FILE: 19_STAGE_REVIEW_CHECKLIST.md

# Zarokha Wooden Arts — Stage Review Checklist

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

Use this file to review the agent's output before approving the next stage.

## Universal Checks for Every Stage

- [ ] The agent worked only on the requested stage.
- [ ] The stage objective was completed.
- [ ] All required deliverables exist.
- [ ] Decisions include reasons and trade-offs.
- [ ] No required item was silently skipped.
- [ ] No invented business content was introduced.
- [ ] Files created or changed are listed.
- [ ] Commands and validation results are shown.
- [ ] Risks and assumptions are explicit.
- [ ] The acceptance checklist is complete.
- [ ] The response ends with the required stop line.

## Planning Gate — Before Stage 8

Approve implementation only when all are true:

- [ ] Business scope is locked.
- [ ] Sitemap and page specifications are complete.
- [ ] CMS content model is complete.
- [ ] Technical architecture is approved.
- [ ] Folder structure is approved.
- [ ] Database schema and ERD are approved.
- [ ] Routes and controller map are approved.
- [ ] Authorization matrix is approved.
- [ ] Admin data contracts are approved.
- [ ] Public design system is approved.
- [ ] Admin UI kit mapping is approved.
- [ ] SEO plan is approved.
- [ ] Performance budget is approved.
- [ ] Accessibility plan is approved.
- [ ] Security plan is approved.
- [ ] Test strategy is approved.

## Implementation Review

### Foundation

- [ ] Fresh install works.
- [ ] Authentication works.
- [ ] Public/admin separation is correct.
- [ ] Type checking, linting, tests, and production build pass.
- [ ] Environment setup is documented.

### Backend

- [ ] All migrations match the approved schema.
- [ ] Every write action is validated.
- [ ] Every admin action is authorized.
- [ ] Publishing and slug behavior are correct.
- [ ] Caches invalidate correctly.
- [ ] No N+1 queries in key paths.

### Media

- [ ] Upload validation is secure.
- [ ] Variants and thumbnails are generated.
- [ ] Reordering, replacing, and deletion work.
- [ ] Public pages use optimized variants.
- [ ] Failed processing is handled.

### Public Website

- [ ] Every page is complete.
- [ ] Design feels premium and handcrafted.
- [ ] Mobile, tablet, desktop, and ultra-wide are intentional.
- [ ] Product gallery and zoom work.
- [ ] Inquiry and WhatsApp actions work.
- [ ] No placeholder or invented content appears.
- [ ] No broken links or console errors exist.

### Admin Panel

- [ ] Supplied UI kit is reused.
- [ ] Every CMS module works.
- [ ] All states are present: loading, empty, success, validation, failure.
- [ ] Permissions hide and block unauthorized actions.
- [ ] TypeScript is strict and error-free.

### SEO, Performance, Accessibility, Security

- [ ] Canonicals and metadata are correct.
- [ ] Structured data is valid.
- [ ] Sitemap and robots are correct.
- [ ] Performance budgets are met or exceptions are approved.
- [ ] Keyboard navigation passes.
- [ ] Reduced motion works.
- [ ] No critical accessibility defect remains.
- [ ] No critical/high security issue remains.

### Deployment

- [ ] Deployment steps are repeatable.
- [ ] Queue and scheduler are configured.
- [ ] Backups and restore are documented.
- [ ] Rollback is documented.
- [ ] Production debug is disabled.
- [ ] Monitoring and logs are configured.
- [ ] CMS handover guide is complete.


---

# FILE: 20_PROJECT_PROGRESS_TEMPLATE.md

# Project Progress

## Project

Zarokha Wooden Arts website and custom CMS.

## Status Legend

- Not started
- In progress
- Ready for review
- Changes requested
- Approved
- Blocked

## Stage Tracker

| Stage | Name | Status | Completion Date | Approved By | Notes |
|---:|---|---|---|---|---|
| 1 | Discovery and Scope | Not started |  |  |  |
| 2 | Information Architecture | Not started |  |  |  |
| 3 | Technical Architecture | Not started |  |  |  |
| 4 | Database and Domain | Not started |  |  |  |
| 5 | Routes and CMS Plan | Not started |  |  |  |
| 6 | UI/UX and Admin Kit | Not started |  |  |  |
| 7 | Quality Plans | Not started |  |  |  |
| 8 | Project Foundation | Not started |  |  |  |
| 9 | Backend CMS | Not started |  |  |  |
| 10 | Media Pipeline | Not started |  |  |  |
| 11 | Public Website | Not started |  |  |  |
| 12 | Admin Panel | Not started |  |  |  |
| 13 | Inquiry, Search, and SEO | Not started |  |  |  |
| 14 | Optimization and Hardening | Not started |  |  |  |
| 15 | Testing and QA | Not started |  |  |  |
| 16 | Deployment and Documentation | Not started |  |  |  |
| 17 | Final Audit | Not started |  |  |  |

## Approved Decisions

Record only decisions explicitly approved by the user.

## Open Risks

| Risk | Probability | Impact | Mitigation | Owner | Status |
|---|---|---|---|---|---|

## Client Content Required

| Content | Required For | Status | Notes |
|---|---|---|---|

## Known Blockers

None.
