# Search And Filtering

## Public Catalogue

### Route And Inputs

- Route: `public.products.index`
- Query parameters:
  - `search`
  - `category`
  - `sort`
  - `page`

### Launch Behavior

- Search is limited to published products.
- Category filtering uses category slug.
- Sorting supports:
  - default editorial `sort_order`
  - `newest`
  - `oldest`
  - `name_az`
  - `name_za`
- Query parameters round-trip through pagination.

### Safety Rules

- Invalid category values degrade safely by showing no active category match rather than breaking the page.
- Public search parameters remain bounded and do not widen visibility beyond published products.
- Collection filtering is removed from launch scope.

### Canonical And Indexing

- Search stays within `/products`.
- Query-state pages must not become uncontrolled indexable duplicates.
- Noise parameters should not influence canonical output.

### Empty States

- No-results states must provide reset guidance.
- Draft or unpublished products must never leak into the catalogue.

## Admin Lists

### Products

- Filters: keyword, status, category.
- Sorting: current implementation supports deterministic ordering through backend query rules.
- Pagination: required.

### Categories

- Sorted by `sort_order`, then name.
- Full pagination is not required at current scale.

### Media

- Filters: keyword and processing status.
- Sorting: newest first by default.
- Pagination: required.

### Homepage

- No high-cardinality search surface; section editing stays direct and scoped.

### Banners

- List-style editing with stable ordering.

### Inquiries

- Filters: keyword, status, assigned user.
- Sorting: newest first by default.
- Pagination: required.

### Redirects

- Filters: keyword on source or target path.
- Pagination: required.

### Users

- Paginated user list with role and active-state context.

### Activity

- Paginated recent activity list.

## Pagination Rules

- Public product listing uses query-string-preserving pagination.
- Admin list pages use a shared pagination meta shape for Inertia payloads.
- Pagination must remain deterministic and stable under active filters.

## Cache And Invalidation Notes

- Public catalogue query combinations should avoid heavy full-page caching.
- Category, product, homepage, banner, page, media, and redirect changes must invalidate dependent public reads where applicable.
