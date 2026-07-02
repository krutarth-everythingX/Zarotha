# Database Schema

## Schema Principles

- Use a normalized MySQL schema with typed columns for important business data.
- Keep the launch schema inquiry-based and catalogue-focused, with no ecommerce tables.
- Prefer explicit foreign keys and targeted join tables over generic catch-all JSON structures.
- Use soft deletes only where recovery or historical linkage is valuable.
- Keep driver-dependent infrastructure tables out of this schema stage when they depend on later deployment choices.

## Core Decisions

- Database engine target: MySQL 8.
- Default character set: `utf8mb4`.
- Default collation: `utf8mb4_0900_ai_ci`.
- Category model: flat taxonomy for launch.
- Product-to-category: single required category for launch.
- Product-to-collection: many-to-many with explicit ordering.
- SEO model: typed SEO columns on products, collections, pages, and site settings rather than one generic SEO table.
- Redirect model: path-based redirect history table for slug changes and manual redirects.
- Settings model: typed singleton tables, not generic key-value JSON for core site behavior.

## Justified Configuration Decisions

- No separate permissions table is added for launch because the approved direction is a simpler policy-backed role model.
- No `product_category` pivot table is added for launch because each product has one required category.
- No standalone SEO metadata table is added because typed SEO columns on content tables are clearer and more query-friendly for current scope.
- Footer behavior is modeled through `homepage_sections`, `contact_information`, `social_links`, and `site_settings` rather than a disconnected footer-only table.

## Column-Type Guidance

- Use `varchar` for short structured fields such as names, slugs, materials, finishes, labels, and status-adjacent metadata.
- Use `text` for medium editorial copy such as summaries, helper text, notes, and inquiry messages.
- Use `longtext` only where rich editorial or legal body content may exceed ordinary text lengths.
- Use booleans and enums for workflow and editorial flags instead of free-form strings.

## Sorting, Slugs, And Statuses

- Ordered public and editorial content uses explicit `sort_order` columns rather than inferred timestamps.
- Public route-bearing entities keep unique slugs within their own table and use the `redirects` table for old-path history.
- Publishable content uses `draft`, `published`, and `archived` states unless a narrower lifecycle is more appropriate.

## Driver-Dependent Tables Intentionally Deferred

- `sessions` table if database-backed sessions are chosen later.
- Queue driver tables such as `jobs`, `failed_jobs`, and `job_batches` if database queues are chosen later.
- Cache driver tables if database cache is chosen later.

## Table Inventory

| Table | Purpose | Data Owner | Expected Row Volume | Sensitive Classification |
| --- | --- | --- | --- | --- |
| `roles` | CMS role definitions | Engineering + Admin | Very low | Internal |
| `users` | CMS user accounts | Admin | Low | Restricted |
| `password_reset_tokens` | Password reset support | System | Low | Restricted |
| `categories` | Flat product taxonomy | Content team | Low | Internal |
| `collections` | Curated editorial groupings | Content team | Low | Internal |
| `products` | Catalogue product records | Content team | Medium | Internal |
| `collection_product` | Product membership in collections | Content team | Medium | Internal |
| `media_assets` | Central media library originals | Content team | Medium | Internal |
| `media_variants` | Generated media derivatives | System | Medium to high | Internal |
| `product_media` | Ordered gallery attachments per product | Content team | Medium | Internal |
| `hero_banners` | Homepage hero slides | Content team | Low | Internal |
| `homepage_sections` | Homepage section configuration | Content team | Very low | Internal |
| `homepage_featured_collection_items` | Manual homepage collection curation | Content team | Low | Internal |
| `homepage_featured_product_items` | Manual homepage product curation | Content team | Low | Internal |
| `why_choose_us_items` | Repeatable homepage differentiator items | Content team | Low | Internal |
| `pages` | About, Craftsmanship, Contact, Privacy, Terms pages | Content team | Very low | Internal |
| `craftsmanship_steps` | Ordered process steps | Content team | Low | Internal |
| `contact_information` | Approved public contact data | Admin + Content team | Very low | Restricted |
| `social_links` | Public social links | Content team | Very low | Internal |
| `site_settings` | Site-wide defaults and SEO defaults | Admin | Very low | Internal |
| `inquiries` | Public inquiry records | Sales or Inquiry owner | Medium to high | Restricted |
| `inquiry_activities` | Inquiry notes, assignments, status history | Sales or Inquiry owner | Medium to high | Restricted |
| `redirects` | Slug history and manual redirects | Admin + SEO owner | Low to medium | Internal |
| `activity_logs` | Sensitive admin activity history | Admin | Medium | Internal |

