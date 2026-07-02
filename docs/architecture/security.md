# Security Plan

## Security Objectives

- Protect the CMS, inquiry workflows, uploads, exports, and sensitive user data.
- Map security controls to the documented routes, roles, forms, and workflows.
- Keep launch controls explicit and testable.

## Authentication

- Use Laravel session-based authentication for CMS users.
- Enforce active-user checks after successful credential validation.
- Protect login and password reset routes with throttling.

## Password Reset

- Use Laravel's standard password reset flow with time-bounded reset tokens.
- Ensure reset endpoints remain guest-only.

## Session Hardening

- Use secure session cookie settings appropriate to deployment.
- Rotate session state on login.
- Protect logout behind authenticated POST.

## CSRF

- All state-changing public and admin web routes must use CSRF protection.
- Public inquiry submission and admin mutations both fall under this rule.

## Validation

- Every write operation must use explicit validation.
- Public search and filtering query parameters must also be validated and bounded.
- Validation failures must not leak sensitive internals.

## Authorization

- Use policies as the primary authorization boundary for admin resources and workflows.
- Keep admin route access aligned with the approved authorization matrix.

## XSS

- Escape Blade output by default.
- Sanitize any rich-text-capable content according to a constrained policy.
- Do not trust admin-supplied content implicitly just because it originates from the CMS.

## File Upload Security

- Validate MIME type, size, and allowed formats.
- Use generated filenames, not user-supplied storage names.
- Do not permanently delete reused media while referenced.
- Treat upload handling as a sensitive route family and rate-limit accordingly.

## Inquiry Spam Protection

- Use server-side validation, rate limiting, and safe metadata capture.
- Consider honeypot or equivalent low-friction anti-spam if later justified during implementation.
- Keep failure messaging calm and non-revealing.

## CSV Injection

- Escape or prefix dangerous leading characters in CSV exports.
- Limit export scope to authorized users and approved fields only.

## Security Headers

- Plan for CSP-compatible output, frame restrictions, MIME sniffing protection, referrer policy, and transport security headers appropriate to deployment.
- Final header values remain partly deployment-dependent.

## Logging And Error Disclosure

- Log security-relevant events such as failed logins, blocked delete attempts, export requests, redirect changes, and permission denials where valuable.
- Never expose stack traces or internal diagnostics publicly.

## Secrets

- No secrets committed to source control.
- Environment-specific secrets stay outside the repository.

## Backups

- Database and media backup destinations remain hosting-dependent.
- Backup expectations still belong in deployment planning and operations.

## Dependency Scanning

- Dependency review and vulnerability monitoring should be part of CI or release review when implementation begins.

## Admin Route Protection

- Keep all admin routes behind authentication.
- Prevent indexing and public discovery of admin routes.
- Keep React Router out of the CMS so Laravel routes remain the authority for access control and navigation.

## Account Lifecycle

- Users should be deactivated rather than casually deleted where historical references matter.
- Role changes and deactivations require audit visibility.

## Data Retention

- Inquiry retention remains provisional pending business and legal approval.
- Retention enforcement must follow the approved retention plan rather than ad hoc cleanup.

## Analytics And Consent Boundary

- No analytics tooling is assumed approved by default.
- If introduced later, analytics must respect consent requirements and avoid weakening security posture.
