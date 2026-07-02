# Form Requests

## Request Principles

- Every admin write route remains protected by server-side validation and authorization.
- Public inquiry submission uses a dedicated request boundary.
- Collection request classes are removed from launch scope.

## Public Requests

| Request | Route Use | Authorization | Validation Focus |
| --- | --- | --- | --- |
| `SubmitInquiryRequest` | `public.contact.submit`, `public.inquiries.product.submit` | anonymous allowed | name, email, phone, message, optional product context, anti-spam `website` field, safe source data |

## Admin Authentication Requests

| Request | Route Use | Authorization | Validation Focus |
| --- | --- | --- | --- |
| `LoginRequest` | admin login | guest only | email, password, remember-me shape, throttling |

## Admin Catalogue Requests

| Request | Route Use | Authorization | Validation Focus |
| --- | --- | --- | --- |
| `StoreCategoryRequest` | category create | policy | name, slug uniqueness, sort order, active state |
| `UpdateCategoryRequest` | category update | policy | current-record uniqueness, active state, ordering |
| `ReorderCategoriesRequest` | category reorder | policy | deterministic ordered ids |
| `StoreProductRequest` | product create | policy | category exists, slug uniqueness, publish status, media references, editorial flags, SEO fields |
| `UpdateProductRequest` | product update | policy | current-record uniqueness and approved product fields |
| `PublishProductRequest` | product publish | policy | publish prerequisites including featured media |
| `ArchiveProductRequest` | product archive | policy | valid status transition |

## Admin Media Requests

| Request | Route Use | Authorization | Validation Focus |
| --- | --- | --- | --- |
| `StoreMediaRequest` | media upload | policy | image format, file size, mime validity |
| `UpdateMediaRequest` | media metadata update | policy | alt text, caption, editable metadata |
| `ReplaceMediaRequest` | media replacement | policy | replacement image validity and safe replacement semantics |
| `AttachProductMediaRequest` | gallery attach | policy on product | media ids, duplicates, optional alt override |
| `ReorderProductMediaRequest` | gallery reorder | policy on product | deterministic gallery ordering |
| `SetProductFeaturedMediaRequest` | featured selection | policy on product | selected media belongs to product gallery or approved asset set |

## Admin Homepage, Banner, And Page Requests

| Request | Route Use | Authorization | Validation Focus |
| --- | --- | --- | --- |
| `UpdateHomepageSectionRequest` | homepage section update | policy | visibility, titles, copy, CTA fields, supported linked record ids |
| `StoreBannerRequest` | banner create | policy | headline, body, media ids, CTA fields, sort order |
| `UpdateBannerRequest` | banner update | policy | current banner fields and publication behavior |
| `UpdatePageRequest` | fixed-page update | policy | title, body, media references, SEO fields, publication state |
| `UpdateContactSettingsRequest` | contact settings update | policy | approved contact fields, helper text, consent text, visibility flags |
| `UpdateGeneralSettingsRequest` | general settings update | policy | singleton-safe general settings only |
| `UpdateSeoSettingsRequest` | SEO settings update | policy | singleton-safe default title, description, robots, and OG image |

## Admin Inquiry, Redirect, And User Requests

| Request | Route Use | Authorization | Validation Focus |
| --- | --- | --- | --- |
| `UpdateInquiryStatusRequest` | inquiry status change | policy | allowed transitions |
| `AddInquiryNoteRequest` | inquiry note | policy | required note text |
| `AssignInquiryRequest` | inquiry assign | policy | active assignable user |
| `ExportInquiriesRequest` | inquiry export | policy | allowed filters and bounded export scope |
| `StoreRedirectRequest` | redirect create | policy | unique source path, safe target path, no self-loop, valid status |
| `UpdateRedirectRequest` | redirect update | policy | same rules with current-record uniqueness |
| `StoreUserRequest` | user create | policy | role, email uniqueness, password rules |
| `UpdateUserRequest` | user update | policy | role, active state, current-record uniqueness |

## Validation Notes

- Delete actions without payloads may rely on policies plus controller guard clauses instead of separate request classes.
- Conflict conditions, such as referenced-media deletion or deleting a category still used by products, must surface as clear actionable failures.
- SQLite test accommodations must not replace MySQL production behavior.
