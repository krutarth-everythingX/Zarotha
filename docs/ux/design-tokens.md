# Design Tokens

## Token Strategy

- Use semantic token names so the public site can absorb the final approved brand palette later without renaming the system.
- Keep structural tokens stable even if client brand colors change.
- Treat all color-role values below as working UI direction, not final client brand facts.

## Token Groups

### Color Role Tokens

| Token | Purpose | Approval Dependency |
| --- | --- | --- |
| `color.canvas` | Main page background | Final tone may shift slightly with brand approval |
| `color.surface.1` | Primary content surface | Low |
| `color.surface.2` | Elevated cards and overlays | Low |
| `color.surface.inverse` | Inverted footer or dark overlay surfaces | Medium |
| `color.text.primary` | Main body text | Low |
| `color.text.secondary` | Supporting copy | Low |
| `color.text.muted` | Meta information | Low |
| `color.text.inverse` | Text on dark surfaces | Low |
| `color.border.soft` | Quiet separators | Low |
| `color.border.strong` | Stronger structural edge when needed | Low |
| `color.accent.wood` | Warm accent for CTAs, links, and focus-adjacent emphasis | High, final brand palette pending |
| `color.accent.wood.soft` | Hover or surface tint variant | High |
| `color.accent.ink` | Deep accent for strong headings or overlays | Medium |
| `color.state.success` | Success messaging | Low |
| `color.state.warning` | Warning messaging | Low |
| `color.state.error` | Error messaging | Low |
| `color.focus.ring` | Keyboard focus ring | Low, must preserve contrast |

### Typography Tokens

| Token | Purpose |
| --- | --- |
| `font.display` | Editorial serif for hero and major headings |
| `font.body` | Clean sans-serif for body and UI |
| `font.utility` | Optional utility text fallback using body family |
| `type.scale.display.xl` | Large hero headline |
| `type.scale.display.lg` | Section hero heading |
| `type.scale.heading.1` | Page heading |
| `type.scale.heading.2` | Section heading |
| `type.scale.heading.3` | Card and component heading |
| `type.scale.body.lg` | Intro paragraphs |
| `type.scale.body.md` | Standard body text |
| `type.scale.body.sm` | Secondary body text |
| `type.scale.meta` | Labels, breadcrumbs, metadata |

### Spacing Tokens

| Token | Purpose |
| --- | --- |
| `space.1` through `space.12` | Base spacing scale |
| `section.space.sm` | Compact section rhythm |
| `section.space.md` | Standard section rhythm |
| `section.space.lg` | Premium editorial section rhythm |
| `content.gutter.mobile` | Small-screen horizontal padding |
| `content.gutter.desktop` | Large-screen horizontal padding |
| `content.max.reading` | Long-form text width |
| `content.max.page` | General content width |
| `content.max.wide` | Gallery or card-grid width |

### Radius Tokens

| Token | Purpose |
| --- | --- |
| `radius.sm` | Small form elements or chips |
| `radius.md` | Cards and compact controls |
| `radius.lg` | Buttons, panels, overlays |
| `radius.xl` | Hero media frames and large surfaces |

### Shadow Tokens

| Token | Purpose |
| --- | --- |
| `shadow.none` | Flat surfaces |
| `shadow.soft` | Subtle lifted cards |
| `shadow.medium` | Dialogs and overlays |
| `shadow.image` | Editorial media layering when needed |

### Motion Tokens

| Token | Purpose |
| --- | --- |
| `motion.duration.fast` | Small hover or focus transitions |
| `motion.duration.base` | Standard reveal or fade |
| `motion.duration.slow` | Hero or image-entry motion |
| `motion.ease.standard` | Primary UI easing |
| `motion.ease.exit` | Exit easing |
| `motion.ease.emphasis` | Premium reveal easing |

### Layering Tokens

| Token | Purpose |
| --- | --- |
| `z.base` | Default flow |
| `z.sticky` | Sticky headers and contact shortcuts |
| `z.overlay` | Menus, drawers, lightboxes |
| `z.modal` | Dialogs and alerts |

## Token Governance

- Public tokens and admin tokens should remain separate.
- Admin visuals should inherit the kit rather than adopting public-site token styling.
- Public tokens should support dark overlays and inverted footer treatments even if the site does not ship a full dark theme.
