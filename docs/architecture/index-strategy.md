# Index Strategy

## Goals

- Keep public catalogue and detail queries fast.
- Support admin filtering and inquiry operations.
- Support slug lookups, sitemap generation, and redirect resolution.
- Avoid over-indexing low-volume tables without query value.

## Product Indexes

- Unique index on `slug` for direct product routing.
- Composite index on `status, published_at, sort_order, id` for public listing and sitemap scans.
- Composite index on `category_id, status, published_at, id` for filtered product listings.
- Composite index on `is_featured, status, published_at, id` for homepage featured queries.
- Composite index on `is_best_selling, status, published_at, id` for editorial best-selling queries.
- Composite index on `is_latest, published_at, id` for latest-product queries.
- Full-text index on `name, short_description, full_description` for launch search.
- Index on `deleted_at` for soft-delete-aware admin queries.

## Collection Indexes

- Unique index on `slug` for detail routing.
- Composite index on `status, published_at, sort_order, id` for public lists.
- Index on `deleted_at` for soft-delete-aware admin queries.
- `collection_product` index on `collection_id, sort_order, product_id` for ordered collection display.

## Category Indexes

- Unique index on `slug`.
- Composite index on `is_active, sort_order, id` for admin and filter presentation.

## Page And SEO-Relevant Indexes

- Unique index on `pages.page_key`.
- Unique index on `pages.slug`.
- Composite index on `pages.status, published_at, id` for sitemap and navigation inclusion.
- Unique index on `redirects.source_path` for instant redirect resolution.
- Composite index on `redirects.is_active, http_status` for admin filtering and live checks.

## Media Indexes

- Unique index on `media_assets.sha256` for dedupe support.
- Composite index on `media_assets.status, created_at, id` for library operations.
- Unique index on `media_variants.media_asset_id, variant_key` for deterministic variant lookup.
- `product_media` index on `product_id, sort_order, id` for ordered gallery retrieval.

## Homepage Content Indexes

- Unique index on `homepage_sections.section_key`.
- Composite index on `homepage_sections.is_visible, sort_order`.
- `homepage_featured_collection_items` and `homepage_featured_product_items` indexes on parent section plus sort order.
- `why_choose_us_items` index on `homepage_section_id, is_active, sort_order, id`.
- `hero_banners` composite index on `is_active, sort_order, starts_at, ends_at`.

## Inquiry And Audit Indexes

- `inquiries` composite index on `status, created_at, id` for inbox-style views.
- `inquiries` composite index on `assigned_user_id, status, created_at, id` for assigned workflow views.
- `inquiries` index on `product_id, created_at` for product-linked support review.
- `inquiries` index on `email, created_at` for repeat-contact lookup.
- `inquiries` index on `source_page_key, created_at` for origin analysis.
- `inquiry_activities` composite index on `inquiry_id, created_at, id` for timeline rendering.
- `activity_logs` composite index on `subject_type, subject_id, created_at` for audit history lookup.

## Index Trade-Off Notes

- Full-text product search is appropriate for launch because search remains database-backed.
- No separate index is added for every boolean field in every table; only query-driving flags are indexed.
- Very low-volume singleton-style tables rely mostly on primary keys because additional indexes add little value.
