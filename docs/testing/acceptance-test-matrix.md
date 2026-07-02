# Acceptance Test Matrix

## Matrix

| Area | Acceptance Target | Test Type | Notes |
| --- | --- | --- | --- |
| Home page | Loads with approved sections only, correct status, and inquiry CTA visibility | Feature + smoke | Missing optional sections hide cleanly |
| Collections index | Published collections only, correct grid or pagination behavior | Feature | Empty state included |
| Collection detail | Published collection plus ordered products | Feature + smoke | Missing collection returns `404` |
| Products index | Search and filter validation, pagination, empty state | Feature + smoke | Query params bounded |
| Product detail | Published product, gallery, specs, inquiry actions | Feature + SEO | Historical slug redirects tested |
| About and Craftsmanship | Published pages only, correct status behavior | Feature | Legal-content independence preserved |
| Contact and inquiry submission | Validation, rate limiting, safe error handling | Feature + security | General and product-specific inquiry flows |
| Privacy and Terms | Publication blocked without approved content | Feature | Status and SEO handling |
| Redirects | Unique sources, no loops, correct response code | Feature + unit | Central infrastructure path |
| Sitemap and robots | Public-only inclusion and admin exclusion | Feature + SEO | Search-state exclusion tested |
| Admin auth | Login, logout, password reset throttling and access boundaries | Feature + security | Session-based flow |
| Products CMS | CRUD, publish, archive, soft delete, cache invalidation expectations | Feature + policy | Gallery and SEO fields included |
| Categories CMS | CRUD, reorder, referenced-delete rejection | Feature + policy | Must not cascade-delete products |
| Collections CMS | CRUD, publish, archive, ordered product membership | Feature + policy | Ordered pivot behavior |
| Media library | Upload validation, reference-safe deletion | Feature + security | Reused media protection |
| Homepage and banners | Section update, reorder, visibility behavior | Feature | Homepage cache invalidation |
| Static pages CMS | Fixed-page editing and publication behavior | Feature + policy | Legal and contact page safeguards |
| Inquiries CMS | List, detail, status, notes, assignment, export | Feature + policy + security | Workflow timeline preserved |
| Redirects CMS | Create, update, delete with validation | Feature + policy | Loop prevention |
| Users and settings | Authorized access only, active-state management | Feature + policy | No unsafe role leakage |
| Accessibility | Keyboard access, focus behavior, dialogs, forms, gallery, mobile menu | Manual + automated where practical | Public and admin coverage |
| Performance | Budgets remain within approved thresholds | Audit + budget checks | Public and admin |
| Security | Authorization, CSRF, rate limits, CSV safety, upload rejection | Security regression | Route and workflow mapping |