## Table Specifications

### `roles`

Owner: Admin  
Relationships: one role to many users  
Delete behavior: `RESTRICT` while users exist

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `slug` | `varchar(50)` | No | none | Unique role key |
| `name` | `varchar(100)` | No | none | Human-readable role name |
| `description` | `varchar(255)` | Yes | `NULL` | Optional admin note |
| `is_system` | `tinyint(1)` | No | `1` | Prevent accidental removal of system roles |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `slug`

### `users`

Owner: Admin  
Relationships: belongs to role; referenced by many authored records, inquiries, and logs  
Delete behavior: role `RESTRICT`; authored references generally `RESTRICT`; operational references may `SET NULL`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `role_id` | `bigint unsigned` | No | none | FK to `roles.id` |
| `name` | `varchar(120)` | No | none | Display name |
| `email` | `varchar(190)` | No | none | Unique login email |
| `email_verified_at` | `timestamp` | Yes | `NULL` | Optional verification timestamp |
| `password` | `varchar(255)` | No | none | Password hash |
| `is_active` | `tinyint(1)` | No | `1` | Soft disable without deletion |
| `last_login_at` | `timestamp` | Yes | `NULL` | Operational audit field |
| `remember_token` | `varchar(100)` | Yes | `NULL` | Standard auth token |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `email`
- Index on `role_id`
- Index on `is_active`

### `password_reset_tokens`

Owner: System  
Relationships: auth support table  
Delete behavior: independent

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `email` | `varchar(190)` | No | none | Primary lookup field |
| `token` | `varchar(255)` | No | none | Password reset token |
| `created_at` | `timestamp` | Yes | `NULL` | Token issue time |

Constraints and indexes:

- Primary key or unique index on `email`

### `categories`

Owner: Content team  
Relationships: one category to many products  
Delete behavior: `RESTRICT` while products exist

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `name` | `varchar(150)` | No | none | Category name |
| `slug` | `varchar(160)` | No | none | Unique category slug |
| `description` | `text` | Yes | `NULL` | Optional internal or future public description |
| `sort_order` | `int unsigned` | No | `0` | Admin ordering |
| `is_active` | `tinyint(1)` | No | `1` | Hide from filters without deletion |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `slug`
- Composite index on `is_active, sort_order, id`

### `collections`

