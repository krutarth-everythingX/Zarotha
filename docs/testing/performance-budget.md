# Performance Budget

## Public Web Vitals Targets

| Metric | Budget | Measurement Approach |
| --- | --- | --- |
| LCP | `<= 2.5s` on production-like test runs | Lighthouse and real-browser synthetic checks |
| INP | `<= 200ms` target, `<= 250ms` absolute ceiling | Browser interaction profiling and production-like checks |
| CLS | `< 0.1` | Layout-shift auditing on representative pages |
| TTFB | `<= 600ms` target on production-like infrastructure | Server timing and synthetic checks |

## Asset Budgets

| Budget Item | Budget |
| --- | --- |
| Initial public JavaScript | `<= 90 KB` compressed target |
| Initial public CSS | `<= 70 KB` compressed target |
| Largest hero image | `<= 350 KB` optimized delivery target |
| Product-card image | `<= 120 KB` optimized delivery target |
| Primary product-detail image | `<= 500 KB` optimized delivery target for first visible asset |
| Total font files on first public page | `<= 2` files and `<= 180 KB` combined target |
| Total above-the-fold requests | `<= 25` on key public landing pages |

## Admin Budgets

| Budget Item | Budget |
| --- | --- |
| Admin route initial chunk | `<= 250 KB` compressed target on core routes |
| Per-admin-route additional chunk | `<= 150 KB` compressed target |
| Products index query count | target `<= 12` queries |
| Product detail CMS edit query count | target `<= 20` queries |
| Inquiries index query count | target `<= 12` queries |

## Measurement Stages

### Development

- Use manual audits and query logging for directional enforcement.

### CI

- Enforce asset-size ceilings and selected route performance checks where feasible.

### Production-Like Testing

- Re-test representative public and admin routes using optimized builds, representative content, and realistic device profiles.

## Budget Notes

- Budgets are intentionally ambitious but realistic for a Blade-first catalogue site.
- Product imagery remains the highest risk to public budgets.
- If a budget is missed, the project should document why and what trade-off was accepted before release.
