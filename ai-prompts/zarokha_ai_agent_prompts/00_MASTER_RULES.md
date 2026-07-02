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
