# Admin UI Kit Mapping

## Inspection Summary

The supplied kit already includes strong structural and form primitives based on Headless UI patterns, dark-mode support, and a consistent soft-neutral visual system. The implementation plan should reuse these components directly and fill only the missing workflow-specific gaps without redesigning the kit.

## Observed Existing Kit Pieces

### Layouts

- `auth-layout.tsx`
- `sidebar-layout.tsx`
- `stacked-layout.tsx`

### Navigation Shell

- `sidebar.tsx`
- `navbar.tsx`
- `link.tsx`

### Forms And Inputs

- `input.tsx`
- `textarea.tsx`
- `select.tsx`
- `combobox.tsx`
- `checkbox.tsx`
- `radio.tsx`
- `switch.tsx`
- `fieldset.tsx`
- `listbox.tsx`

### Data Display

- `table.tsx`
- `badge.tsx`
- `description-list.tsx`
- `heading.tsx`
- `text.tsx`
- `avatar.tsx`
- `divider.tsx`

### Card-Like Surfaces

- No dedicated named card component is visible in the supplied kit.
- Card-like presentation appears to come from layout containers, table wrappers, and form sections rather than a standalone card primitive.

### Overlays

- `dialog.tsx`
- `alert.tsx`
- `dropdown.tsx`

### Utility Components

- `button.tsx`
- `pagination.tsx`

## Theme Support

- The kit includes dark-mode classes throughout.
- Launch planning should preserve this support, even if the admin primarily ships in the provided default theme.
- Theme behavior should be reused, not reimplemented.

## Mapping By CMS Area

| CMS Area | Recommended Kit Pieces | Notes |
| --- | --- | --- |
| Login and password reset | `AuthLayout`, `Input`, `Button`, `Fieldset`, `Alert` | Auth shell already exists |
| Dashboard | `SidebarLayout` or `StackedLayout`, `Heading`, `Badge`, `DescriptionList`, `Table` | Use shell consistent with rest of CMS |
| Products list | `SidebarLayout`, `Table`, `Pagination`, `Dropdown`, `Badge`, `Button`, `Input`, `Select`, `Combobox` | Supports filters and status badges well |
| Product form | `Fieldset`, `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `Switch`, `Button`, `Dialog` | Multi-section editorial form |
| Categories and collections | `Table`, `Input`, `Textarea`, `Button`, `Dialog`, `Badge`, `Pagination` | Reorder UI may require lightweight wrappers |
| Gallery management | `Table` or card-list composition, `Dialog`, `Button`, `Badge` | No dedicated media grid component exists |
| Media library | `Table`, `Input`, `Dropdown`, `Dialog`, `Pagination`, `Badge` | File upload needs composed workflow |
| Homepage and banners | `Fieldset`, `Input`, `Textarea`, `Select`, `Combobox`, `Dialog`, `Button` | Section reordering may require simple drag or order controls later |
| Static pages | `Fieldset`, `Input`, `Textarea`, `Button` | Rich-text wrapper not present and should be added only if justified |
| Inquiries | `Table`, `DescriptionList`, `Badge`, `Dialog`, `Dropdown`, `Textarea`, `Pagination`, `Alert` | Good fit for inbox-style workflow |
| Redirects | `Table`, `Input`, `Select`, `Alert`, `Dialog`, `Pagination` | Conflict handling important |
| Users and settings | `Fieldset`, `Input`, `Select`, `Switch`, `Button`, `Alert` | Use existing quiet form language |

## Explicit Reuse Guidance

### Existing Layouts

- Use `AuthLayout` for login and password reset.
- Use `SidebarLayout` for most authenticated CMS pages.
- Use `StackedLayout` only when a page benefits from a lighter shell or reduced desktop sidebar emphasis.

### Sidebar And Header

- Reuse existing sidebar and navbar primitives for admin navigation.
- Do not replace them with React Router navigation patterns.
- Laravel routes remain the navigation source of truth.

### Form Controls

- Reuse the existing field, label, description, error, input, textarea, select, and combobox primitives directly.
- Build module-specific forms from composition rather than inventing a parallel form system.

### Tables

- Reuse the existing table, row, header, and cell primitives.
- Preserve row-link accessibility patterns and ensure row titles are always discernible.

### Dialogs And Alerts

- Use `Dialog` for standard edit or confirm overlays.
- Use `Alert` for destructive or high-risk confirmations.
- Mobile dialog sizing and escape behavior already align well with the admin shell.

### Pagination

- Reuse kit pagination directly for all paged admin index screens.

## Gaps To Handle Without Redesign

| Needed Pattern | Current State In Kit | Planning Response |
| --- | --- | --- |
| Cards | No dedicated card primitive | Reuse existing layout panels and spacing patterns instead of inventing a parallel card system |
| File upload | No dedicated upload component | Compose from existing form controls and buttons; build only if actual workflow requires it |
| Tabs | No tabs component present | Avoid tab-heavy IA unless a real page requires it; prefer sections and stacked forms |
| Drawers | No dedicated named drawer component | Mobile sidebar dialog can inform drawer behavior if later justified |
| Toasts | No toast component present | Prefer flash banners or inline status messages unless a real toast need emerges |
| Empty states | No explicit empty-state component | Define reusable content pattern, not a visual redesign |
| Loading states | No explicit skeleton or loading component | Define minimal loading placeholders only if needed in real screens |

## Accessibility Strengths Already Present

- Headless UI primitives support dialogs, menus, and combobox patterns.
- Buttons expand touch targets.
- Focus-ring treatment is already present across controls.
- Dark-mode support and forced-color considerations appear in multiple components.

## Accessibility Gaps To Correct

- Ensure every dialog and alert receives proper title and description usage in real screens.
- Ensure row-linked tables always expose clear row purpose and avoid inaccessible whole-row ambiguity.
- Ensure upload workflows expose progress or failure text accessibly if implemented later.
- Ensure flash-message or banner patterns announce status changes accessibly, since a toast component does not exist yet.
- Ensure any later tabs or drawers are introduced accessibly and only when truly required.

## Non-Negotiable Constraints

- Do not redesign the admin kit.
- Do not introduce React Router.
- Do not replace kit primitives with a parallel bespoke component library.
- Only build wrappers or helpers when the approved workflow actually needs them.

## License Confirmation

- The supplied admin kit appears to be Tailwind Plus Catalyst, based on the local component structure and the documented Catalyst reference used by the kit.
- Tailwind's official Tailwind Plus licensing pages indicate the kit can be used to build a custom website for a client and to create end products for clients, which is compatible with this project's planned use.
- This confirmation assumes the project team obtained the kit under a valid Tailwind Plus license and will use it within that license's terms rather than redistributing the kit itself.
- Source references:
  - `https://tailwindcss.com/plus/ui-kit`
  - `https://tailwindcss.com/plus/license`
  - `https://tailwindcss.com/blog/tailwind-plus`
