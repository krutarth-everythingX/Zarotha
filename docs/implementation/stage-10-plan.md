# Stage 10 Implementation Checklist

## Objective

Implement secure media upload, metadata management, responsive WebP derivative generation, reference-safe deletion, and product gallery workflows for the approved inquiry-based catalogue.

## Scope Guardrails

- No ecommerce, cart, checkout, order, payment, shipping, inventory, or customer-account functionality.
- No final public website implementation.
- No complete Stage 12 admin interface redesign.
- Keep the supplied `admin-ui-kit/` folder unchanged.
- Preserve all approved Stage 9 domain behavior.
- Do not render unprocessed original uploads on public pages.
- Reject SVG uploads by default.

## Implementation Checklist

1. Add media configuration for accepted MIME types, size limits, dimensions, variant names, quality, processor command, storage directories, and malware-scanner documentation hook.
2. Add media authorization, Form Requests, admin routes, and rate limiting for browse, upload, metadata update, replace, and reference-safe delete.
3. Add product gallery routes, Form Requests, and controller actions for attach, detach, reorder, and featured-image selection.
4. Add a focused media service for storage names, metadata persistence, reference checks, replacement, and queued processing dispatch.
5. Add a queued derivative-generation job and processor script that creates WebP variants with stable dimensions and records `media_variants`.
6. Add media model helpers/relationships for variant URLs, references, product galleries, and safe public responsive image payloads.
7. Add thin but functional Inertia pages for media upload/progress and product gallery route resolution without completing the full admin UI.
8. Add tests for valid uploads, invalid MIME, oversized files, corrupt images, unauthorized uploads, replacement, deletion constraints, variant generation, gallery sorting, queue failure handling, and orphan cleanup strategy.
9. Run the Stage 10 validation gate: Composer validation, optimize clear, MySQL migrate/seed, route list, tests, Pint, PHPStan, npm typecheck, lint, and build.

## Processing Decision

The current PHP runtime has `fileinfo` and `exif`, but no `gd` or `imagick`, and no ImageMagick CLI is available. Stage 10 therefore uses Laravel for validation, authorization, storage, and queue orchestration, with `sharp` as a small Node-backed derivative encoder invoked by the queued job. This preserves real JPG, JPEG, PNG, and WebP decoding plus WebP output without pretending unavailable PHP image extensions exist.

## Production Operations Notes

- Queue workers must run media derivative jobs in production.
- The processor command remains configurable through `MEDIA_PROCESSOR_COMMAND`.
- Malware scanning remains a documented integration point and is not silently faked in this stage.
