# Non-Functional Requirements

## Performance

- The final implementation should target Lighthouse scores above 95 where realistically measurable on production-like pages.
- Product and collection imagery must support responsive delivery, modern formats where reliable, explicit dimensions, and below-the-fold lazy loading.
- The public experience must prioritize fast first render, low layout shift, and disciplined asset loading.
- Admin assets should be code-split and kept separate from public assets.

## Accessibility

- The final site should aim for WCAG 2.2 AA.
- Public pages and CMS interactions must support keyboard access, visible focus states, semantic structure, sufficient contrast, and screen-reader-friendly labeling.
- Forms, galleries, navigation, dialogs, and any sliders must be operable without a pointer.

## SEO

- Public pages must support human-readable URLs, unique metadata, canonical control, structured data, XML sitemap support, and correct status codes.
- Internal or admin pages must not be indexable.
- Redirect handling for changed slugs must be planned in architecture before implementation.

## Security

- Authentication, authorization, validation, CSRF protection, output escaping, and rate limiting must be enforced in implementation.
- Uploads and exports are sensitive surfaces and require validation, abuse prevention, and auditability.
- Sensitive admin changes should have activity history where appropriate.

## Privacy And Compliance

- Inquiry data collection must be limited to justified business needs.
- Privacy policy and consent copy depend on approved legal content.
- IP or abuse-prevention metadata should be stored only if justified and privacy compliant.

## Reliability

- Public browsing and inquiry submission should remain usable under normal production traffic for a catalogue site.
- Media handling, inquiry storage, and SEO-critical routes must be treated as core reliability surfaces in later stages.

## Maintainability

- The codebase should remain a modular Laravel monolith with clear separation between public and admin concerns.
- Documentation, architecture decisions, and progress tracking must remain current throughout the project.
- CMS configuration should reduce the need for code changes for routine content updates.

## Editorial Quality

- The public site must feel premium, warm, calm, handcrafted, and editorial rather than generic or corporate.
- The admin UI kit must be reused later without redesign.
- Public content quality depends on strong imagery and approved brand copy, making content readiness a delivery-critical dependency.

## Delivery Constraints

- Stage 1 produces documentation only.
- No application code, Laravel structure, or admin kit changes are allowed in this stage.
