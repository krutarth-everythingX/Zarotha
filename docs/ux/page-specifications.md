# Page Specifications

## Home

- Purpose: establish brand positioning and route visitors into browsing and inquiry paths.
- Primary action: browse products.
- Secondary action: start a general inquiry or WhatsApp conversation.
- Required content: hero, featured categories or products, about preview, craftsmanship preview, inquiry CTA, footer, and approved contact details.
- Empty states: hide optional empty sections gracefully.

## Products Index

- Purpose: provide the main searchable and filterable catalogue view.
- Primary action: open a product detail page.
- Secondary action: refine results using search, category filtering, and sorting.
- Required content: page heading, search, category filter, sort control, active-filter summary, product grid, pagination, and empty-state recovery.
- SEO note: query states stay on `/products`.

## Product Detail

- Purpose: provide full product context and convert interest into inquiry.
- Primary action: submit a product inquiry.
- Secondary action: continue browsing related products or use WhatsApp when configured.
- Required content: title, category, image gallery, descriptions, specifications, inquiry actions, related products, and breadcrumbs.
- Related-products rule: use same-category relationships, not Collections.
- Missing optional fields must hide cleanly.

## About Us

- Purpose: explain the brand story and build trust.
- Primary action: continue browsing products.
- Secondary action: contact the brand.
- Required content: heading, narrative content, supporting imagery when supplied, and inquiry-safe CTA.

## Our Craftsmanship

- Purpose: communicate process, material care, and craftsmanship value.
- Primary action: continue to products.
- Secondary action: inquire.
- Required content: heading, ordered sections or steps, supporting imagery when supplied, and CTA back to products.

## Contact

- Purpose: provide approved direct contact methods and the general inquiry form.
- Primary action: submit the contact form.
- Secondary action: use phone, email, or WhatsApp shortcuts.
- Required content: heading, intro, contact methods, form, validation states, success state, and privacy-aware helper text.

## Privacy Policy

- Purpose: publish approved privacy disclosures.
- Required content: page title, effective date when supplied, and long-form legal content.
- Publishing rule: do not present fake or placeholder legal facts as final content.

## Terms And Conditions

- Purpose: publish approved terms content.
- Required content: page title, effective date when supplied, and long-form legal content.

## 404

- Purpose: recover from invalid or removed URLs.
- Primary action: return to Home or Products.
- Secondary action: open Contact.
- Required content: calm message, recovery links, and true `404` status behavior.

## XML Sitemap

- Purpose: expose indexable public URLs for search engines.
- Required content: indexable fixed pages and published product routes only.
- Exclusion rule: Collections are not included.
