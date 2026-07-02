# Responsive Breakpoints

## Viewport Classes

| Class | Width Range | Primary Intent |
| --- | --- | --- |
| Small mobile | `0` to `389px` | Single-column essential browsing |
| Large mobile | `390px` to `599px` | Improved card density and form comfort |
| Tablet portrait | `600px` to `767px` | Transitional multi-column layouts |
| Tablet landscape | `768px` to `1023px` | Expanded grids, side-by-side blocks |
| Laptop | `1024px` to `1279px` | Full navigation and broad catalogue layouts |
| Desktop | `1280px` to `1535px` | Standard editorial desktop experience |
| Large desktop | `1536px` to `1919px` | More generous whitespace, wider gallery framing |
| Ultra-wide | `1920px+` | Width caps protect readability and composition |

## Navigation Behavior

- Small and large mobile: off-canvas mobile navigation with focus trapping.
- Tablet portrait: mobile navigation pattern may remain.
- Tablet landscape and above: transition toward desktop nav if layout remains calm.
- Sticky behavior must never cover headings or focus targets.

## Grid Changes

- Small mobile: single-column content, optional two-column compact product cards only if width allows.
- Large mobile: product cards may shift to two-up when touch targets remain comfortable.
- Tablet portrait: collections and products can adopt two-column grids.
- Tablet landscape: product grids can expand to three columns.
- Desktop and above: stable multi-column catalogue grids with larger gutters.

## Gallery Behavior

- Small mobile: stacked image gallery with swipe-friendly thumbnail or rail behavior.
- Tablet: primary image plus secondary selector beneath.
- Desktop: large primary image with thumbnail rail or secondary preview cluster.
- Lightbox must remain keyboard-usable and touch-dismissible without trapping users unexpectedly.

## Filter Behavior

- Small and large mobile: filter panel opens as a full-height sheet or drawer.
- Tablet portrait: drawer or collapsible panel remains acceptable.
- Laptop and above: filters may sit inline or in a left-side panel if density remains calm.

## Readability Rules

- Reading columns should cap well before ultra-wide edges.
- Long-form pages should not stretch across the full desktop width.
- Card text should truncate gracefully rather than wrapping into awkward tall blocks.

## Touch Interaction Rules

- Keep touch targets at least thumb-friendly on small screens.
- Avoid hover-only meaning on touch devices.
- Zoom, swipe, and gallery interactions should always have tap-accessible alternatives.
