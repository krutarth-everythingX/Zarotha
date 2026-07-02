# ERD

## Entity Relationship Diagram

```mermaid
erDiagram
    roles ||--o{ users : assigns
    users ||--o{ products : creates
    users ||--o{ collections : creates
    users ||--o{ pages : creates
    users ||--o{ media_assets : uploads
    users ||--o{ inquiries : assigned_to
    users ||--o{ inquiry_activities : acts_on
    users ||--o{ redirects : creates
    users ||--o{ activity_logs : triggers

    categories ||--o{ products : classifies
    collections ||--o{ collection_product : groups
    products ||--o{ collection_product : belongs_to

    products ||--o{ product_media : has_gallery
    media_assets ||--o{ product_media : attached_as
    media_assets ||--o{ media_variants : derives

    media_assets ||--o{ products : featured_or_og
    media_assets ||--o{ collections : cover_or_og
    media_assets ||--o{ pages : hero_or_og
    media_assets ||--o{ hero_banners : renders
    media_assets ||--o{ homepage_sections : decorates
    media_assets ||--o{ why_choose_us_items : icons
    media_assets ||--o{ craftsmanship_steps : illustrates
    media_assets ||--o{ site_settings : default_og

    homepage_sections ||--o{ homepage_featured_collection_items : curates
    homepage_sections ||--o{ homepage_featured_product_items : curates
    homepage_sections ||--o{ why_choose_us_items : contains

    collections ||--o{ homepage_featured_collection_items : featured
    products ||--o{ homepage_featured_product_items : featured

    pages ||--o{ craftsmanship_steps : contains

    products ||--o{ inquiries : references
    inquiries ||--o{ inquiry_activities : records
```

## Relationship Notes

- Products have one required category and zero or more collections.
- Collections curate products through `collection_product`, which includes explicit ordering.
- Products use `featured_media_id` for the primary image and `product_media` for ordered galleries.
- Static pages are fixed-route records keyed by `page_key`.
- Homepage section configuration is typed enough for launch and uses specific child tables for curated collection and product lists.
- Redirects are path-based rather than strictly entity-bound so slug history remains flexible across route types.
