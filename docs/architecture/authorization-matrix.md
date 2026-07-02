# Authorization Matrix

## Roles

- `super_administrator`: full CMS access, including user management and singleton settings.
- `content_editor`: catalogue, media, homepage, banner, page, redirect, and approved settings access.
- `inquiry_manager`: inquiry workflow access, including assignment and export, without content-management access.

## Policy Conventions

Common policy methods in active use:

- `viewAny`
- `view`
- `create`
- `update`
- `delete`
- `publish`
- `archive`
- `reorder`
- `export`
- `assign`
- `addNote`

## Capability Summary

| Capability Area | Super Administrator | Content Editor | Inquiry Manager |
| --- | --- | --- | --- |
| Dashboard | Yes | Yes | Yes |
| Products | Full | Full | No |
| Categories | Full | Full | No |
| Product gallery | Full | Full | No |
| Media library | Full | Full | No |
| Homepage and banners | Full | Full | No |
| Fixed pages and legal pages | Full | Full | No |
| Contact settings | Full | Full | No |
| SEO settings | Full | Full | No |
| Redirects | Full | Full | No |
| Inquiries | Full | View only if explicitly permitted later | Full |
| Inquiry export | Full | No | Full |
| Users | Full | No | No |
| General settings | Full | No by default | No |
| Activity history | Full | Yes | Yes |

## Admin Action Matrix

| Admin Action | Role Access | Authorization Boundary | Validation | Audit | Notes |
| --- | --- | --- | --- | --- | --- |
| View dashboard | all admin roles | auth + admin middleware | none | optional | Shared overview only |
| Create or update category | super admin, content editor | policy | Form Request | yes | Category deletion remains protected |
| Reorder categories | super admin, content editor | policy | Form Request | yes | Deterministic ordering |
| Delete category | super admin, content editor | policy | controller guard | yes | Must reject while products reference category |
| Create product | super admin, content editor | policy | `StoreProductRequest` | yes | No collection fields |
| Update product | super admin, content editor | policy | `UpdateProductRequest` | yes | Includes SEO, media, and editorial flags |
| Publish product | super admin, content editor | policy | publish request | yes | Featured media prerequisite remains enforced |
| Archive product | super admin, content editor | policy | archive request | yes | Removes public visibility |
| Delete product | super admin, content editor | policy | controller guard | yes | Soft delete only |
| Manage product gallery | super admin, content editor | policy on product | gallery requests | yes | Ordering and featured selection remain deterministic |
| Upload or replace media | super admin, content editor | policy | media requests | yes | Rate-limited and Stage 10 pipeline-backed |
| Delete media | super admin, content editor | policy | controller guard | yes | Reject while referenced |
| Update homepage sections | super admin, content editor | policy | homepage requests | yes | Collection section types are not used |
| Manage banners | super admin, content editor | policy | banner requests | yes | |
| Update fixed pages | super admin, content editor | policy | page requests | yes | About, Craftsmanship, Privacy, Terms |
| Update contact settings | super admin, content editor | policy | contact settings request | yes | |
| Update SEO settings | super admin, approved editor | policy | SEO settings request | yes | Singleton-safe |
| Update general settings | super admin | policy | settings request | yes | Singleton-safe |
| View inquiries | super admin, inquiry manager | policy | none | optional | Privacy-aware payloads only |
| Update inquiry status | super admin, inquiry manager | policy | inquiry workflow requests | yes | Creates activity |
| Add inquiry note | super admin, inquiry manager | policy | inquiry workflow requests | yes | Creates activity |
| Assign inquiry | super admin, inquiry manager | policy | inquiry workflow requests | yes | Creates activity |
| Export inquiries | super admin, inquiry manager | policy | export request | yes | Authorized and privacy-safe |
| Manage redirects | super admin, content editor | policy | redirect requests | yes | Uniqueness and loop blocking required |
| Manage users | super admin | policy | user requests | yes | Prevent unsafe deactivation paths |
| View activity history | all admin roles with route access | auth + admin middleware | none | no | Read-only |

## Public Submission Boundary

- Public inquiry submission is anonymous.
- Protection is enforced with validation, throttling, published-product lookup rules, honeypot-style `website` handling, and safe persistence.
- No public ecommerce authorization surface exists because ecommerce functionality is out of scope.
