# Caching And Queues

## Caching Strategy

### Goals

- Reduce repeated read cost for public catalogue and settings data.
- Keep cache boundaries understandable and safe to invalidate.
- Avoid caching highly user-specific admin states unless clearly justified.

### Recommended Cache Boundaries

- Site-wide settings and contact details after they are approved and published.
- Homepage section assemblies.
- Published collection and product listing fragments or query result identifiers where practical.
- Sitemap generation outputs or timestamps if catalogue size justifies it.
- SEO-derived shared values, such as structured configuration assembled from stable records.

### Avoid Caching By Default

- Sensitive authenticated admin responses.
- In-progress admin forms.
- Highly parameterized search results unless profiling later proves strong value.
- Any content that risks stale publication or permission leakage without robust invalidation.

### Invalidation Rules

- Product updates invalidate related product, collection, homepage, and sitemap caches where applicable.
- Collection updates invalidate affected collection pages, homepage references, and sitemap caches.
- Settings updates invalidate header, footer, contact, and SEO-related caches.
- Legal-page publication updates invalidate their page caches and sitemap eligibility.

## Queue Strategy

### Launch Queue Use Cases

- Product image optimization and derivative generation.
- Social preview image preparation if later required.
- CSV export generation for inquiry data.
- Future notification jobs tied to inquiry handling if operationally approved.

### Synchronous By Default

- Public page rendering.
- Public search query handling.
- Admin reads and ordinary small writes.
- Contact and inquiry record creation unless a follow-up side effect is slow.

### Queue Design Principles

- Use jobs for slow or retryable work.
- Keep jobs idempotent where practical.
- Pass lightweight identifiers into jobs rather than large serialized payloads.
- Log failures with enough context for operational recovery.

## Driver Assumptions

- Cache and queue drivers should be environment-appropriate and configurable.
- Local development may use lightweight defaults.
- Production should use reliable drivers suited to actual hosting constraints.
