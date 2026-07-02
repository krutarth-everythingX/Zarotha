# Stage 10 — Secure Media Library and Image Processing Pipeline

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

Implement secure, reusable, optimized media handling for product photography and CMS imagery.

## Required Features

- JPG, JPEG, PNG, and WebP input
- Content-based MIME validation
- File-size and dimension limits
- Randomized storage names
- Metadata storage
- Alt text
- Caption where approved
- Media library search and filtering
- Drag-and-drop upload in admin
- Upload progress
- Replace
- Delete with reference protection
- Reorder product gallery images
- Featured-image selection
- Automatic thumbnail generation
- Responsive variants
- WebP output
- Optional AVIF only if reliably supported by the selected stack
- Queue-based processing where appropriate
- Failed-job handling
- Orphan cleanup strategy
- Safe SVG policy: reject by default unless a sanitizer and explicit business need are approved

## Image Variant Plan

Implement the approved named sizes for:

- Hero banners
- Collection cards
- Product cards
- Product detail gallery
- Thumbnails
- Social preview images when generated

Preserve aspect ratios according to approved crop rules.

## Security Requirements

- Do not trust extensions.
- Reject executable or polyglot content.
- Do not render unprocessed uploads directly.
- Avoid user-controlled storage paths.
- Protect private originals if the approved storage plan requires it.
- Apply authorization to upload, replace, delete, and browse.
- Rate limit uploads.
- Log upload failures.
- Document malware scanning integration for production.

## Performance Requirements

- Avoid processing large images in the web request when queues are available.
- Strip unnecessary metadata unless business needs require retention.
- Set width and height metadata.
- Use appropriate quality settings without visibly degrading luxury product photography.
- Ensure public image markup supports `srcset` and `sizes`.

## Tests

Add tests for:

- Valid files
- Invalid MIME
- Oversized files
- Corrupt images
- Unauthorized uploads
- Replacement
- Deletion constraints
- Variant generation
- Gallery sorting
- Queue failures
- Orphan cleanup

## Acceptance Criteria

- Uploading, replacing, deleting, selecting, and sorting media work.
- Invalid files are rejected safely.
- Responsive variants are generated.
- Product pages can render optimized responsive images.
- No public page uses unoptimized original uploads by default.
- All media tests pass.

End with the mandatory stage completion report and stop.
