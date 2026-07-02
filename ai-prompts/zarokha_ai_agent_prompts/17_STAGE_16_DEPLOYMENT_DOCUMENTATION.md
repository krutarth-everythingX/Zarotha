# Stage 16 — Deployment, Operations, Backups, and Documentation

## Project Snapshot

**Client:** Zarokha Wooden Arts  
**Location:** Vadodara, Gujarat, India  
**Business:** Manufacturer and seller of handcrafted wooden décor, including wooden jharokhas, elephants, wall décor, sculptures, temple décor, handcrafted art, and custom decorative pieces.

**Website model:** Product catalogue and inquiry website. It is not an ecommerce website. There is no cart, checkout, online payment, order management, or inventory management in the current scope.

**Public website:** Laravel-rendered semantic HTML5 with production CSS and JavaScript.  
**Admin CMS:** React + Inertia.js + TypeScript using the supplied admin UI kit without redesigning it.  
**Backend:** Latest stable Laravel version available when implementation starts.  
**Database:** MySQL.  
**Authentication:** Laravel authentication for authorized CMS users.  
**Primary goals:** Luxury brand presentation, fast product discovery, strong SEO, high-quality product imagery, inquiry conversion, easy CMS management, accessibility, security, and future extensibility.

## Objective

Prepare the application for repeatable, secure production deployment and ongoing maintenance.

## Required Documentation

Complete:

- `README.md`
- `.env.example`
- `docs/setup/local-development.md`
- `docs/deployment/production.md`
- `docs/deployment/web-server.md`
- `docs/deployment/ssl-and-domain.md`
- `docs/deployment/queue-worker.md`
- `docs/deployment/scheduler.md`
- `docs/deployment/storage.md`
- `docs/deployment/cache.md`
- `docs/deployment/email.md`
- `docs/deployment/backups.md`
- `docs/deployment/restore-test.md`
- `docs/deployment/monitoring.md`
- `docs/deployment/logging.md`
- `docs/deployment/rollback.md`
- `docs/deployment/release-checklist.md`
- `docs/admin/cms-user-guide.md`

## Deployment Requirements

Document and validate:

- PHP extensions
- MySQL requirements
- Node/build requirements
- Environment variables
- Production `APP_ENV` and debug settings
- Composer install flags
- Asset build
- Migration strategy
- Seed strategy
- Storage linking or object storage
- File permissions
- Queue workers
- Scheduler
- Cache warmup
- Config/route/view caching
- Web-server compression
- Browser cache headers
- HTTPS
- Security headers
- Email delivery
- DNS assumptions
- Health checks
- Log rotation
- Error monitoring
- Backups
- Restore procedure
- Rollback procedure
- Zero- or low-downtime deployment approach
- Maintenance mode behavior

## Admin Guide

Document how an authorized user can:

- Sign in and reset password
- Add and publish a product
- Manage categories and collections
- Upload and reorder images
- Update homepage sections
- Update banners
- Update About and Craftsmanship content
- Update contact details and social links
- Review and update inquiries
- Export inquiries
- Manage SEO
- Manage redirects
- Manage users according to permission

## Acceptance Criteria

- A fresh environment can be deployed from documentation.
- Backup and restore instructions are testable.
- Queue and scheduler operations are documented.
- Rollback steps are explicit.
- Production security settings are clear.
- CMS guide covers every routine operation.
- No documentation references nonexistent commands or files.

End with the mandatory stage completion report and stop.