Owner: Content team  
Relationships: many-to-many with products; references media and authorship users  
Delete behavior: media `RESTRICT`; author FKs `RESTRICT`; pivot rows `CASCADE` on hard delete; content recovery via soft delete

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `name` | `varchar(150)` | No | none | Collection name |
| `slug` | `varchar(160)` | No | none | Unique collection slug |
| `summary` | `varchar(255)` | No | none | Short public summary |
| `description` | `longtext` | Yes | `NULL` | Extended editorial content |
| `cover_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `status` | `enum('draft','published','archived')` | No | `'draft'` | Publication status |
| `sort_order` | `int unsigned` | No | `0` | Admin ordering |
| `published_at` | `timestamp` | Yes | `NULL` | Publication timestamp |
| `meta_title` | `varchar(255)` | Yes | `NULL` | Page-specific SEO |
| `meta_description` | `varchar(320)` | Yes | `NULL` | Page-specific SEO |
| `og_title` | `varchar(255)` | Yes | `NULL` | Social title override |
| `og_description` | `varchar(320)` | Yes | `NULL` | Social description override |
| `og_image_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `canonical_url` | `varchar(2048)` | Yes | `NULL` | Optional canonical override |
| `robots_index` | `tinyint(1)` | No | `1` | SEO index flag |
| `robots_follow` | `tinyint(1)` | No | `1` | SEO follow flag |
| `created_by_user_id` | `bigint unsigned` | No | none | FK to `users.id` |
| `updated_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `deleted_at` | `timestamp` | Yes | `NULL` | Soft delete |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `slug`
- Index on `status, published_at, sort_order, id`
- Index on `deleted_at`
- FK `cover_media_id` -> `media_assets.id` with `RESTRICT`
- FK `og_image_media_id` -> `media_assets.id` with `RESTRICT`
- FK `created_by_user_id` -> `users.id` with `RESTRICT`
- FK `updated_by_user_id` -> `users.id` with `RESTRICT`

### `products`

Owner: Content team  
Relationships: belongs to category; many-to-many with collections; references media and authorship users; referenced by inquiries  
Delete behavior: category `RESTRICT`; media `RESTRICT`; inquiry FK `SET NULL`; content recovery via soft delete

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `category_id` | `bigint unsigned` | No | none | FK to `categories.id` |
| `name` | `varchar(190)` | No | none | Product name |
| `slug` | `varchar(190)` | No | none | Unique product slug |
| `short_description` | `varchar(500)` | Yes | `NULL` | Card and summary content |
| `full_description` | `longtext` | Yes | `NULL` | Full product description |
| `dimensions` | `varchar(255)` | Yes | `NULL` | Structured as text for launch |
| `material` | `varchar(150)` | Yes | `NULL` | Material field |
| `finish` | `varchar(150)` | Yes | `NULL` | Finish field |
| `featured_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `status` | `enum('draft','published','archived')` | No | `'draft'` | Publication status |
| `published_at` | `timestamp` | Yes | `NULL` | Publication timestamp |
| `sort_order` | `int unsigned` | No | `0` | Admin ordering |
| `is_featured` | `tinyint(1)` | No | `0` | Homepage editorial flag |
| `is_best_selling` | `tinyint(1)` | No | `0` | Editorial best-selling flag |
| `is_latest` | `tinyint(1)` | No | `0` | Optional editorial latest flag |
| `meta_title` | `varchar(255)` | Yes | `NULL` | Page-specific SEO |
| `meta_description` | `varchar(320)` | Yes | `NULL` | Page-specific SEO |
| `og_title` | `varchar(255)` | Yes | `NULL` | Social title override |
| `og_description` | `varchar(320)` | Yes | `NULL` | Social description override |
| `og_image_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `canonical_url` | `varchar(2048)` | Yes | `NULL` | Optional canonical override |
| `robots_index` | `tinyint(1)` | No | `1` | SEO index flag |
| `robots_follow` | `tinyint(1)` | No | `1` | SEO follow flag |
| `created_by_user_id` | `bigint unsigned` | No | none | FK to `users.id` |
| `updated_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `deleted_at` | `timestamp` | Yes | `NULL` | Soft delete |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `slug`
- Composite index on `status, published_at, sort_order, id`
- Composite index on `category_id, status, published_at, id`
- Composite index on `is_featured, status, published_at, id`
- Composite index on `is_best_selling, status, published_at, id`
- Composite index on `is_latest, published_at, id`
- Full-text index on `name, short_description, full_description`
- Index on `deleted_at`
- FK `category_id` -> `categories.id` with `RESTRICT`
- FK `featured_media_id` -> `media_assets.id` with `RESTRICT`
- FK `og_image_media_id` -> `media_assets.id` with `RESTRICT`
- FK `created_by_user_id` -> `users.id` with `RESTRICT`
- FK `updated_by_user_id` -> `users.id` with `RESTRICT`

### `collection_product`

Owner: Content team  
Relationships: bridge table between collections and products  
Delete behavior: `CASCADE` on hard delete of parent records

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `collection_id` | `bigint unsigned` | No | none | FK to `collections.id` |
| `product_id` | `bigint unsigned` | No | none | FK to `products.id` |
| `sort_order` | `int unsigned` | No | `0` | Per-collection product ordering |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Composite primary key or unique index on `collection_id, product_id`
- Composite index on `collection_id, sort_order, product_id`
- Index on `product_id, collection_id`
- FK `collection_id` -> `collections.id` with `CASCADE`
- FK `product_id` -> `products.id` with `CASCADE`

### `media_assets`

