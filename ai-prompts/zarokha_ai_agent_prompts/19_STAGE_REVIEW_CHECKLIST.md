# Zarokha Wooden Arts — Stage Review Checklist

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

Use this file to review the agent's output before approving the next stage.

## Universal Checks for Every Stage

- [ ] The agent worked only on the requested stage.
- [ ] The stage objective was completed.
- [ ] All required deliverables exist.
- [ ] Decisions include reasons and trade-offs.
- [ ] No required item was silently skipped.
- [ ] No invented business content was introduced.
- [ ] Files created or changed are listed.
- [ ] Commands and validation results are shown.
- [ ] Risks and assumptions are explicit.
- [ ] The acceptance checklist is complete.
- [ ] The response ends with the required stop line.

## Planning Gate — Before Stage 8

Approve implementation only when all are true:

- [ ] Business scope is locked.
- [ ] Sitemap and page specifications are complete.
- [ ] CMS content model is complete.
- [ ] Technical architecture is approved.
- [ ] Folder structure is approved.
- [ ] Database schema and ERD are approved.
- [ ] Routes and controller map are approved.
- [ ] Authorization matrix is approved.
- [ ] Admin data contracts are approved.
- [ ] Public design system is approved.
- [ ] Admin UI kit mapping is approved.
- [ ] SEO plan is approved.
- [ ] Performance budget is approved.
- [ ] Accessibility plan is approved.
- [ ] Security plan is approved.
- [ ] Test strategy is approved.

## Implementation Review

### Foundation

- [ ] Fresh install works.
- [ ] Authentication works.
- [ ] Public/admin separation is correct.
- [ ] Type checking, linting, tests, and production build pass.
- [ ] Environment setup is documented.

### Backend

- [ ] All migrations match the approved schema.
- [ ] Every write action is validated.
- [ ] Every admin action is authorized.
- [ ] Publishing and slug behavior are correct.
- [ ] Caches invalidate correctly.
- [ ] No N+1 queries in key paths.

### Media

- [ ] Upload validation is secure.
- [ ] Variants and thumbnails are generated.
- [ ] Reordering, replacing, and deletion work.
- [ ] Public pages use optimized variants.
- [ ] Failed processing is handled.

### Public Website

- [ ] Every page is complete.
- [ ] Design feels premium and handcrafted.
- [ ] Mobile, tablet, desktop, and ultra-wide are intentional.
- [ ] Product gallery and zoom work.
- [ ] Inquiry and WhatsApp actions work.
- [ ] No placeholder or invented content appears.
- [ ] No broken links or console errors exist.

### Admin Panel

- [ ] Supplied UI kit is reused.
- [ ] Every CMS module works.
- [ ] All states are present: loading, empty, success, validation, failure.
- [ ] Permissions hide and block unauthorized actions.
- [ ] TypeScript is strict and error-free.

### SEO, Performance, Accessibility, Security

- [ ] Canonicals and metadata are correct.
- [ ] Structured data is valid.
- [ ] Sitemap and robots are correct.
- [ ] Performance budgets are met or exceptions are approved.
- [ ] Keyboard navigation passes.
- [ ] Reduced motion works.
- [ ] No critical accessibility defect remains.
- [ ] No critical/high security issue remains.

### Deployment

- [ ] Deployment steps are repeatable.
- [ ] Queue and scheduler are configured.
- [ ] Backups and restore are documented.
- [ ] Rollback is documented.
- [ ] Production debug is disabled.
- [ ] Monitoring and logs are configured.
- [ ] CMS handover guide is complete.
