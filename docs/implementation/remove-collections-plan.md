# Remove Collections Implementation Plan

## Scope Change

Collections are removed from the launch scope. Categories remain the only active product grouping and filtering mechanism. Products must not be deleted or weakened while removing collection-specific behavior.

## Database Handling

- The current `.env` is local (`APP_ENV=local`) and points to the local MySQL database `zarokha_website`.
- The project has not been approved as deployed against a shared production database in the available project docs.
- The final intended schema is still represented by pre-release foundation migrations, so Collection tables are removed from those migrations rather than using a destructive production data migration.

## Collection Locations Found

- Documentation: project progress, architecture database/ERD/model/routes/controller/authorization/form-request/contracts/search/SEO/performance/testing docs, UX sitemap/navigation/page specs/component inventory/text wireframes, discovery/content docs.
- Database migrations: `collections`, `collection_product`, and `homepage_featured_collection_items`.
- Models and relationships: `Collection`, `HomepageFeaturedCollectionItem`, `Product::collections()`, and `HomepageSection::featuredCollections()`.
- Policies: `CollectionPolicy`.
- Form Requests: `app/Http/Requests/Admin/Collection/*` and product `collection_ids` validation.
- Controllers: `Admin\CollectionController` and collection synchronization in `Admin\ProductController`.
- Routes: `admin.collections.*`.
- Factories and seeders: `CollectionFactory`, `HomepageFeaturedCollectionItemFactory`.
- Tests: Stage 9 Collection product-sync and reorder assertions.
- TypeScript/Inertia: `Admin/Collections/*`, product `collectionIds`, `collections` props, admin contract references.
- Navigation: admin sidebar Collection links and public planning docs.
- Public pages: planned `/collections` and `/collections/{slug}` pages are removed; no existing public routes currently expose them.
- Search/filtering/SEO: collection filters, collection sitemap entries, collection metadata, and redirect entity type values.
- Media references: media deletion checked `collections.cover_media_id` and `collections.og_image_media_id`.

## Implementation Checklist

1. Remove Collection tables and homepage collection item table from migrations.
2. Remove Collection models, factories, policies, requests, controllers, Inertia pages, and route imports.
3. Remove Collection relationships, validation rules, form props, product sync logic, and media reference checks.
4. Remove Collection route/entity types from redirect validation.
5. Update Stage 9 tests so products validate and save without Collection fields.
6. Add removal tests proving Collection schema, routes, and TypeScript pages are absent.
7. Update active architecture and UX docs so Collections are no longer described as launch behavior.
8. Re-run backend tests after removal.