Owner: Content team  
Relationships: referenced by products, collections, pages, banners, settings, and product galleries  
Delete behavior: hard delete `RESTRICT` while referenced; recovery via soft delete

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `disk` | `varchar(50)` | No | none | Logical storage disk name |
| `directory` | `varchar(255)` | Yes | `NULL` | Stored directory path |
| `filename` | `varchar(255)` | No | none | Generated stored filename |
| `original_filename` | `varchar(255)` | No | none | User-facing original filename |
| `mime_type` | `varchar(100)` | No | none | MIME type |
| `extension` | `varchar(20)` | No | none | File extension |
| `bytes` | `bigint unsigned` | No | none | File size |
| `width` | `int unsigned` | Yes | `NULL` | Pixel width if image |
| `height` | `int unsigned` | Yes | `NULL` | Pixel height if image |
| `alt_text` | `varchar(255)` | Yes | `NULL` | Default alt text |
| `caption` | `varchar(255)` | Yes | `NULL` | Optional caption |
| `credit` | `varchar(255)` | Yes | `NULL` | Optional credit |
| `sha256` | `char(64)` | Yes | `NULL` | Optional dedupe hash |
| `status` | `enum('uploaded','processed','failed','archived')` | No | `'uploaded'` | Processing state |
| `visibility` | `enum('public','private')` | No | `'public'` | Storage visibility intent |
| `created_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `updated_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `deleted_at` | `timestamp` | Yes | `NULL` | Soft delete |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `sha256`
- Index on `status, created_at, id`
- Index on `created_by_user_id`
- Index on `deleted_at`
- FK `created_by_user_id` -> `users.id` with `SET NULL`
- FK `updated_by_user_id` -> `users.id` with `SET NULL`

### `media_variants`

Owner: System  
Relationships: many variants belong to one media asset  
Delete behavior: `CASCADE` when parent asset is hard deleted

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `media_asset_id` | `bigint unsigned` | No | none | FK to `media_assets.id` |
| `variant_key` | `varchar(50)` | No | none | Example: `thumb`, `card`, `large-webp` |
| `format` | `varchar(20)` | No | none | Output format |
| `path` | `varchar(255)` | No | none | Derived file path |
| `width` | `int unsigned` | Yes | `NULL` | Output width |
| `height` | `int unsigned` | Yes | `NULL` | Output height |
| `bytes` | `bigint unsigned` | Yes | `NULL` | Output size |
| `is_primary` | `tinyint(1)` | No | `0` | Marks canonical derived asset if needed |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `media_asset_id, variant_key`
- Index on `media_asset_id, is_primary`
- FK `media_asset_id` -> `media_assets.id` with `CASCADE`

### `product_media`

Owner: Content team  
Relationships: bridge table between products and media assets  
Delete behavior: product `CASCADE`; media `RESTRICT`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `product_id` | `bigint unsigned` | No | none | FK to `products.id` |
| `media_asset_id` | `bigint unsigned` | No | none | FK to `media_assets.id` |
| `sort_order` | `int unsigned` | No | `0` | Ordered gallery position |
| `alt_text_override` | `varchar(255)` | Yes | `NULL` | Product-specific alt text override |
| `is_gallery_visible` | `tinyint(1)` | No | `1` | Hide without detach if needed |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `product_id, media_asset_id`
- Composite index on `product_id, sort_order, id`
- FK `product_id` -> `products.id` with `CASCADE`
- FK `media_asset_id` -> `media_assets.id` with `RESTRICT`

### `hero_banners`

