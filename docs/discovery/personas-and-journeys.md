# Personas And Journeys

## Visitor Personas

### Homeowner buyer

- Goal: discover premium handcrafted decor and contact the brand for pricing, customization, or purchase discussion.
- Needs: strong imagery, dimensions, material and finish information, trust signals, and easy contact paths.
- Pain points: uncertainty about size, finish, quality, and whether the brand is credible.

### Interior designer or architect

- Goal: evaluate products for a design project and quickly short-list suitable pieces.
- Needs: efficient browsing, collection context, product specifications, and fast inquiry handling.
- Pain points: slow browsing, incomplete specs, weak imagery, or unclear bulk and customization options.

### Returning comparison visitor

- Goal: revisit products previously seen and decide whether to inquire.
- Needs: memorable URLs, related items, stable navigation, and simple contact options.
- Pain points: difficulty finding the same product again or confirming finish and dimension details.

## Admin Personas

### Super admin

- Goal: control access, publishing standards, SEO defaults, and platform settings.

### Content manager

- Goal: keep products, collections, galleries, and homepage sections current and visually strong.

### Inquiry manager

- Goal: process inbound leads efficiently and maintain follow-up visibility.

## User Journeys

### 1. Visitor discovers the brand from search

- Entry point: search engine result leading to Home, collection, or product page.
- Success path: visitor lands on a fast, indexable page, understands the brand positioning, and continues browsing.
- Failure states: wrong page intent, weak metadata, slow page load, missing content, or no obvious next action.

### 2. Visitor browses a collection

- Entry point: homepage featured collection, collections index, or direct search result.
- Success path: visitor understands the collection theme, views relevant products, and navigates deeper.
- Failure states: unclear collection purpose, empty collection, poor imagery, or broken product links.

### 3. Visitor filters or searches products

- Entry point: products index or collection detail page.
- Success path: visitor narrows results using search or filters and finds relevant products quickly.
- Failure states: irrelevant results, empty states without recovery guidance, or unavailable filtering options.

### 4. Visitor opens a product

- Entry point: product card from search, collection, related products, or homepage section.
- Success path: product page loads with clear title, imagery, specs, descriptions, breadcrumbs, and inquiry actions.
- Failure states: missing product data, poor mobile layout, missing breadcrumbs, or product page not found.

### 5. Visitor examines imagery and specifications

- Entry point: product detail page gallery and specification area.
- Success path: visitor can review high-quality images, zoom where available, and understand dimensions, material, finish, category, and collection context.
- Failure states: low-resolution images, missing alt text, broken gallery controls, or absent specification fields.

### 6. Visitor sends a product inquiry

- Entry point: product detail inquiry call to action.
- Success path: form captures visitor details, product reference, consent where required, and submission confirmation.
- Failure states: validation errors without clear messaging, spam abuse, lost product reference, or no success confirmation.

### 7. Visitor contacts through WhatsApp

- Entry point: product detail page, contact page, or sticky contact call to action.
- Success path: WhatsApp opens with a prefilled but editable message referencing the page or product when applicable.
- Failure states: broken link, missing device fallback, unclear destination number, or fabricated availability claims.

### 8. Visitor submits the contact form

- Entry point: Contact page or general inquiry section.
- Success path: visitor submits a general question, receives confirmation, and the inquiry is stored for staff follow-up.
- Failure states: unclear required fields, missing consent handling, spam submissions, or no staff visibility in CMS.

### 9. Admin signs in

- Entry point: admin login page.
- Success path: authorized user signs in securely and reaches the CMS dashboard according to permissions.
- Failure states: invalid credentials, throttling event, or unauthorized access attempt.

### 10. Admin creates and publishes a product

- Entry point: Products module in CMS.
- Success path: admin enters content, imagery, SEO fields, status, flags, and publication details, then publishes successfully.
- Failure states: validation problems, missing required media, duplicate slug issues, or permission denial.

### 11. Admin manages a gallery

- Entry point: product gallery or media library module.
- Success path: admin uploads, orders, labels, and removes gallery images appropriately.
- Failure states: invalid file type, oversized media, missing alt context, or broken sort behavior.

### 12. Admin updates homepage sections

- Entry point: homepage content and banners modules.
- Success path: admin updates hero, editorial highlights, and calls to action without code changes.
- Failure states: missing source content, invalid section references, or publishing conflicts.

### 13. Admin reviews, filters, replies to, exports, and archives inquiries

- Entry point: inquiries module.
- Success path: admin can search, filter by status or source, track reply state, export safely, add notes, assign ownership, and archive resolved inquiries.
- Failure states: missing filters, unsafe CSV export, no reply traceability, or permission leakage.

### 14. Admin updates SEO settings

- Entry point: SEO module or relevant content forms.
- Success path: admin manages metadata, canonical behavior, social images, and page-level optimization fields.
- Failure states: duplicate metadata, missing canonical control, or indexing of internal/admin pages.

### 15. Admin manages another CMS user according to permissions

- Entry point: users and roles module.
- Success path: authorized admin can create, edit, activate, deactivate, or assign roles within policy rules.
- Failure states: privilege escalation, unclear permissions, or inability to audit sensitive changes.
