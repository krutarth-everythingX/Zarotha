# Routes

## Route Principles

- Public delivery remains Blade-rendered, SEO-first, and inquiry-focused.
- Admin delivery remains Laravel web routes with Inertia, React, and TypeScript.
- React Router is not used.
- Collections are not part of the launch scope. Legacy `/collections` URLs redirect to `/products`.
- Redirect history resolution remains path-based and must continue preventing loops.

## Public Routes

Base assumptions:

- Route file: `routes/public.php`
- Response type: Blade view, redirect, XML, or plain text
- Public catalogue visibility: published products only

| Name | Method | URL Pattern | Status Codes | Notes |
| --- | --- | --- | --- | --- |
| `public.home` | `GET` | `/` | `200` | Homepage assembled from CMS-managed sections, banners, products, and settings |
| `public.products.index` | `GET` | `/products` | `200` | Product catalogue with search, category filter, sorting, and pagination |
| `public.products.show` | `GET` | `/products/{productSlug}` | `200`, `404` | Published product detail only |
| `public.inquiries.product.submit` | `POST` | `/products/{productSlug}/inquiries` | `302`, `404`, `422`, `429` | Product-linked inquiry using existing inquiry workflow |
| `public.pages.about` | `GET` | `/about-us` | `200`, `404` | Fixed CMS page keyed to `about_us` |
| `public.pages.craftsmanship` | `GET` | `/our-craftsmanship` | `200`, `404` | Fixed CMS page keyed to `our_craftsmanship` |
| `public.pages.privacy` | `GET` | `/privacy-policy` | `200`, `404` | Fixed CMS page keyed to `privacy_policy` |
| `public.pages.terms` | `GET` | `/terms-and-conditions` | `200`, `404` | Fixed CMS page keyed to `terms_and_conditions` |
| `public.contact.show` | `GET` | `/contact` | `200` | Contact page with approved contact methods and inquiry form |
| `public.contact.submit` | `POST` | `/contact` | `302`, `422`, `429` | General inquiry submission |
| `public.sitemap` | `GET` | `/sitemap.xml` | `200` | XML sitemap for indexable public pages and published products |
| `public.robots` | `GET` | `/robots.txt` | `200` | Plain-text crawl rules |

## Legacy Public Redirects

| Method | URL Pattern | Status Code | Behavior |
| --- | --- | --- | --- |
| `GET` | `/collections` | `301` | Permanent redirect to `/products` |
| `GET` | `/collections/{collectionSlug}` | `301` | Permanent redirect to `/products` |

## Public Canonical And Indexing Rules

- Homepage, product detail pages, and fixed pages self-canonical by default.
- Product index query states stay on `/products`.
- Search and filter states must not create uncontrolled duplicate canonical destinations.
- Draft, archived, deleted, or unpublished content must never render as public `200` pages.

## Public Cache Rules

- Homepage, static pages, product detail pages, sitemap, and robots may use short-lived cache-friendly responses where invalidation remains clear.
- Product catalogue query states should avoid heavy full-page caching because of parameter variation.
- Product, banner, homepage, page, redirect, and settings changes should invalidate dependent public reads where applicable.

## Admin Routes

Base assumptions:

- Route file: `routes/admin.php`
- Prefix: `/admin`
- Name prefix: `admin.`
- Middleware baseline: authenticated admin user plus noindex protection
- Response type: Inertia page or redirect

### Authentication

Authentication routes are defined in `routes/auth.php` and remain outside the protected admin group.

### Core CMS