Owner: Content team  
Relationships: references media and optional authorship users  
Delete behavior: media `RESTRICT`; authorship users `RESTRICT`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `eyebrow` | `varchar(100)` | Yes | `NULL` | Optional small label |
| `headline` | `varchar(255)` | No | none | Hero headline |
| `body_text` | `text` | Yes | `NULL` | Supporting copy |
| `primary_cta_label` | `varchar(80)` | Yes | `NULL` | CTA label |
| `primary_cta_url` | `varchar(2048)` | Yes | `NULL` | CTA target |
| `secondary_cta_label` | `varchar(80)` | Yes | `NULL` | Optional secondary CTA |
| `secondary_cta_url` | `varchar(2048)` | Yes | `NULL` | Optional secondary target |
| `desktop_media_id` | `bigint unsigned` | No | none | FK to `media_assets.id` |
| `mobile_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `sort_order` | `int unsigned` | No | `0` | Slide ordering |
| `is_active` | `tinyint(1)` | No | `1` | Visibility control |
| `starts_at` | `timestamp` | Yes | `NULL` | Optional scheduled activation |
| `ends_at` | `timestamp` | Yes | `NULL` | Optional scheduled deactivation |
| `created_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `updated_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Composite index on `is_active, sort_order, starts_at, ends_at`
- FK `desktop_media_id` -> `media_assets.id` with `RESTRICT`
- FK `mobile_media_id` -> `media_assets.id` with `RESTRICT`
- FK `created_by_user_id` -> `users.id` with `SET NULL`
- FK `updated_by_user_id` -> `users.id` with `SET NULL`

### `homepage_sections`

Owner: Content team  
Relationships: may reference background media; parents manual curation item tables  
Delete behavior: background media `SET NULL`; child manual curation rows `CASCADE`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `section_key` | `enum('hero','featured_collections','best_selling_products','about','why_choose_us','craftsmanship_process','latest_products','inquiry_cta','footer','optional_social_gallery')` | No | none | Unique homepage section identity |
| `section_title` | `varchar(255)` | Yes | `NULL` | Optional heading |
| `section_intro` | `text` | Yes | `NULL` | Optional intro copy |
| `cta_label` | `varchar(80)` | Yes | `NULL` | Section CTA label |
| `cta_url` | `varchar(2048)` | Yes | `NULL` | Section CTA target |
| `source_mode` | `enum('manual','editorial_flag','publish_date','disabled')` | No | `'manual'` | Population mode |
| `background_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `mobile_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `max_items` | `tinyint unsigned` | Yes | `NULL` | Manual or rule-based cap |
| `sort_order` | `int unsigned` | No | `0` | Page-level ordering |
| `is_visible` | `tinyint(1)` | No | `1` | Hide empty or deferred sections |
| `created_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `updated_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `section_key`
- Composite index on `is_visible, sort_order`
- FK `background_media_id` -> `media_assets.id` with `SET NULL`
- FK `mobile_media_id` -> `media_assets.id` with `SET NULL`
- FK `created_by_user_id` -> `users.id` with `SET NULL`
- FK `updated_by_user_id` -> `users.id` with `SET NULL`

### `homepage_featured_collection_items`

Owner: Content team  
Relationships: belongs to a homepage section and a collection  
Delete behavior: `CASCADE` from homepage section; `CASCADE` from collection on hard delete

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `homepage_section_id` | `bigint unsigned` | No | none | FK to `homepage_sections.id` |
| `collection_id` | `bigint unsigned` | No | none | FK to `collections.id` |
| `sort_order` | `int unsigned` | No | `0` | Manual ordering |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `homepage_section_id, collection_id`
- Composite index on `homepage_section_id, sort_order, collection_id`
- FK `homepage_section_id` -> `homepage_sections.id` with `CASCADE`
- FK `collection_id` -> `collections.id` with `CASCADE`

### `homepage_featured_product_items`

Owner: Content team  
Relationships: belongs to a homepage section and a product  
Delete behavior: `CASCADE` from homepage section; `CASCADE` from product on hard delete

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `homepage_section_id` | `bigint unsigned` | No | none | FK to `homepage_sections.id` |
| `product_id` | `bigint unsigned` | No | none | FK to `products.id` |
| `sort_order` | `int unsigned` | No | `0` | Manual ordering |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `homepage_section_id, product_id`
- Composite index on `homepage_section_id, sort_order, product_id`
- FK `homepage_section_id` -> `homepage_sections.id` with `CASCADE`
- FK `product_id` -> `products.id` with `CASCADE`

### `why_choose_us_items`

Owner: Content team  
Relationships: belongs to the homepage why-choose-us section; may reference icon media  
Delete behavior: section `CASCADE`; icon media `SET NULL`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `homepage_section_id` | `bigint unsigned` | No | none | FK to `homepage_sections.id` |
| `heading` | `varchar(150)` | No | none | Item title |
| `body_text` | `text` | No | none | Item description |
| `icon_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `sort_order` | `int unsigned` | No | `0` | Display order |
| `is_active` | `tinyint(1)` | No | `1` | Visibility flag |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Composite index on `homepage_section_id, is_active, sort_order, id`
- FK `homepage_section_id` -> `homepage_sections.id` with `CASCADE`
- FK `icon_media_id` -> `media_assets.id` with `SET NULL`

### `pages`

