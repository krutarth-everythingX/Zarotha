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
