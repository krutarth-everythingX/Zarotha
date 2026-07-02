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
