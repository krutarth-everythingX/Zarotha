# Public Component Inventory

## Principles

- Public pages should be composed from reusable, accessible Blade components and layout sections.
- Components should support an inquiry-first catalogue, not ecommerce flows.
- Collection-specific components are removed from launch scope.

## Components

### Announcement Or Contact Strip

- Optional top strip for approved contact cues.

### Header

- Brand, primary navigation, and inquiry-oriented utility actions.

### Desktop And Mobile Navigation

- Shared route set: Home, Products, About Us, Our Craftsmanship, Contact.

### Hero

- Editorial visual, restrained copy, and one or two inquiry-safe CTAs.

### Section Heading

- Reusable heading block for homepage and static sections.

### Product Card

- Image, product name, category, short summary, and detail CTA.

### Product Grid

- Responsive grid wrapper for product cards and pagination context.

### Filters And Search Controls

- Search input, category filter, sort selector, active-filter summary, and clear action.

### Product Gallery

- Primary image, thumbnails, zoom or lightbox trigger, and keyboard support.

### Breadcrumbs

- Used on product detail and optionally on some static pages.

### Specification List

- Label-value layout for dimensions, material, finish, weight, and related factual fields.

### Related Products

- Category-based recommendation strip or grid.

### Craftsmanship Timeline Or Sections

- Ordered process content for homepage preview or full page layout.

### Inquiry CTA

- Shared contact conversion block.

### Contact Form

- Labeled inputs, validation feedback, and success state.

### Footer

- Navigation, legal links, contact details, and social links when approved.

### Empty State

- Used for no products or no matching results.

### Error State

- Used for not-found or degraded public responses without exposing technical details.

### Pagination

- Touch-friendly and keyboard-accessible pagination controls.

## Page Composition Summary

| Page | Core Components |
| --- | --- |
| Home | Header, Hero, Section Heading, Product Card, Craftsmanship content, Inquiry CTA, Footer |
| Products Index | Header, Filters and Search, Product Grid, Empty State, Pagination, Footer |
| Product Detail | Header, Breadcrumbs, Product Gallery, Specification List, Inquiry CTA, Related Products, Footer |
| About | Header, Section Heading, editorial content, Inquiry CTA, Footer |
| Craftsmanship | Header, Section Heading, process content, CTA, Footer |
| Contact | Header, Section Heading, Contact Form, contact shortcuts, Footer |
| Privacy and Terms | Header, long-form text layout, Footer |
| 404 | Header, Error State, recovery links, Footer |
