# Security Checklist

## Authentication And Sessions

- Session-based CMS auth only
- Login throttling
- Password reset throttling
- Active-user enforcement
- Secure cookie and session settings planned

## Input And Validation

- Explicit validation on every write route
- Public search and filter query validation
- Safe validation error handling
- Rich-text sanitization policy where applicable

## Authorization

- Policy checks on admin reads and writes
- Export authorization
- User-management restrictions
- Permission-denied route coverage

## Inquiry Protection

- Contact and product-inquiry validation
- Rate limiting
- Anti-spam measure planned
- Safe failure messaging
- Restricted data handling

## Upload And Media Protection

- File type and size validation
- Safe generated filenames
- Reference-safe media deletion
- Processing-failure logging

## Export Protection

- Authorized export only
- Filter-bounded export scope
- CSV formula-injection prevention
- Audit trail for exports

## Routing And Exposure

- Admin noindex protections
- Redirect loop prevention
- Correct `404` behavior after redirect checks
- No stray public JSON API for launch

## Security Headers And Secrets

- Header policy planned
- No committed secrets
- Environment-based secret storage
- Controlled error disclosure

## Dependency And Operations

- Dependency vulnerability review planned
- Backup expectations documented
- Hosting-dependent security operations remain open:
  - storage driver
  - cache driver
  - queue driver
  - production error-reporting destination
  - media backup destination
  - deployment process
