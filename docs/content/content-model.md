# Content Model

## Model Principles

- Public content must be factual, approved, and CMS-manageable where editorial updates are expected.
- System structure should separate reusable content records from fixed route templates.
- Collections and categories must remain semantically distinct.
- Optional Instagram and Google Maps items are excluded from implementation scope unless approved later.

## Core Content Entities

### Product

- Purpose: primary catalogue item and inquiry anchor.
- Content type: structured CMS record.
- Key fields: name, slug, category, collections, short description, full description, featured image, gallery images, dimensions, material, finish, meta title, meta description, Open Graph image when needed, status, sort order, featured flag, best-selling flag, latest flag or publish date, canonical URL behavior, created by, updated by, published at.
- Reusable: yes, across homepage, collection, related-product, and products index surfaces.

### Category

- Purpose: taxonomy used for classification and filtering.
- Content type: structured CMS taxonomy record.
- Key fields: name, slug, description if needed later, sort order, status.
- Reusable: yes, across product organization and filters.

### Collection

- Purpose: curated product grouping with editorial meaning.
- Content type: structured CMS record.
- Key fields: name, slug, summary, optional extended description, cover image, SEO fields, status, sort order, associated products.
- Reusable: yes, across homepage, collections index, and collection detail pages.

### Inquiry

- Purpose: store product-linked or general lead submissions.
- Content type: structured CMS record.
- Key fields: name, email, phone, WhatsApp when provided, subject, message, product reference when applicable, source page, UTM or referrer data when safely available, consent confirmation where required, status, notes, assigned user, timestamps.
- Reusable: operational record only, not public content.

### Static Page Content

- Purpose: manage About Us, Our Craftsmanship, Contact, Privacy Policy, and Terms and Conditions route content.
- Content type: page-specific CMS-managed content records.
- Reusable: limited; mostly page-specific.

### Site Settings

- Purpose: hold global contact details, social links if approved, and default SEO or operational values defined in later stages.
- Content type: global settings record.
- Reusable: yes, across header, footer, contact page, and conversion surfaces.

## Category Versus Collection Responsibility

- Category answers: what type of product is this.
- Collection answers: what curated story, style, or grouping does this product belong to.
- Categories should drive filters.
- Collections should drive editorial storytelling and secondary discovery.

## Homepage Content Model

| Section | Content Type | Structured CMS Record | Reorderable | Hideable | Globally Reusable | Page-Specific | Media-Dependent | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hero slider or banner | Homepage section | Yes | Yes | Yes | No | Yes | Yes | Supports one or more slides if final design keeps performance under control |
| Featured collections | Homepage section linked to collections | Yes | Yes | Yes | No | Yes | Yes | Pulls from curated collection selections |
| Best-selling products | Homepage section linked to products or editorial rule | Yes | Yes | Yes | No | Yes | Yes | Editorial flag-based unless sales data exists later |
| About section | Homepage section | Yes | Yes | Yes | No | Yes | Optional | Uses concise approved brand summary |
| Why choose us | Homepage section | Yes | Yes | Yes | No | Yes | Optional | Structured short points preferred |
| Craftsmanship process | Homepage section | Yes | Yes | Yes | No | Yes | Optional | May link to Our Craftsmanship |
| Latest products | Homepage section linked to products or publish-date rule | Yes | Yes | Yes | No | Yes | Yes | Uses publish date and or editorial flag |
| Inquiry CTA | Homepage section | Yes | Yes | Yes | No | Yes | Optional | Should connect to Contact or inquiry path |
| Optional social or gallery section | Homepage section | Yes | Yes | Yes | No | Yes | Yes | Excluded from implementation unless later approved |
| Footer content | Global settings plus footer record | Yes | Limited | Limited | Yes | No | Optional | Includes legal and contact info |
| Contact details | Global settings | Yes | No | Conditional | Yes | No | No | Requires approved business details |
| Social links | Global settings | Yes | Limited | Yes | Yes | No | No | Only approved platforms should appear |

## Homepage Editable Field Guidance

### Hero slider or banner

- Fields: eyebrow or label, headline, supporting copy, primary CTA label, primary CTA target, secondary CTA label if used, secondary CTA target if used, desktop image, mobile image if required later, sort order, visibility flag.

### Featured collections

- Fields: section heading, optional intro copy, selected collections, manual ordering, visibility flag.

### Best-selling products

- Fields: section heading, optional intro copy, source mode, selected products if manually curated, visibility flag.

### About section

- Fields: section heading, short body copy, optional CTA label, CTA target, optional image, visibility flag.

### Why choose us

- Fields: section heading, optional intro, structured point items with title and short description, optional icons if later approved, visibility flag.

### Craftsmanship process

- Fields: section heading, optional intro, process items with title and short description, optional CTA to craftsmanship page, optional media, visibility flag.

### Latest products

- Fields: section heading, optional intro copy, source mode, selected products if manually curated, visibility flag.

### Inquiry CTA

- Fields: heading, supporting copy, primary CTA label, primary CTA target, secondary CTA label if used, secondary CTA target if used, optional background media, visibility flag.

### Optional social or gallery section

- Fields: section heading, source label, gallery items or approved external source reference, visibility flag.
- Rule: keep hidden unless explicitly approved in a later stage.

### Footer content

- Fields: footer summary copy, legal links, contact references, social links, optional copyright notice text.

## Page-Specific Content Models

### About Us

- Content blocks: hero or intro block, story sections, values or differentiators, CTA block.

### Our Craftsmanship

- Content blocks: intro block, process sections, material or quality notes if supplied, CTA block.

### Contact

- Content blocks: intro copy, contact channels, form helper copy, consent references, optional address block if approved later.

### Privacy Policy And Terms

- Content blocks: title, effective date, rich text body, SEO fields, publish status.

## Content Fallback Rules

- If optional section content is missing, hide the section.
- If required approved business content is missing, keep the related page unpublished or structurally present but not publicly launched, depending on later publication rules.
- Do not use public placeholder copy for missing business facts.
