# Future Expansion

## Expansion Principles

- Launch architecture must stay clear for non-ecommerce catalogue scope.
- Future modules should fit beside, not through, the current catalogue and inquiry core.
- Folder names, route names, and service boundaries should not make later ecommerce work confusing.

## Planned Extension Areas

### Cart

- Add as a separate public module with dedicated actions, policies if needed, and route grouping.
- Do not let current inquiry workflows pretend to be cart behavior.

### Orders

- Add as a distinct domain with its own write workflows, status enums, policies, exports, and admin screens.

### Payments

- Add behind dedicated services and gateway integrations rather than embedding payment logic into catalogue controllers.

### Inventory

- Add through dedicated stock models, services, and admin modules, not by overloading product publication fields.

### Multilingual Content

- Add through content-layer expansion strategies that keep current route and SEO behavior understandable.
- Public rendering and CMS editing boundaries should stay adaptable for translated fields later.

### Blog Or Editorial Publishing

- Add as a separate public content module with its own routes, SEO rules, and CMS editing flows.

## Current Extension Points

- Separate route files for public and admin concerns.
- Structured content models for products, collections, static pages, and settings.
- Services, actions, and DTO boundaries ready for broader workflows.
- Queue, cache, export, and SEO support layers that can grow independently of templates.

## What Not To Do Now

- Do not overload collections to simulate blog or campaign systems.
- Do not overload product fields to simulate inventory or order states.
- Do not introduce fake ecommerce route names or folder names before the feature exists.