Owner: Content team  
Relationships: may reference media and authorship users; parent of craftsmanship steps  
Delete behavior: media `SET NULL` or `RESTRICT` as noted; craftsmanship steps `RESTRICT`; no soft delete because page keys are fixed

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `page_key` | `enum('about_us','our_craftsmanship','contact','privacy_policy','terms_and_conditions')` | No | none | Fixed logical page identity |
| `slug` | `varchar(190)` | No | none | Unique route slug |
| `navigation_label` | `varchar(100)` | Yes | `NULL` | Optional label override |
| `title` | `varchar(255)` | No | none | Page title |
| `intro_title` | `varchar(255)` | Yes | `NULL` | Optional intro heading |
| `intro_body` | `text` | Yes | `NULL` | Optional intro copy |
| `body_html` | `longtext` | Yes | `NULL` | Rich text body where allowed |
| `hero_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `cta_label` | `varchar(80)` | Yes | `NULL` | Optional CTA label |
| `cta_url` | `varchar(2048)` | Yes | `NULL` | Optional CTA target |
| `effective_date` | `date` | Yes | `NULL` | For legal pages |
| `status` | `enum('draft','published','archived')` | No | `'draft'` | Publication status |
| `published_at` | `timestamp` | Yes | `NULL` | Publication timestamp |
| `meta_title` | `varchar(255)` | Yes | `NULL` | Page-specific SEO |
| `meta_description` | `varchar(320)` | Yes | `NULL` | Page-specific SEO |
| `og_title` | `varchar(255)` | Yes | `NULL` | Social title override |
| `og_description` | `varchar(320)` | Yes | `NULL` | Social description override |
| `og_image_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `canonical_url` | `varchar(2048)` | Yes | `NULL` | Optional canonical override |
| `robots_index` | `tinyint(1)` | No | `1` | SEO index flag |
| `robots_follow` | `tinyint(1)` | No | `1` | SEO follow flag |
| `created_by_user_id` | `bigint unsigned` | No | none | FK to `users.id` |
| `updated_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `page_key`
- Unique index on `slug`
- Composite index on `status, published_at, id`
- FK `hero_media_id` -> `media_assets.id` with `SET NULL`
- FK `og_image_media_id` -> `media_assets.id` with `SET NULL`
- FK `created_by_user_id` -> `users.id` with `RESTRICT`
- FK `updated_by_user_id` -> `users.id` with `RESTRICT`

### `craftsmanship_steps`

Owner: Content team  
Relationships: belongs to the craftsmanship page; may reference media  
Delete behavior: page `RESTRICT`; media `SET NULL`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `page_id` | `bigint unsigned` | No | none | FK to `pages.id` |
| `title` | `varchar(150)` | No | none | Step heading |
| `body_text` | `text` | No | none | Step description |
| `media_asset_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `sort_order` | `int unsigned` | No | `0` | Display order |
| `is_active` | `tinyint(1)` | No | `1` | Visibility flag |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Composite index on `page_id, is_active, sort_order, id`
- FK `page_id` -> `pages.id` with `RESTRICT`
- FK `media_asset_id` -> `media_assets.id` with `SET NULL`

### `contact_information`

