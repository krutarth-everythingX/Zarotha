# Logging And Observability

## Goals

- Make failures diagnosable without exposing sensitive data publicly.
- Track key operational flows such as inquiry handling, publishing, exports, and media processing.
- Support later production monitoring without overengineering the launch architecture.

## Structured Logging Strategy

- Use structured application logs with consistent context fields where possible.
- Include route or action name, authenticated user identifier for admin events, entity identifiers, and correlation-friendly request context when available.
- Keep secrets, raw credentials, and unnecessary personal data out of logs.

## Events Worth Logging

- Authentication successes and failures according to security policy.
- Product, collection, and static-page publish or unpublish actions.
- Inquiry status changes, assignments, exports, and archival actions.
- Media upload and processing outcomes.
- Queue job failures and retry exhaustion.

## Observability Boundaries

- Public analytics-style product browsing metrics are out of Stage 3 implementation scope unless defined later.
- Operational observability for application health, errors, and queue processing is in scope at the planning level.
- Admin activity history remains an application-level audit feature, separate from infrastructure logs.

## Error Reporting Strategy

- Unhandled exceptions should be captured through Laravel's reporting pipeline.
- Production error reporting destination depends on hosting and later deployment choices.
- Critical failures should be distinguishable from expected validation and permission events.

## Backup Assumptions

- Database backups are required in production.
- Media backup policy must account for uploaded originals and generated derivatives.
- Backup tooling depends on hosting environment and will be finalized in deployment planning.

## Deployment Assumptions

- One deployable Laravel application serves both public and admin concerns.
- Asset builds should produce separate public and admin entry points.
- Queue workers and scheduled tasks will require production process management.
