# Migration Order

## Goals

- Keep migration order executable.
- Avoid circular foreign-key dependencies.
- Create lookup and parent tables before dependents.

## Proposed Order

1. `roles`
2. `users`
3. `password_reset_tokens`
4. `categories`
5. `media_assets`
6. `media_variants`
7. `collections`
8. `pages`
9. `site_settings`
10. `contact_information`
11. `social_links`
12. `products`
13. `collection_product`
14. `product_media`
15. `hero_banners`
16. `homepage_sections`
17. `homepage_featured_collection_items`
18. `homepage_featured_product_items`
19. `why_choose_us_items`
20. `craftsmanship_steps`
21. `inquiries`
22. `inquiry_activities`
23. `redirects`
24. `activity_logs`

## Circular-Dependency Notes

- `media_assets` is created before content tables that reference media.
- `products` comes after `categories`, `users`, and `media_assets` because it references all three.
- `collection_product` waits until both `collections` and `products` exist.
- `craftsmanship_steps` waits until `pages` exists.
- `inquiry_activities` waits until `inquiries` exists.
- `redirects` avoids foreign keys to target entities, which removes a multi-entity cycle and matches the chosen path-based redirect strategy.

## Driver-Dependent Migrations Deferred

- Session table migration if database sessions are chosen later.
- Queue table migrations if database queues are chosen later.
- Cache table migrations if database cache is chosen later.

## Implementation Note

- Do not create migrations mechanically from this order alone; actual migrations should reflect the approved use criteria and final hosting choices where relevant.
