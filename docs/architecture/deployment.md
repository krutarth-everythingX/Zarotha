# Deployment And Environment Notes

## Stage Status

This document records the Stage 8 deployment-facing foundation only. It does not finalize the production deployment process because hosting decisions remain open.

## Runtime Targets

- PHP `^8.2`
- Laravel Framework `12.62.0`
- Node.js `24.16.0` validated locally
- npm `11.13.0` validated locally
- MySQL `8`

## Environment-Driven Infrastructure

The foundation keeps these items configurable through environment variables:

- database connection
- session driver
- cache store
- queue connection
- filesystem disk
- mailer
- log channel and level
- CSP enablement and policy string
- HSTS enablement

## Local Environment Sequence

1. Copy `.env.example` to `.env`.
2. Set local MySQL credentials and `APP_URL`.
3. Run `php artisan key:generate`.
4. Run `php artisan migrate`.
5. Optionally run `php artisan db:seed --class=LocalAdminUserSeeder` in the local environment only.
6. Run `composer dev` for the integrated local workflow.

## Production Decisions Still Open

- production storage driver
- production cache driver
- production queue driver
- production error-reporting destination
- media backup destination
- exact deployment process and release automation

## Release Gates Already Defined Elsewhere

Stage 7 established the quality gates that production deployment must satisfy:

- SEO metadata and indexing controls
- accessibility acceptance criteria
- security controls and checklist items
- performance budgets
- browser and device coverage
- approved test strategy and acceptance matrix

## Current Foundation Boundary

Stage 8 intentionally stops at:

- project bootstrap
- auth foundation
- shared public and admin shells
- tooling and validation baseline

It does not deploy or implement the full CMS and public catalogue yet.
