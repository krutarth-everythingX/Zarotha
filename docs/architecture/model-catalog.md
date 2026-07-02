# Model Catalog

## Purpose

This catalog maps each domain model to its storage shape, main relationships, lifecycle rules, and notable constraints.

## Core Models

| Model | Table | Purpose | Key Relationships | Status Or Lifecycle | Soft Delete |
| --- | --- | --- | --- | --- | --- |
| Role | `roles` | CMS role definition | One role to many users | System-managed lookup | No |
| User | `users` | CMS account | Belongs to role; references authored content | Active or inactive | No |
| Category | `categories` | Flat taxonomy | One category to many products | Active or inactive | No |
| Collection | `collections` | Curated editorial grouping | Many-to-many with products | Draft, published, archived | Yes |
| Product | `products` | Core catalogue item | Belongs to category; many-to-many with collections; many gallery media | Draft, published, archived | Yes |
| Media Asset | `media_assets` | Original uploaded media | Has many variants; referenced widely | Uploaded, processed, failed, archived | Yes |
| Media Variant | `media_variants` | Derived asset variant | Belongs to media asset | Generated operational record | No |
| Hero Banner | `hero_banners` | Homepage hero slide | References desktop and mobile media | Active or inactive, optionally scheduled | No |
| Homepage Section | `homepage_sections` | Homepage section configuration | Parents manual curation and why-choose-us items | Visible or hidden | No |
| Page | `pages` | Fixed static route content | Has many craftsmanship steps | Draft, published, archived | No |
| Craftsmanship Step | `craftsmanship_steps` | Ordered process step | Belongs to page | Active or inactive | No |
| Contact Information | `contact_information` | Public contact content | Singleton record | Updated in place | No |
| Social Link | `social_links` | Public social profile | Independent rows | Active or inactive | No |
| Site Setting | `site_settings` | SEO defaults and site-wide settings | Singleton record | Updated in place | No |
| Inquiry | `inquiries` | Lead record from public site | Optional product; many activities | Unread, read, replied, archived | No |
| Inquiry Activity | `inquiry_activities` | Note and workflow history | Belongs to inquiry | Append-only audit trail | No |
| Redirect | `redirects` | Old-to-new path mapping | Optional creator user | Active or inactive | No |
| Activity Log | `activity_logs` | Sensitive admin activity history | Optional actor user | Append-only audit trail | No |

## Model Invariants

### Product

- Must belong to exactly one category at launch.
- May belong to zero or more collections.
- Must have a unique slug.
- Featured image is optional in schema but required for launch publication by application rules.

### Collection

- Slug is unique within collections.
- Product ordering is stored in the pivot, not inferred from product sort order.

### Media

- One uploaded original may be reused across many content records.
- Variants belong to one media asset.
- Product galleries use ordered join rows, not unordered file lists.

### Homepage Content

- Section identity is fixed by `section_key`.
- Manual featured lists are stored in dedicated item tables.
- Why-choose-us repeatables are stored separately from the parent section record.

### Static Pages

- Fixed routes are represented by a stable `page_key`.
- Legal pages share the same base table but keep typed fields such as `effective_date`.

### Inquiry

- Product linkage is optional because general contact inquiries are allowed.
- Status changes and notes belong in `inquiry_activities`, not overloaded columns on `inquiries`.
- Archival is a status and timestamp, not deletion.

## Models Intentionally Not Added

- No ecommerce tables for carts, orders, payments, shipments, customers, or inventory.
- No product-variants table in launch scope.
- No public user account tables.
- No generic permissions table because launch can use policy-backed roles without a full RBAC matrix.