Owner: Admin + Content team  
Relationships: singleton content table; optional updater user reference  
Delete behavior: updater user `SET NULL`; no child tables

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key, one-row table in launch use |
| `business_name` | `varchar(150)` | Yes | `NULL` | Approved public name |
| `phone_primary` | `varchar(50)` | Yes | `NULL` | Public phone |
| `phone_secondary` | `varchar(50)` | Yes | `NULL` | Optional additional phone |
| `email_primary` | `varchar(190)` | Yes | `NULL` | Public email |
| `email_secondary` | `varchar(190)` | Yes | `NULL` | Optional additional email |
| `whatsapp_number` | `varchar(50)` | Yes | `NULL` | Approved WhatsApp number |
| `address_line_1` | `varchar(255)` | Yes | `NULL` | Optional approved address |
| `address_line_2` | `varchar(255)` | Yes | `NULL` | Optional approved address |
| `city` | `varchar(100)` | Yes | `NULL` | Optional approved address |
| `state` | `varchar(100)` | Yes | `NULL` | Optional approved address |
| `postal_code` | `varchar(20)` | Yes | `NULL` | Optional approved address |
| `country` | `varchar(100)` | Yes | `NULL` | Optional approved address |
| `show_address` | `tinyint(1)` | No | `0` | Address visibility flag |
| `show_phone` | `tinyint(1)` | No | `1` | Channel visibility flag |
| `show_email` | `tinyint(1)` | No | `1` | Channel visibility flag |
| `show_whatsapp` | `tinyint(1)` | No | `1` | Channel visibility flag |
| `contact_intro` | `text` | Yes | `NULL` | Contact page intro |
| `form_helper_text` | `text` | Yes | `NULL` | Form helper copy |
| `success_message` | `text` | Yes | `NULL` | Confirmation copy |
| `consent_text` | `text` | Yes | `NULL` | Consent language if required |
| `updated_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- FK `updated_by_user_id` -> `users.id` with `SET NULL`

### `social_links`

Owner: Content team  
Relationships: independent content rows  
Delete behavior: independent

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `platform_key` | `varchar(50)` | No | none | Approved platform identifier |
| `label` | `varchar(100)` | Yes | `NULL` | Optional display label |
| `url` | `varchar(2048)` | No | none | Public URL |
| `sort_order` | `int unsigned` | No | `0` | Display order |
| `is_active` | `tinyint(1)` | No | `1` | Visibility control |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `platform_key`
- Composite index on `is_active, sort_order, id`

### `site_settings`

Owner: Admin  
Relationships: singleton settings table; optional SEO image and updater references  
Delete behavior: media `SET NULL`; updater user `SET NULL`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key, one-row table in launch use |
| `site_name` | `varchar(150)` | No | none | Site name |
| `default_meta_title` | `varchar(255)` | Yes | `NULL` | Fallback SEO title |
| `default_meta_description` | `varchar(320)` | Yes | `NULL` | Fallback SEO description |
| `default_og_image_media_id` | `bigint unsigned` | Yes | `NULL` | FK to `media_assets.id` |
| `default_robots_index` | `tinyint(1)` | No | `1` | Global index default |
| `default_robots_follow` | `tinyint(1)` | No | `1` | Global follow default |
| `updated_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- FK `default_og_image_media_id` -> `media_assets.id` with `SET NULL`
- FK `updated_by_user_id` -> `users.id` with `SET NULL`

### `inquiries`

Owner: Inquiry owner  
Relationships: optional product reference; optional assigned user; parent of inquiry activities  
Delete behavior: product `SET NULL`; assigned user `SET NULL`; no soft delete because archival is status-based and retention-driven

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `product_id` | `bigint unsigned` | Yes | `NULL` | FK to `products.id` |
| `assigned_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `status` | `enum('unread','read','replied','archived')` | No | `'unread'` | Workflow state |
| `source_page_key` | `varchar(50)` | Yes | `NULL` | Origin page identifier |
| `source_url` | `varchar(2048)` | Yes | `NULL` | Origin URL |
| `name` | `varchar(150)` | No | none | Sender name |
| `email` | `varchar(190)` | No | none | Sender email |
| `phone` | `varchar(50)` | No | none | Sender phone |
| `whatsapp_number` | `varchar(50)` | Yes | `NULL` | Optional sender WhatsApp |
| `subject` | `varchar(255)` | Yes | `NULL` | Optional subject |
| `message` | `text` | No | none | Inquiry body |
| `consent_confirmed` | `tinyint(1)` | No | `0` | Consent flag |
| `referrer_url` | `varchar(2048)` | Yes | `NULL` | Optional referrer |
| `utm_source` | `varchar(100)` | Yes | `NULL` | Optional campaign field |
| `utm_medium` | `varchar(100)` | Yes | `NULL` | Optional campaign field |
| `utm_campaign` | `varchar(150)` | Yes | `NULL` | Optional campaign field |
| `utm_term` | `varchar(150)` | Yes | `NULL` | Optional campaign field |
| `utm_content` | `varchar(150)` | Yes | `NULL` | Optional campaign field |
| `ip_hash` | `char(64)` | Yes | `NULL` | Privacy-safer abuse metadata |
| `user_agent` | `varchar(255)` | Yes | `NULL` | Optional abuse or troubleshooting metadata |
| `last_replied_at` | `timestamp` | Yes | `NULL` | Operational reply field |
| `archived_at` | `timestamp` | Yes | `NULL` | Archive timestamp |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Composite index on `status, created_at, id`
- Composite index on `assigned_user_id, status, created_at, id`
- Index on `product_id, created_at`
- Index on `email, created_at`
- Index on `source_page_key, created_at`
- FK `product_id` -> `products.id` with `SET NULL`
- FK `assigned_user_id` -> `users.id` with `SET NULL`

### `inquiry_activities`

Owner: Inquiry owner  
Relationships: many activities belong to one inquiry; optional actor user references  
Delete behavior: inquiry `CASCADE`; actor and assignment user references `SET NULL`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `inquiry_id` | `bigint unsigned` | No | none | FK to `inquiries.id` |
| `actor_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `activity_type` | `enum('created','note_added','status_changed','assigned','replied','exported','archived','restored')` | No | none | Activity classification |
| `note_body` | `text` | Yes | `NULL` | Optional note content |
| `old_status` | `varchar(20)` | Yes | `NULL` | Optional previous status |
| `new_status` | `varchar(20)` | Yes | `NULL` | Optional new status |
| `old_assigned_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `new_assigned_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `created_at` | `timestamp` | Yes | `NULL` | Event timestamp |

