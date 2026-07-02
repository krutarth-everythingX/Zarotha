# Test Strategy

## Strategy Goals

- Cover the catalogue, inquiry workflow, CMS operations, SEO-critical infrastructure, and approval-gated quality requirements.
- Keep testing layered so critical workflows have both focused and end-to-end coverage where valuable.
- Prevent implementation drift across Stages 1 through 7.

## Test Layers

### Unit Tests

- Small pure logic boundaries such as query normalization, slug rules, redirect loop detection, pagination helpers, metadata builders, and CSV sanitization helpers when created.

### Feature Tests

- Public route responses
- CMS CRUD flows
- Publication-state behavior
- Redirect resolution
- Sitemap generation
- Contact and product inquiry submissions

### Policy Tests

- Role-specific access to products, categories, collections, inquiries, redirects, users, settings, and exports.

### Form Request Tests

- Public inquiry validation
- Public search query validation
- Admin create and update validation across major content modules
- Export filter validation

### Public Route Tests

- Correct status codes, publication-state handling, redirects, and not-found behavior for all public pages.

### CMS CRUD Tests

- Products, categories, collections, banners, homepage sections, static pages, contact settings, redirects, and users.

### Inquiry Workflow Tests

- Contact inquiry creation
- Product-specific inquiry creation
- Status transitions
- Notes
- Assignment
- Export authorization and output safety

### Media Tests

- Upload validation
- Reference-safe deletion behavior
- Gallery ordering determinism
- Derived-asset metadata if implemented later

### SEO Tests

- Metadata fallbacks
- Canonicals
- Robots behavior
- Structured data presence on key routes

### Sitemap Tests

- Published content inclusion
- Draft, archived, redirected, and admin exclusion

### Redirect Tests

- Historical slug redirect behavior
- Duplicate source-path prevention
- Loop prevention

### Inertia Page And Prop Tests

- Typed prop expectations
- Filter and pagination shapes
- Shared auth and flash data

### React Component Tests Where Valuable

- Only where behavior is non-trivial and worth isolated verification.
- Do not create component tests by habit for every simple wrapper.

### End-To-End Smoke Tests

- Public browse-to-inquiry path
- Admin sign-in
- Product publish flow
- Inquiry management path
- Redirect and not-found sanity checks

### Accessibility Tests

- Keyboard flows
- Dialog and mobile-menu behavior
- Form labeling and focus states
- Reduced-motion handling where testable

### Performance Tests

- Public Lighthouse-style checks on representative pages
- Asset-size threshold checks
- Key query-count checks

### Security Regression Tests

- Permission denial paths
- CSRF expectations
- Rate-limited endpoints
- Export safety
- Upload rejection paths

## Final Planning Gate

Stages 1 through 7 now define scope, IA, architecture, schema, routing, design system, and measurable quality plans in enough detail to begin implementation without major architectural improvisation, subject to remaining client content dependencies and hosting-dependent operational choices.
