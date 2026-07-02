# Accessibility Behavior

## Baseline Goal

- Public site target: WCAG 2.2 AA.
- Admin behavior should preserve or improve the accessibility affordances already present in the supplied kit.

## Navigation

- Provide a skip link to main content.
- Desktop navigation, mobile navigation, and breadcrumb behavior must remain fully keyboard-usable.
- Mobile menu must trap focus while open and restore focus to the trigger on close.

## Forms

- Every input needs a visible label.
- Helper and error text should be programmatically associated with form fields.
- Validation must be announced clearly and preserve entered data where appropriate.
- Consent controls must be reachable and understandable by keyboard and screen readers.

## Filters And Search

- Search and filters must have explicit labels.
- Active-filter state must be readable and removable without pointer-only interaction.
- Result-count updates should be announced politely where dynamic updates occur later.

## Galleries And Lightbox

- Thumbnails and next or previous controls must be keyboard reachable.
- Lightbox must support Escape to close and return focus to the invoking control.
- Zoom controls must have labeled buttons if used.

## Dialogs And Overlays

- Inquiry confirmations, destructive admin confirmations, and other dialogs must use proper dialog semantics.
- Background content should not remain tabbable while modal overlays are open.

## Motion And Reduced Motion

- `prefers-reduced-motion` must disable non-essential reveals, parallax, and scale-heavy transitions.
- Interaction meaning must remain clear even with motion reduced or removed.

## States

- Empty states should explain what happened and what to do next.
- Error states should be human-readable and non-technical.
- Success states should confirm action completion without relying on color alone.

## Media

- Product and editorial imagery need meaningful alt treatment.
- Decorative-only visuals should not create noisy screen-reader output.
- Video or animated motion should remain optional and non-essential if ever added later.

## Admin-Specific Notes

- Table actions must stay reachable without pointer-only hover reveals.
- Flash messages should be announced accessibly.
- Auth flows and password-reset screens should retain straightforward keyboard progression.
