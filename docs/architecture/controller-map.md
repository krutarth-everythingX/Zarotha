# Controller Map

## Controller Principles

- Controllers stay thin and delegate validation and authorization to Form Requests and policies.
- Query composition may live in shared helpers or local controller methods when that keeps the surface simple.
- No collection controllers remain in launch scope.

## Public Controllers

| Controller | Routes | Responsibility | Response Type |
| --- | --- | --- | --- |
| `Public\HomeController` | `public.home` | Assemble homepage sections, banners, featured categories or products, settings-backed contact data, and SEO context | Blade view |
| `Public\ProductController` | `public.products.index`, `public.products.show` | Render published catalogue listing and product detail pages with category-based related products | Blade view |
| `Public\StaticPageController` | `public.pages.about`, `public.pages.craftsmanship`, `public.pages.privacy`, `public.pages.terms` | Resolve fixed page records by page key and render public content with SEO metadata | Blade view |
| `Public\ContactController` | `public.contact.show`, `public.contact.submit`, `public.inquiries.product.submit` | Render contact page and submit general or product-linked inquiries through the existing inquiry workflow | Blade view or redirect |
| `Public\SitemapController` | `public.sitemap` | Generate XML sitemap for indexable public pages and published product URLs | XML response |
| `Public\RobotsController` | `public.robots` | Generate `robots.txt` rules for public crawling boundaries | Plain-text response |

## Admin Controllers

| Controller | Routes | Responsibility | Response Type |
| --- | --- | --- | --- |
| `Admin\DashboardController` | `admin.dashboard.index` | Provide admin overview metrics and recent activity | Inertia |
| `Admin\CategoryController` | category index, create, update, reorder, delete | Manage category records and enforce product-reference delete protection | Inertia or redirect |
| `Admin\ProductController` | product index, create, edit, store, update, publish, archive, delete | Manage product lifecycle, search filters, SEO fields, and status transitions | Inertia or redirect |
| `Admin\ProductGalleryController` | gallery index, attach, reorder, set featured, detach | Manage ordered product-gallery media relationships and featured image selection | Inertia or redirect |
| `Admin\MediaController` | media index, upload, update, replace, delete | Manage media upload, metadata, replacement, reference safety, and processing lifecycle | Inertia or redirect |
| `Admin\HomepageController` | homepage edit and section update | Manage homepage section visibility, ordering, copy, and featured product/category behavior exposed by the approved schema | Inertia or redirect |
| `Admin\BannerController` | banner index, create, update, delete | Manage published homepage banner records | Inertia or redirect |
| `Admin\PageController` | generic fixed-page edit and update | Manage About, Craftsmanship, Privacy, and Terms content records | Inertia or redirect |
| `Admin\SettingsController` | general settings, SEO settings, contact settings | Manage singleton settings and contact information without allowing duplicate records | Inertia or redirect |
| `Admin\InquiryController` | inquiry list, detail, status, notes, assign, export | Manage inquiry workflow, notes, assignment, and authorized exports | Inertia, redirect, or file response |
| `Admin\RedirectController` | redirect index, create, update, delete | Manage redirect history with uniqueness and loop-prevention rules | Inertia or redirect |
| `Admin\UserController` | user list, create, update, deactivate | Manage CMS users and roles with server-side authorization | Inertia or redirect |
| `Admin\ActivityController` | activity index | Read audit and workflow activity history | Inertia |

## Query And Workflow Notes

- Public product listing applies search, category filtering, published-state checks, deterministic sorting, and pagination.
- Public product detail loads category, featured media, gallery media, and category-based related products.
- Public inquiry submission creates `Inquiry` and `InquiryActivity` records transactionally.
- Admin dashboard metrics intentionally focus on active launch entities: products, categories, media, and unread inquiries.
- Media workflows continue relying on the Stage 10 pipeline rather than duplicating image processing in the frontend.
