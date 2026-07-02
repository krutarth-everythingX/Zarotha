# Data Retention

## Purpose

Define the proposed baseline retention and deletion posture before implementation. Legal text and final operational policy still depend on client approval.

## Retention Principles

- Retain only data that serves an operational, legal, or audit purpose.
- Prefer status-based archival over silent deletion for inquiries.
- Keep privacy-sensitive fields limited and reviewable.
- Treat the retention periods below as proposed defaults pending legal and business confirmation.

## Proposed Retention Baseline

| Data Area | Proposed Retention | Rationale | Notes |
| --- | --- | --- | --- |
| Published products and collections | Indefinite while relevant | Public catalogue history and redirect continuity | Soft delete before hard purge |
| Soft-deleted products and collections | Review after 12 months | Recovery window and slug history protection | Purge only after redirect review |
| Media assets in active use | Indefinite while referenced | Public and CMS dependencies | Do not purge referenced assets |
| Unreferenced soft-deleted media | Review after 6 months | Recovery window without indefinite bloat | Confirm no active references first |
| Inquiries | 24 months from last activity, pending legal approval | Sales follow-up and operational history | High-sensitivity record |
| Inquiry activities | Same as parent inquiry | Keep workflow history aligned | Cascade on final inquiry purge |
| Activity logs | 12 months minimum | Admin audit trail | Extend if operationally needed |
| Redirects | Indefinite while active | Preserve SEO and old-link continuity | Review inactive redirects periodically |
| Password reset tokens | Short-lived operational retention | Security | Clean up aggressively in implementation |

## Sensitive Data Handling

- Inquiries contain personal contact data and should be treated as restricted.
- `ip_hash` is preferred over raw IP storage for abuse-prevention context where feasible.
- Legal approval is still required for final privacy disclosures and retention wording.

## Deletion And Purge Guidance

- Do not hard delete products or collections as the first step; use soft delete and review references.
- Do not hard delete media while any content record still references it.
- Do not use inquiry status `archived` as the same thing as deletion.
- Use final purge workflows only after retention and audit needs are checked.

## Open Dependencies

- Final Privacy Policy text
- Final Terms and Conditions
- Final inquiry ownership and response procedure
- Final legal review of retention windows and disclosure requirements
