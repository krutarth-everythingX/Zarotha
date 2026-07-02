# Stage 8 — Project Foundation, Tooling, Authentication, and Shared Infrastructure

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

Begin implementation only after Stages 1–7 are approved. Establish the production project foundation without yet completing all CMS modules.

## Required Implementation

- Install the latest stable Laravel version available at implementation time.
- Record exact PHP, Laravel, Node.js, npm/pnpm, Inertia, React, TypeScript, and MySQL requirements.
- Configure Vite for separate public and admin entry points.
- Configure strict TypeScript.
- Configure formatting, linting, and static analysis.
- Configure testing tools.
- Implement Laravel authentication for admin users.
- Implement admin route protection.
- Implement base roles/permissions according to the approved authorization plan.
- Implement shared Blade public layout.
- Integrate the supplied admin UI kit base layout without redesign.
- Implement global exception handling and user-safe error pages.
- Configure queues, cache, filesystem, mail, and logs through environment variables.
- Create `.env.example`.
- Create the approved folder structure.
- Add health-check behavior that does not expose sensitive details.
- Add base security headers according to the approved plan.
- Add project documentation and setup commands.

## Rules

- Do not add demo users to production seeding.
- A local-only development admin seeder may exist only if it is clearly environment-gated and documented.
- Do not hardcode secrets.
- Do not expose stack traces in production.
- Do not use CDN-hosted runtime dependencies unless approved.
- Do not replace the admin UI kit with a new component library.

## Validation

Run and report:

- Dependency installation
- Laravel test suite
- Static analysis
- PHP code style
- TypeScript type check
- JavaScript lint
- Production asset build
- Route inspection
- Configuration/cache smoke test
- Authentication feature tests

## Acceptance Criteria

- Fresh clone setup is documented and repeatable.
- Public and admin builds compile without warnings.
- Admin authentication works.
- Unauthorized users cannot access CMS routes.
- Strict TypeScript passes.
- No console errors on base pages.
- No secrets or local paths are committed.
- Project structure matches the approved architecture.

End with the mandatory stage completion report and stop.
