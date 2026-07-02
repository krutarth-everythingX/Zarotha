# Export Planning

## Launch Export Scope

- Launch export scope is limited to inquiry CSV export.
- No product, media, or user export is required in current scope unless approved later.

## Export Route

- Route: `admin.inquiries.export`
- Method: `POST`
- Authorization: policy method `export`
- Validation: `ExportInquiriesRequest`
- Rate limiting: required

## Export Inputs

- Allowed filters should match inquiry list filters:
  - status
  - assigned user
  - source page
  - date range
  - keyword or email search if approved for export scope

## Export Columns

- Inquiry id
- Created at
- Status
- Assigned user
- Name
- Email
- Phone
- WhatsApp number
- Subject
- Message
- Product reference if available
- Source page key
- Source URL
- Consent confirmed
- Referrer URL if retained
- UTM fields if retained
- Last replied at
- Archived at

Internal notes from `inquiry_activities` should not automatically export unless the business later approves that scope explicitly.

## CSV Safety Rules

- Prevent spreadsheet formula injection by escaping or prefixing dangerous leading characters in exported text fields.
- Preserve UTF-8 output compatibility.
- Keep column ordering stable.
- Do not include restricted internal-only metadata unless explicitly approved.

## Export Delivery Strategy

- Small exports may complete synchronously if performance remains acceptable.
- Larger exports should move to a queued workflow only if actual performance requires it.
- Any queued export path must still create an audit trail and respect the “no abstraction by habit” rule.

## Audit And Privacy

- Every export request should create an audit or inquiry activity entry with actor, filter scope, and timestamp.
- Inquiry retention remains provisional pending legal and business approval.
- Exported data should be treated as restricted because it includes personal contact information.

## Failure Handling

- Invalid filters return `422`.
- Unauthorized export attempts return `403`.
- Rate-limited export attempts return `429`.
- Export processing failures should surface a clear admin-facing error and produce operational logs.
