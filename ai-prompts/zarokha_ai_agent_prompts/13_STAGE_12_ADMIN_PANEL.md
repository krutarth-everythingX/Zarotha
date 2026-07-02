# Stage 12 — React + Inertia Admin Panel Implementation

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

Implement the complete CMS interface using React, Inertia.js, TypeScript, and the supplied admin UI kit.

## Non-Negotiable UI Rule

Inspect and reuse the supplied UI kit. Do not replace its design language, recreate existing primitives, or introduce a competing component library. Correct accessibility or functional defects with minimal visual disruption.

## Required Modules

- Dashboard
- Products
- Categories
- Collections
- Product galleries
- Media library
- Homepage management
- Banner management
- About page
- Craftsmanship page
- Contact information
- Inquiries
- SEO
- Redirects
- Users and permissions
- Settings
- Activity history if approved

## Dashboard

Implement:

- Quick statistics
- Recent products
- Recent inquiries
- Recent activity
- System status that reports only safe operational information
- Useful empty states
- Links to common actions

Do not show invented business metrics.

## React Architecture

Use:

- Strict TypeScript
- Typed Inertia page props
- Reusable feature components
- Shared form controls from the UI kit
- Feature-specific hooks
- Predictable form state
- Accessible dialogs and drawers
- Loading, success, warning, empty, and error states
- Lazy loading for suitable admin routes
- No duplicated CRUD form logic
- No `any` unless documented and unavoidable

## Forms

Support:

- Client-side usability validation
- Server-authoritative validation
- Unsaved-change protection where useful
- Accessible error summaries
- Field-level errors
- Disabled/submitting states
- Success feedback
- Destructive-action confirmation
- Correct focus movement after errors or dialogs

## Tables and Lists

Support approved:

- Search
- Filtering
- Sorting
- Pagination
- Bulk actions only where approved
- Status badges
- Responsive behavior
- Keyboard access
- Empty states
- Error states

## Tests and Validation

Run:

- Type check
- Lint
- Production build
- Inertia feature tests
- React component tests for critical reusable interactions
- End-to-end CMS smoke tests
- Keyboard checks
- Console error checks
- Permission checks

## Acceptance Criteria

- Every required CMS module is operational.
- The supplied UI kit is consistently used.
- All forms and lists have complete states.
- Permissions are reflected in visible actions and enforced server-side.
- No TypeScript errors, console errors, warnings, dead code, or unused imports remain.
- Admin routes are code-split where valuable and practical.

End with the mandatory stage completion report and stop.
