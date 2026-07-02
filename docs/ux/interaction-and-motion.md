# Interaction And Motion

## Motion Principles

- Motion should reveal hierarchy, not decorate everything.
- Use opacity and transform first.
- Never block core browsing or inquiry actions with long animations.
- Respect `prefers-reduced-motion` everywhere.

## Motion Tokens

| Token | Suggested Range | Use |
| --- | --- | --- |
| `motion.duration.fast` | `120ms` to `160ms` | Hover and button feedback |
| `motion.duration.base` | `220ms` to `320ms` | Standard reveal and drawer transitions |
| `motion.duration.slow` | `420ms` to `650ms` | Hero media or editorial image reveal |
| `motion.ease.standard` | smooth ease-out | General UI transitions |
| `motion.ease.exit` | ease-in | Dismiss and close states |
| `motion.ease.emphasis` | soft cubic-bezier emphasis | Premium hero or image reveal |

## Public Interaction Patterns

### Page Entry

- Use a restrained opacity and slight vertical settle for hero text and primary content blocks.
- Avoid full-page blocking loaders for ordinary navigation.

### Scroll Reveal

- Use staggered reveal for section groups, cards, or process steps only where it improves rhythm.
- Do not animate every card in long product lists.

### Image Reveal

- Hero and large editorial images may use masked reveal, fade, or gentle scale settle.
- Product-detail primary media should feel crisp and immediate rather than theatrical.

### Button Micro-Interactions

- Use subtle background shift, shadow shift, or translateY change under `2px`.
- Focus and hover states must remain visible without relying only on motion.

### Product Card Hover

- Allow a slight lift, image zoom under `1.03`, or shadow deepen on pointer devices.
- Touch devices should not depend on hover for information access.

### Navigation

- Mobile menu should slide or fade in cleanly with no layout jump.
- Sticky header transitions should be subtle and not resize aggressively.

### Dialogs And Lightbox

- Use fade and scale or fade and slide combinations.
- Keep entry and exit fast enough to preserve control.

## Reduced Motion Rules

- Replace motion-heavy reveals with simple opacity changes or no animation.
- Disable parallax and scale-based image motion when reduced motion is requested.
- Keep interaction timing near-instant while preserving clear state changes.

## Motion Non-Goals

- No autoplay counters unless real numeric content exists.
- No decorative parallax on every section.
- No continuous floating or looping ornament motion.
