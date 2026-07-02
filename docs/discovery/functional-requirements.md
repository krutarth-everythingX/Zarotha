# Functional Requirements

## Public Website Requirements

### Global requirements

- The public site must be a Laravel-rendered catalogue experience with semantic pages and inquiry conversion paths.
- Main navigation must expose Home, Collections, Products, About Us, Our Craftsmanship, and Contact.
- Footer must expose core navigation, contact actions, and legal links.
- Breadcrumbs must appear where appropriate, especially for collection and product detail pages.

### Page requirements

#### Home

- Present premium brand positioning and handcrafted identity.
- Surface homepage sections defined in scope.
- Route visitors into collections, products, and inquiry actions.

#### Collections

- List curated collections with imagery, names, and short summaries.

#### Collection Details

- Present collection story or context and show associated products.
- Support navigation from collection to product detail pages.

#### Products

- List products with cards, search, and filtering.
- Support sorting or editorial ordering as later defined in architecture.

#### Product Details

- Display name, short description, full description, featured image, gallery, dimensions, material, finish, category, collection when applicable, related products, and inquiry actions.
- Include canonical URL behavior, share metadata requirements, and structured data support.

#### About Us

- Present brand story, positioning, and handcrafted identity using client-supplied facts only.

#### Our Craftsmanship

- Present process-oriented storytelling and craftsmanship details with client-approved content only.

#### Contact

- Display contact channels, contact form, location context if approved, and WhatsApp action.

#### Privacy Policy

- Present client-approved privacy content.

#### Terms and Conditions

- Present client-approved terms content.

#### 404

- Guide visitors back to useful catalogue paths and contact actions.

## Product Data Requirements

- Product fields must include the master-rule minimum data set.
- Products must belong to one category and may belong to zero or more collections depending on final data rules.
- Products must support editorial flags for featured, best-selling, and latest behavior.
- Product pages must preserve source context for inquiry capture when feasible.

## Catalogue Discovery Requirements

- Visitors must be able to browse by collections and by product taxonomy.
- Catalogue search must support keyword-based discovery.
- Filters must support the agreed launch attributes, at minimum category and collection where applicable.
- Empty states must offer recovery paths rather than dead ends.

## Inquiry Workflow Requirements

- Product inquiries must capture name, email, phone, optional WhatsApp number, subject, message, consent confirmation where required, and the originating product reference.
- General inquiries must capture source page and core contact details.
- Inquiry records must store status, notes, assigned user when applicable, and timestamps.
- Inquiry module must support search, filtering, status changes, reply tracking, archive behavior, and CSV export with spreadsheet-injection protection.

## WhatsApp Behavior Requirements

- WhatsApp actions must open a direct conversation link using an approved business number.
- Prefilled messages may include product name or page context but must remain editable by the visitor.
- WhatsApp links must not promise stock, pricing, or delivery facts unless the client has supplied them.

## CMS Functional Requirements

### Dashboard

- Summarize useful operational metrics and shortcuts relevant to catalogue and inquiry management.

### Products

- Create, edit, publish, unpublish, order, and feature products.

### Categories

- Manage taxonomy used for organization and filtering.

### Collections

- Manage curated product groups and their editorial context.

### Product galleries

- Attach and order multiple images per product.

### Media library

- Upload, organize, and reuse media assets within defined content policies.

### Homepage content

- Manage all homepage sections without code changes.

### Banners

- Manage hero and other promotional visual sections within approved site patterns.

### About page

- Manage About content blocks.

### Craftsmanship page

- Manage craftsmanship content blocks.

### Contact information

- Manage displayed contact channels and address or map references if approved.

### Inquiries

- Review, assign, note, reply-track, export, and archive inquiry records.

### SEO

- Manage metadata, canonical behavior, social previews, and indexing-relevant settings.

### Users and roles

- Manage CMS users according to permission policies.

### Settings

- Manage site-wide operational settings approved in later stages.

### Activity history where appropriate

- Provide audit visibility for sensitive administrative changes where the feature applies.

## Content Governance Requirements

- No fabricated testimonials, statistics, certifications, addresses, or legal claims may be published.
- Placeholder capability may exist in the CMS later, but public output must use only approved client content.
- Best-selling and latest labels must behave according to the locked scope clarifications.
