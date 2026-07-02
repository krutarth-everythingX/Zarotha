# Performance Plan

## Objectives

- Keep the public site image-led, fast, and low-JavaScript.
- Keep admin pages operationally responsive under Inertia.
- Prevent unnecessary bundle crossover between public and admin surfaces.

## Public Performance Strategy

- Server-render first.
- Ship only the public Vite entry on public pages.
- Use Stage 10 responsive image variants instead of full originals for cards and most gallery views.
- Reserve priority loading for homepage hero media and the primary product image.
- Lazy-load below-the-fold imagery.
- Keep motion lightweight and reduced-motion friendly.

## Admin Performance Strategy

- Keep admin isolated to the admin bundle.
- Use paginated list screens for products, media, inquiries, redirects, users, and activity.
- Avoid oversized Inertia payloads by sending only data needed by the current screen.

## Query Efficiency

- Public home, products index, product detail, inquiry list, and media list should avoid N+1 queries through eager loading where needed.
- Related products are category-based and limited in count.
- Track query counts on the homepage, catalogue, product detail, media list, and inquiry list during review passes.

## Image Strategy

- Serve responsive processed variants from the approved media pipeline.
- Provide width and height metadata to reduce layout shift.
- Do not use original uploads for product cards unless no processed derivative exists and the fallback is temporary.

## Font And Asset Strategy

- Keep the public typographic stack disciplined.
- Avoid unnecessary third-party scripts.
- Keep admin-ui-kit reuse local to the app code without loading the source reference directory in the public experience.

## Delivery Risks

- Large client-supplied imagery remains the primary public performance risk.
- Homepage section sprawl can increase LCP and total transfer size.
- Media-heavy admin screens can slow if payloads are not kept paginated and scoped.
