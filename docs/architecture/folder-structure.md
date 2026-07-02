# Folder Structure

## Structure Principles

- Separate public and admin delivery concerns clearly.
- Keep domain and application logic out of templates and front-end pages.
- Use services, actions, jobs, and DTOs when they improve clarity, not by habit.
- Introduce repositories only where a real abstraction boundary exists.

## Proposed Repository Structure

```text
app/
|-- Actions/
|   |-- Inquiry/
|   |-- Media/
|   |-- Product/
|   \-- Seo/
|-- Console/
|   \-- Commands/
|-- Data/
|   |-- Cms/
|   \-- Public/
|-- Enums/
|-- Events/
|-- Exports/
|-- Http/
|   |-- Controllers/
|   |   |-- Admin/
|   |   \-- Public/
|   |-- Middleware/
|   \-- Requests/
|       |-- Admin/
|       \-- Public/
|-- Jobs/
|-- Listeners/
|-- Media/
|-- Models/
|-- Observers/
|-- Policies/
|-- Providers/
|-- Repositories/
|   \-- Search/
|-- Search/
|-- Seo/
|-- Services/
|   |-- Inquiry/
|   |-- Media/
|   |-- Seo/
|   \-- Sitemap/
|-- Support/
|   |-- Breadcrumbs/
|   |-- Canonical/
|   \-- Pagination/
routes/
|-- admin.php
|-- public.php
|-- auth.php
|-- console.php
resources/
|-- css/
|   |-- public/
|   \-- admin/
|-- js/
|   |-- public/
|   \-- admin/
|       |-- Components/
|       |-- Hooks/
|       |-- Layouts/
|       |-- Pages/
|       |-- Types/
|       \-- Utils/
|-- views/
|   |-- components/
|   |-- layouts/
|   |-- pages/
|   |   |-- collections/
|   |   |-- products/
|   |   \-- static/
|   \-- partials/
tests/
|-- Feature/
|   |-- Admin/
|   \-- Public/
|-- Unit/
|-- Pest.php or PHPUnit.xml usage depending on final setup
docs/
|-- architecture/
|-- content/
|-- discovery/
|-- testing/
|-- ux/
\-- PROJECT_PROGRESS.md
```

## Directory Responsibilities

### `app/Http/Controllers/Public`

- Controllers for public Blade routes only.
- Keep them thin by delegating query assembly and workflows to services, search classes, and DTO mappers.

### `app/Http/Controllers/Admin`

- Controllers for authenticated CMS workflows.
- Return Inertia responses and coordinate requests, policies, actions, and data objects.

### `app/Http/Requests/Public`

- Validation for contact forms, inquiry forms, and any public search parameter normalization that benefits from request objects.

### `app/Http/Requests/Admin`

- Validation and authorization for admin writes and sensitive actions.

### `app/Policies`

- Resource-level authorization for products, collections, pages, media, inquiries, users, and settings.

### `app/Models`

- Eloquent models only, with clear relationships, scopes, casts, and guarded business invariants where appropriate.

### `app/Enums`

- Stable values such as inquiry status, publish status, media type, and role identifiers.

### `app/Data`

- Typed data objects for public view models, admin form payloads, and service boundaries.
- Prevents untyped array sprawl between controller, service, and front-end boundaries.

### `app/Actions`

- Single-purpose write-side operations such as publishing a product, processing inquiry creation, or attaching media.
- Best for workflows that are smaller than a broad service but worth isolating.

### `app/Services`

- Multi-step business workflows, cross-cutting logic, and reusable orchestration.
- Good fit for media handling, SEO assembly, sitemap building, inquiry workflow, and search orchestration.

### `app/Repositories`

- Use only where a genuine reusable query abstraction is justified.
- Likely limited to search or complex read models, not one repository per model.

### `app/Jobs`

- Deferred work such as image optimization, derivative generation, export preparation, and future email notifications.

### `app/Events` and `app/Listeners`

- Add only where decoupling has a concrete benefit.
- Good fit for optional future notifications or audit side effects that should not bloat controllers.
- Not required for every write path.

### `app/Observers`

- Use only for predictable model lifecycle side effects that stay easy to test, such as slug-related cleanup or audit hooks if later justified.

### `app/Console/Commands`

- Reserve for operational tasks such as maintenance, reindexing helpers, or admin-facing housekeeping commands if later justified.

### `app/Media`

- Home for media-specific value objects, path strategies, or derivative rules if the media layer grows beyond simple services.

### `app/Search`

- Dedicated query builders and result shaping for product discovery.
- Keeps public search behavior out of controllers and templates.

### `app/Seo`

- Home for metadata builders, structured-data assemblers, breadcrumb helpers if kept separate from support utilities, and canonical-URL strategy classes.

### `app/Exports`

- CSV export preparation and spreadsheet-injection-safe output helpers.

### `resources/views`

- Public Blade rendering only.
- Use layouts, pages, partials, and small reusable Blade components.
- Keep business rules out of templates.

### `resources/js/admin`

- Authenticated admin front-end only.
- Organize by layouts, pages, components, hooks, utilities, and types.
- Feature-level or route-level code splitting should happen here where practical.

### `resources/js/public`

- Minimal progressive-enhancement scripts for public interactions.
- No SPA behavior for the public site.

## Use Criteria

- Services: use for workflows with multiple steps, shared logic, or cross-model coordination.
- Repositories: use only when repeated complex read logic or data-source substitution provides real value.
- Events and listeners: use only when decoupling is genuinely helpful, such as optional future notifications.
- Observers: use only for predictable lifecycle hooks with low surprise factor.
- DTOs or data objects: use when moving structured data between layers improves clarity and typing.
