# Stage 9 Implementation Plan

## Objective

Implement the approved backend CMS domain foundation: migrations, models, enums, factories, policies, Form Requests, controllers, routes, validation, authorization, and tests for the documented catalogue, content, inquiry, redirect, settings, and audit workflows.

## Scope Guardrails

- No ecommerce tables or workflows.
- No final public website build.
- No complete Stage 12 admin UI.
- No placeholder classes, empty folders, fake APIs, or unused abstractions.
- No repositories, services, actions, DTOs, jobs, events, listeners, observers, or commands unless a current Stage 9 workflow satisfies the documented use criteria.
- Keep `admin-ui-kit/` unchanged.

## Implementation Checklist

1. Foundation enums and role alignment.
2. Migrations in approved order: roles, user adjustments, categories, media, collections, pages, settings, contact/social, products, pivots, homepage content, inquiries, redirects, activity logs.
3. Eloquent models with casts, relationships, scopes, fillable/guarded protections, and soft deletes only where approved.
4. Factories for test-backed models without invented client content.
5. Policies for resource authorization aligned to the authorization matrix.
6. Form Requests for all Stage 9 write routes and sensitive workflow actions.
7. Admin routes and thin controllers for backend workflows, returning redirects or minimal Inertia payloads where needed.
8. Slug normalization, status transitions, redirect creation, delete restrictions, cache invalidation, and audit logging where required.
9. Inquiry workflows: status changes, notes, assignment, authorized CSV export with spreadsheet-injection protection.
10. Tests for migrations, relationships, constraints, policies, validation, CRUD workflows, sorting, publishing, redirects, cache invalidation, filters, pagination, and unauthorized access.
11. Documentation updates only where implementation reveals an approved correction or setup behavior changes.

## Validation Cadence

After each module, run the relevant focused tests plus Pint and PHPStan where practical. At the end, run the full Stage 9 gate:

- `php artisan optimize:clear`
- `php artisan migrate:fresh --seed`
- `php artisan route:list`
- `php artisan test`
- `php vendor/bin/pint --test`
- `php vendor/bin/phpstan analyse --memory-limit=512M`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Current Stage 8 Gate

Passed after Codex audit corrections. See `docs/reviews/stage-08-codex-audit.md`.
