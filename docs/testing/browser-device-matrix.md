# Browser And Device Matrix

## Public Coverage

| Environment | Coverage Level | Notes |
| --- | --- | --- |
| Chrome latest on desktop | Primary | Main development and QA target |
| Safari latest on macOS | Primary | Important for visual and media behavior |
| Firefox latest on desktop | Primary | Cross-engine layout and form behavior |
| Edge latest on desktop | Secondary | Chromium cross-check |
| Safari on current iPhone viewport classes | Primary | Mobile nav, gallery, inquiry flows |
| Chrome on current Android viewport classes | Primary | Mobile nav, filters, forms |
| iPad Safari | Secondary | Tablet gallery and layout checks |

## Admin Coverage

| Environment | Coverage Level | Notes |
| --- | --- | --- |
| Chrome latest on desktop | Primary | Main CMS target |
| Safari latest on desktop | Secondary | Key form and table flows |
| Firefox latest on desktop | Secondary | Inertia flow and control checks |
| Edge latest on desktop | Secondary | Chromium sanity |
| Mobile admin use | Limited support check | Validate sidebar, auth, and essential read tasks only |

## Viewport Classes To Test

- Small mobile
- Large mobile
- Tablet portrait
- Tablet landscape
- Laptop
- Desktop
- Large desktop
- Ultra-wide width cap behavior

## Device-Focused Scenarios

- Public mobile menu
- Public filters drawer
- Product gallery and lightbox
- Contact and inquiry forms
- Admin sidebar collapse or mobile dialog behavior
- Table horizontal overflow handling

## Assistive Technology Spot Checks

- Screen-reader spot checks on macOS and iOS where available
- Keyboard-only testing across desktop browsers
