# Stage 15 — Automated Testing, Cross-Browser QA, and Content QA

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

Execute the full test strategy, fix defects, and prove that the system is ready for deployment.

## Automated Test Requirements

Run and complete:

- Unit tests
- Feature tests
- Policy tests
- Form Request tests
- Authentication tests
- CMS CRUD tests
- Publishing tests
- Slug and redirect tests
- Media upload and processing tests
- Inquiry tests
- Search and filter tests
- Export tests
- SEO tests
- Sitemap tests
- Inertia page/prop tests
- Critical React component tests
- End-to-end smoke tests
- Accessibility automation
- Production build tests

## Manual QA

Test:

- Desktop
- Laptop
- Tablet portrait and landscape
- Small and large mobile
- Large desktop
- Ultra-wide

Browsers:

- Current Chrome
- Current Edge
- Current Firefox
- Current Safari where available
- Mobile Safari
- Chrome on Android

## Content QA

Verify:

- No placeholder or invented content
- No broken images
- Correct alt text
- Correct phone/email/WhatsApp links
- Correct map
- Correct legal links
- Consistent product fields
- Consistent capitalization and punctuation
- Meta title and description uniqueness
- No accidental draft content
- No empty required section
- No duplicate slugs
- No lorem ipsum
- No test inquiries or demo users in production data

## Defect Handling

For every defect record:

- Severity
- Steps to reproduce
- Expected result
- Actual result
- Fix
- Regression test
- Validation evidence

## Acceptance Criteria

- All critical and high-priority tests pass.
- No severity-one or severity-two defect remains.
- All pages and actions work across the approved browser matrix.
- Content QA passes.
- Production build is clean.
- Test documentation matches actual commands and results.

End with the mandatory stage completion report and stop.
