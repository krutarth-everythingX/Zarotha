# SEO Plan

## Objectives

- Maximize discoverability for the enquiry-based catalogue and product pages.
- Keep admin, draft, filtered-noise, and internal routes out of search results.
- Preserve URL continuity through disciplined redirect handling.

## Public URL Set

- `/`
- `/products`
- `/products/{product-slug}`
- `/about-us`
- `/our-craftsmanship`
- `/contact`
- `/privacy-policy`
- `/terms-and-conditions`
- `/sitemap.xml`
- `/robots.txt`

Legacy collection URLs are not part of the active sitemap and permanently redirect to `/products`.

## Slug Rules

- Product slugs remain unique within `products`.
- Category slugs remain unique within `categories`.
- Fixed content page slugs remain stable through the approved route keys.
- Redirect source paths remain unique and loops remain blocked.

## Canonical Strategy

- Homepage, product detail pages, and fixed pages self-canonical by default.
- Product index remains canonical to `/products` unless a tightly controlled filtered policy is later justified.
- Unsupported or noisy query params must not affect canonical output.

## Metadata Fallbacks

### Product

1. Product `meta_title`
2. Product name
3. Site default title

1. Product `meta_description`
2. Product short description
3. Site default description

### Fixed Pages

1. Page-specific SEO fields
2. Page title or excerpt
3. Site defaults

## Open Graph

- Public pages expose Open Graph title, description, URL, and image when available.
- OG image fallbacks should use approved media only.
- No ecommerce `Offer` or stock metadata is emitted.

## Structured Data

- `WebSite` on the homepage.
- `Organization` where approved business identity data exists.
- `Product` on product detail pages.
- `BreadcrumbList` on interior pages that render breadcrumbs.

## Sitemap Composition

- Include indexable fixed pages.
- Include published product detail pages.
- Exclude admin, auth, draft, archived, redirected, and query-parameter states.
- Exclude collection URLs.

## Robots Rules

- Allow intended public pages.
- Disallow `/admin` and internal auth flows.
- Keep non-public states out of crawl surfaces.

## Redirect Strategy

- Historical public paths resolve through the centralized redirect system before fallback `404` behavior.
- Permanent redirects default to `301`.
- Self-redirects and simple loops remain blocked.

## Indexing Rules

- Search results and category-filtered catalogue states must not create uncontrolled thin pages.
- Missing or unpublished content returns `404` after redirect resolution is exhausted.
