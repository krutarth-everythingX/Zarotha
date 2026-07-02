# Zarokha Wooden Arts Website

Laravel 12 application for Zarokha Wooden Arts: a public inquiry-based product catalogue built with Blade, plus an authenticated CMS built with Inertia, React, and TypeScript.

## Scope Guardrails

- Inquiry-based catalogue only.
- No cart, checkout, payment, shipping, order, inventory, customer account, or wishlist features.
- Public delivery remains Laravel Blade.
- Admin delivery remains Laravel Inertia with React and TypeScript.
- React Router is not used.
- The original `admin-ui-kit/` directory remains unchanged.
- Collections are removed from launch scope.

## Current Repository State

- Stage 9 backend CMS is approved and preserved.
- Stage 10 media pipeline is implemented and validated.
- Public launch pages are implemented:
  - Home
  - Products
  - Product Detail
  - About Us
  - Our Craftsmanship
  - Contact
  - Privacy Policy
  - Terms and Conditions
  - XML sitemap
  - robots.txt
- Admin CMS routes now resolve to working Inertia screens for products, categories, media, homepage, banners, pages, inquiries, redirects, users, activity, and settings.

## Runtime Requirements

- PHP `^8.2`
- Composer
- Node.js
- npm
- MySQL 8

## Local Setup

1. Install PHP dependencies:

```bash
composer install
```

2. Create the local environment file:

```bash
cp .env.example .env
```

3. Update `.env` with local MySQL credentials and `APP_URL`.
4. Generate the application key:

```bash
php artisan key:generate
```

5. Install Node dependencies:

```bash
npm install
```

6. Run migrations and seed local data:

```bash
php artisan migrate:fresh --seed
```

7. Optionally start local development:

```bash
composer dev
```

## Quality Commands

- `composer validate --strict`
- `php artisan optimize:clear`
- `php artisan test`
- `php vendor/bin/pint --test`
- `php vendor/bin/phpstan analyse --memory-limit=512M`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Repository Landmarks

- Public routes: `routes/public.php`
- Admin auth routes: `routes/auth.php`
- Admin protected routes: `routes/admin.php`
- Public Blade layout: `resources/views/layouts/public.blade.php`
- Public pages: `resources/views/pages/`
- Admin React entry: `resources/js/admin/app.tsx`
- Admin pages: `resources/js/admin/Pages/Admin/`
- Progress tracker: `docs/PROJECT_PROGRESS.md`
- Collection-removal notes: `docs/implementation/remove-collections-plan.md`
