# Color System

## Color Strategy

- The system is built around semantic roles and tonal behavior, not final brand hex values.
- Final logo and brand palette remain client dependencies, so the public UI should be prepared to accept approved accent values later.
- Structural neutrals may still be defined and implemented independently of the final brand kit.

## Tonal Families

### Warm Neutral Base

- Use parchment, sand, oat, stone, and deep-ink style roles for most surfaces and text.
- Backgrounds should feel warm rather than stark white.
- Border treatments should stay low contrast unless a state or structure truly needs emphasis.

### Wood Accent Family

- Use a restrained wood-inspired accent family for CTA emphasis, hover warmth, focal dividers, and subtle highlight states.
- The accent should feel material and grounded, not saturated or ornamental.
- Final hue selection remains pending client palette approval.

### Inverted Surface Family

- Use deep espresso or ink-like surfaces for footer, overlays, and select editorial breaks.
- Inverse surfaces must preserve accessible contrast and should remain limited.

## Semantic Mapping

| Semantic Role | Visual Intent | Typical Surfaces |
| --- | --- | --- |
| Canvas | Warm base page plane | Main background |
| Surface 1 | Primary content layer | Page sections, cards |
| Surface 2 | Elevated content layer | Overlays, filter panel, gallery lightbox framing |
| Inverse Surface | Deep anchoring plane | Footer, dark editorial strip |
| Accent | Inquiry emphasis | Buttons, active controls, key links |
| Accent Soft | Warm hover tint | Hover surfaces, chips, subtle highlights |
| Success | Calm completion state | Form success |
| Warning | Caution without panic | Deferred or unavailable states |
| Error | Clear correction state | Validation and failure messaging |

## Contrast Rules

- Primary text must meet strong readable contrast against all default surfaces.
- Accent buttons must meet accessible contrast in default, hover, focus, and disabled states.
- Active states cannot rely on color alone.
- Muted metadata can be quieter, but not to the point of unreadability.

## Public Versus Admin

- Public-site color roles are editorial and atmospheric.
- Admin color use should remain aligned with the kit and should not be reskinned to match the public site.
- Only accessibility-related fixes should adjust the admin kit’s color behavior.
