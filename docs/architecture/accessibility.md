# Accessibility Plan

## Goal

- Target WCAG 2.2 AA for public and practical accessibility parity for the admin CMS using the supplied kit.

## Public Acceptance Areas

### Keyboard-Only Navigation

- Header, mobile menu, breadcrumb links, filters, pagination, product gallery, lightbox, and inquiry actions must all be keyboard-usable.

### Focus Order

- Focus order should follow visual and semantic structure.
- Sticky or floating actions must not hijack focus flow.

### Focus Trapping

- Mobile menu, dialogs, alerts, and lightbox overlays must trap focus and restore it on close.

### Skip Links

- Provide skip navigation to main content on public pages.

### Form Labeling And Errors

- Every field needs a visible label.
- Helper and error text must be associated with inputs.
- Success and failure states must be perceivable without color alone.

### Color Contrast

- Test primary text, muted text, CTA surfaces, borders, and focus states against their backgrounds.

### Reduced Motion

- All non-essential motion must reduce or disappear when `prefers-reduced-motion` is active.

### Screen-Reader Announcements

- Form errors, success messages, dynamic filters, and important admin status changes should be announced appropriately.

### Carousel Controls

- If the hero uses a slider, controls must be labeled, keyboard accessible, and not auto-rotate uncontrollably.

### Gallery And Zoom

- Product media browsing must work without pointer-only gestures.

### Mobile Menu

- Off-canvas or dialog-backed navigation must be screen-reader and keyboard safe.

## Admin Acceptance Areas

### Inertia Navigation

- Ensure page changes preserve understandable focus and heading context.

### Data Tables

- Table headers, row actions, and row-link behaviors must be testable by keyboard and assistive technology.

### Upload Components

- Any later upload interface must expose status, error, and completion feedback accessibly.

### Dialogs

- Dialog and alert components from the kit must always receive correct titles and descriptions in usage.

### Toasts Or Flash Messaging

- Even if a toast component is not added, flash or inline status messages must be announced accessibly.

### 404 Page

- Recovery links must be obvious and keyboard reachable.

## Measurement Approach

- Combine manual keyboard testing, screen-reader spot checks, automated a11y linting or audits where practical, and acceptance test coverage.