Constraints and indexes:

- Primary key on `id`
- Composite index on `inquiry_id, created_at, id`
- Index on `activity_type, created_at`
- FK `inquiry_id` -> `inquiries.id` with `CASCADE`
- FK `actor_user_id` -> `users.id` with `SET NULL`
- FK `old_assigned_user_id` -> `users.id` with `SET NULL`
- FK `new_assigned_user_id` -> `users.id` with `SET NULL`

### `redirects`

Owner: Admin + SEO owner  
Relationships: path-level infrastructure table; optional creator user reference  
Delete behavior: creator user `SET NULL`; no FK to target entities because redirect targets are path-based and may span multiple route types

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `source_path` | `varchar(2048)` | No | none | Unique old path |
| `target_path` | `varchar(2048)` | No | none | Redirect destination path |
| `redirect_type` | `enum('slug_history','manual')` | No | `'slug_history'` | Redirect origin |
| `source_entity_type` | `enum('product','collection','page','category','custom')` | Yes | `NULL` | Logical source type |
| `source_entity_id` | `bigint unsigned` | Yes | `NULL` | Related entity id when relevant |
| `http_status` | `smallint unsigned` | No | `301` | Redirect status |
| `is_active` | `tinyint(1)` | No | `1` | Toggle without deletion |
| `created_by_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `created_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |
| `updated_at` | `timestamp` | Yes | `NULL` | Laravel timestamp |

Constraints and indexes:

- Primary key on `id`
- Unique index on `source_path`
- Composite index on `is_active, http_status`
- Index on `source_entity_type, source_entity_id`
- FK `created_by_user_id` -> `users.id` with `SET NULL`

### `activity_logs`

Owner: Admin  
Relationships: optional actor reference; generic subject reference for audit context  
Delete behavior: actor user `SET NULL`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `bigint unsigned` | No | auto increment | Primary key |
| `actor_user_id` | `bigint unsigned` | Yes | `NULL` | FK to `users.id` |
| `subject_type` | `varchar(50)` | No | none | Audited resource type |
| `subject_id` | `bigint unsigned` | Yes | `NULL` | Audited resource id |
| `action` | `varchar(50)` | No | none | Action key |
| `summary` | `varchar(255)` | Yes | `NULL` | Human-readable summary |
| `ip_hash` | `char(64)` | Yes | `NULL` | Optional privacy-safer origin metadata |
| `created_at` | `timestamp` | Yes | `NULL` | Event timestamp |

Constraints and indexes:

- Primary key on `id`
- Composite index on `subject_type, subject_id, created_at`
- Composite index on `actor_user_id, created_at`
- Index on `action, created_at`
- FK `actor_user_id` -> `users.id` with `SET NULL`

## Ownership And Delete Rules Summary

- Lookup and auth entities such as roles and categories should prefer deactivation or restricted deletion.
- Recoverable editorial entities such as products, collections, and media assets use soft deletes.
- Fixed-route pages use publish status rather than soft deletes.
- Inquiries are retained through status workflow and retention policy, not soft delete.
- Redirects remain path-based so old URLs can survive content changes.
