# Stage 4 — Database Schema and Domain Model

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

Design the complete normalized MySQL schema, model relationships, indexes, statuses, deletion behavior, and migration order before writing migrations.

## Deliverables

Create:

- `docs/architecture/database.md`
- `docs/architecture/erd.md`
- `docs/architecture/model-catalog.md`
- `docs/architecture/index-strategy.md`
- `docs/architecture/data-retention.md`
- `docs/architecture/migration-order.md`
- ADRs for schema decisions that affect future extensibility

## Required Core Entities

At minimum evaluate and define:

- Users
- Roles and permissions or a simpler policy-backed role model
- Categories
- Collections
- Products
- Product-category relationship if multiple categories are allowed
- Collection-product relationship
- Product media/gallery ordering
- Media library
- Hero banners
- Homepage sections/items
- Craftsmanship steps
- Why-choose-us items
- Page content
- Contact information
- Social links
- Inquiries
- Inquiry notes or activity
- SEO metadata
- Redirects for changed slugs
- Settings
- Activity/audit logs where justified

## Product Schema Requirements

Support:

- Name
- Unique slug
- Short description
- Full description
- Dimensions
- Material
- Finish
- Featured image
- Ordered gallery
- Category
- Collections
- Status
- Publication date
- Sort order
- Featured flag
- Best-selling editorial flag
- Latest behavior
- SEO fields
- Open Graph image
- Created by
- Updated by
- Soft delete decision
- Timestamps

## Schema Decisions to Explain

- Category hierarchy or flat taxonomy
- Whether a product can have multiple categories
- Collection behavior
- Slug uniqueness and history
- Draft/published/archived behavior
- Soft deletion
- Media reuse
- Media variants
- Global versus page-specific SEO fields
- Flexible settings versus typed tables
- Inquiry privacy retention
- Audit history
- Sorting
- Database collation
- Text column choices
- Foreign-key delete behavior
- Indexes for public lists, admin filters, search, sitemap, and latest/featured queries

## Future-Readiness Rules

The current schema must not implement ecommerce, but it must avoid blocking future:

- Product variants
- Prices
- Inventory
- Orders
- Payments
- Multiple languages
- Blog content

Do not add unused ecommerce tables now.

## Required ERD Quality

For every table specify:

- Columns and data types
- Nullability
- Default values
- Unique constraints
- Foreign keys
- Indexes
- Relationships
- Cascade/restrict/set-null behavior
- Data ownership
- Expected row volume
- Sensitive-data classification

## Acceptance Criteria

- All CMS entities map to tables or justified configuration.
- Public queries have indexes.
- Slug changes have a redirect/history strategy.
- Media ordering and replacement are fully modeled.
- Inquiry statuses and audit behavior are modeled.
- No generic JSON “catch-all” replaces important typed data.
- Migration order is executable and free of circular dependency.

End with the mandatory stage completion report and stop.
