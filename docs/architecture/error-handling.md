# Error Handling

## Principles

- Public visitors should receive clear, calm, and non-technical feedback.
- Admin users should receive actionable feedback for validation and permission issues.
- Unexpected failures should be logged with enough context for diagnosis without exposing sensitive details publicly.

## Public Error Handling

- Missing pages, products, or collections should return 404.
- Invalid search parameters should degrade gracefully to safe defaults or empty results.
- Inquiry and contact validation failures should preserve user confidence and support correction.
- Server errors should use a branded but minimal fallback experience without technical leakage.

## Admin Error Handling

- Unauthorized actions should return clear permission-denied states.
- Authentication failures should route through Laravel's standard auth protections.
- Validation failures should bind directly to admin forms with field-level feedback.
- Failed writes should preserve auditability and avoid partial updates through transaction boundaries where needed.

## Background Job Error Handling

- Queue failures should be logged with job type, entity identifier, retry context, and failure reason.
- Recoverable jobs should be retried according to later environment policy.
- Irrecoverable media or export failures should surface an actionable admin status where later implementation supports it.

## Logging Boundaries

- Do not expose stack traces or internal implementation details to public users.
- Admin-facing feedback should remain helpful without dumping sensitive internals.
- Operational details belong in logs, not UI copy.

## Status Code Expectations

- `200` for successful public and admin page responses.
- `302` or equivalent redirect flow for successful post-redirect-get admin and public form patterns.
- `403` for authenticated but unauthorized actions.
- `404` for missing or unpublished public content and missing admin resources where appropriate.
- `422` for validation failures.
- `429` for rate-limited actions such as login, uploads, exports, or inquiry abuse protection.
- `500` class responses for unexpected application failures.
