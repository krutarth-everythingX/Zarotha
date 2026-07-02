# Sitemap

## Sitemap Principles

- The public website is a catalogue and inquiry experience.
- Categories are the active product taxonomy for launch.
- Collections are removed from launch scope and from the active sitemap.
- Product search lives within the Products index route.

## Primary Public Route Map

```text
/
|-- /products
|   |-- /products?search={query}
|   |-- /products?category={category-slug}
|   |-- /products?sort={sort-key}
|   \-- /products/{product-slug}
|-- /about-us
|-- /our-craftsmanship
|-- /contact
|-- /privacy-policy
|-- /terms-and-conditions
|-- /sitemap.xml
|-- /robots.txt
\-- 404
```

## Legacy Redirects

- `/collections` redirects permanently to `/products`
- `/collections/{collection-slug}` redirects permanently to `/products`

## Page Inventory

| Route | Page | Content Source | Notes |
| --- | --- | --- | --- |
| `/` | Home | CMS-managed homepage sections, banners, products, and settings | Main brand and conversion entry |
| `/products` | Products index | Published products plus taxonomy filters | Search, category filter, sorting, pagination |
| `/products/{product-slug}` | Product detail | Published product record | Main product inquiry page |
| `/about-us` | About Us | CMS page record | Brand story |
| `/our-craftsmanship` | Our Craftsmanship | CMS page record | Process narrative |
| `/contact` | Contact | CMS settings plus inquiry form | General inquiry conversion page |
| `/privacy-policy` | Privacy Policy | CMS page record | Legal content |
| `/terms-and-conditions` | Terms and Conditions | CMS page record | Legal content |
| `/sitemap.xml` | XML sitemap | System-generated | Includes only indexable routes |
| `/robots.txt` | robots | System-generated | Public crawl rules |
| `404` | Not Found | System error view | True `404` response |

## Search Results Behavior

- Search and filter states stay under `/products`.
- Empty states should guide visitors back to all products or alternative inquiry paths.
- Query-parameter states should remain index-safe and not create uncontrolled duplicate destinations.

## Secondary Behaviors

- Product detail pages include breadcrumbs.
- Legal pages remain reachable from the footer.
- WhatsApp, phone, and email shortcuts may appear on key conversion surfaces when configured.