| Name | Method | URL Pattern | Status Codes | Notes |
| --- | --- | --- | --- | --- |
| `admin.dashboard.index` | `GET` | `/admin` | `200` | Dashboard metrics and recent activity |
| `admin.categories.index` | `GET` | `/admin/categories` | `200` | Category list |
| `admin.categories.store` | `POST` | `/admin/categories` | `302`, `422` | Create category |
| `admin.categories.update` | `PATCH` | `/admin/categories/{category}` | `302`, `422`, `404` | Update category |
| `admin.categories.reorder` | `POST` | `/admin/categories/reorder` | `302`, `422` | Deterministic ordering |
| `admin.categories.destroy` | `DELETE` | `/admin/categories/{category}` | `302`, `403`, `409`, `404` | Reject while products still reference category |
| `admin.products.index` | `GET` | `/admin/products` | `200` | Filtered and paginated product list |
| `admin.products.create` | `GET` | `/admin/products/create` | `200` | Product create form |
| `admin.products.store` | `POST` | `/admin/products` | `302`, `422` | Create product |
| `admin.products.edit` | `GET` | `/admin/products/{product}` | `200`, `404` | Product edit form |
| `admin.products.update` | `PUT/PATCH` | `/admin/products/{product}` | `302`, `422`, `404` | Update product |
| `admin.products.publish` | `POST` | `/admin/products/{product}/publish` | `302`, `403`, `404` | Publish transition |
| `admin.products.archive` | `POST` | `/admin/products/{product}/archive` | `302`, `403`, `404` | Archive transition |
| `admin.products.destroy` | `DELETE` | `/admin/products/{product}` | `302`, `403`, `404` | Soft delete |
| `admin.products.gallery.index` | `GET` | `/admin/products/{product}/gallery` | `200`, `404` | Gallery management |
| `admin.products.gallery.attach` | `POST` | `/admin/products/{product}/gallery` | `302`, `422`, `404` | Attach media to gallery |
| `admin.products.gallery.reorder` | `POST` | `/admin/products/{product}/gallery/reorder` | `302`, `422`, `404` | Reorder gallery |
| `admin.products.gallery.featured` | `POST` | `/admin/products/{product}/gallery/featured` | `302`, `422`, `404` | Set featured image |
| `admin.products.gallery.detach` | `DELETE` | `/admin/products/{product}/gallery/{media}` | `302`, `404` | Detach media from gallery only |
| `admin.media.index` | `GET` | `/admin/media` | `200` | Media library |
| `admin.media.store` | `POST` | `/admin/media` | `302`, `422`, `429` | Upload media |
| `admin.media.update` | `PUT/PATCH` | `/admin/media/{media}` | `302`, `422`, `404` | Update alt/caption |
| `admin.media.replace` | `POST` | `/admin/media/{media}/replace` | `302`, `422`, `429`, `404` | Replace asset and regenerate variants |
| `admin.media.destroy` | `DELETE` | `/admin/media/{media}` | `302`, `403`, `409`, `404` | Reject unsafe deletion while referenced |
| `admin.homepage.edit` | `GET` | `/admin/homepage` | `200` | Homepage configuration |
| `admin.homepage.sections.update` | `PUT/PATCH` | `/admin/homepage/sections/{section}` | `302`, `422`, `404` | Update section content and visibility |
| `admin.banners.index` | `GET` | `/admin/banners` | `200` | Banner list |
| `admin.banners.store` | `POST` | `/admin/banners` | `302`, `422` | Create banner |
| `admin.banners.update` | `PUT/PATCH` | `/admin/banners/{banner}` | `302`, `422`, `404` | Update banner |
| `admin.banners.destroy` | `DELETE` | `/admin/banners/{banner}` | `302`, `404` | Delete banner |
| `admin.pages.contact.edit` | `GET` | `/admin/pages/contact` | `200` | Contact settings page |
| `admin.pages.contact.update` | `PUT/PATCH` | `/admin/pages/contact` | `302`, `422` | Update contact settings |
| `admin.pages.edit` | `GET` | `/admin/pages/{pageSlug}` | `200`, `404` | Edit fixed content pages |
| `admin.pages.update` | `PUT/PATCH` | `/admin/pages/{pageSlug}` | `302`, `422`, `404` | Update fixed pages |
| `admin.inquiries.index` | `GET` | `/admin/inquiries` | `200` | Inquiry list |
| `admin.inquiries.show` | `GET` | `/admin/inquiries/{inquiry}` | `200`, `404` | Inquiry detail |
| `admin.inquiries.update-status` | `POST` | `/admin/inquiries/{inquiry}/status` | `302`, `422`, `404` | Update workflow status |
| `admin.inquiries.add-note` | `POST` | `/admin/inquiries/{inquiry}/notes` | `302`, `422`, `404` | Add internal note |
| `admin.inquiries.assign` | `POST` | `/admin/inquiries/{inquiry}/assign` | `302`, `422`, `404` | Assign user |
| `admin.inquiries.export` | `POST` | `/admin/inquiries/export` | `302`, `422`, `429` | Authorized CSV export |
| `admin.redirects.index` | `GET` | `/admin/redirects` | `200` | Redirect list |
| `admin.redirects.store` | `POST` | `/admin/redirects` | `302`, `422`, `409` | Create redirect |
| `admin.redirects.update` | `PUT/PATCH` | `/admin/redirects/{redirect}` | `302`, `422`, `409`, `404` | Update redirect |
| `admin.redirects.destroy` | `DELETE` | `/admin/redirects/{redirect}` | `302`, `404` | Delete redirect |
| `admin.users.index` | `GET` | `/admin/users` | `200` | User list |
| `admin.users.store` | `POST` | `/admin/users` | `302`, `422` | Create user |
| `admin.users.update` | `PUT/PATCH` | `/admin/users/{user}` | `302`, `422`, `404` | Update user |
| `admin.users.deactivate` | `POST` | `/admin/users/{user}/deactivate` | `302`, `403`, `404` | Deactivate user |
| `admin.settings.edit` | `GET` | `/admin/settings` | `200` | General settings |
| `admin.settings.update` | `PUT/PATCH` | `/admin/settings` | `302`, `422` | Update general settings |
| `admin.seo.settings.edit` | `GET` | `/admin/seo` | `200` | SEO settings |
| `admin.seo.settings.update` | `PUT/PATCH` | `/admin/seo` | `302`, `422` | Update SEO defaults |
| `admin.activity.index` | `GET` | `/admin/activity` | `200` | Activity log |

## Route Safety Rules

- Every admin write route must remain protected by server-side authorization and validation.
- Inquiry exports remain authorized and privacy-safe.
- Redirect source paths remain unique and redirect loops remain blocked.
- Category deletion must not cascade-delete products.
- Product queries and public inquiry entry points must remain limited to published products.
