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
