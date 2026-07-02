# Request Lifecycle

## Lifecycle Principles

- Every request path should be traceable from route to response.
- Public and admin concerns should follow different delivery paths while sharing domain logic where appropriate.
- Slow or retryable work should be deferred to queues rather than keeping users waiting.

## Public Page Request

1. Request enters `routes/public.php`.
2. Public middleware stack applies security headers, session handling where required, and route-specific protections.
3. Public controller resolves the route and delegates content retrieval to query services, search classes, or data builders.
4. Policies are usually not needed for anonymous page viewing, but publication-state rules must be enforced in query logic.
5. SEO helpers assemble canonical, metadata, structured-data, and breadcrumb context.
6. Controller passes typed view data into a Blade page.
7. Blade layout renders semantic HTML with only the required public asset entry points.
8. Response returns with the correct status code, cache policy, and fallbacks for missing or unpublished content.

## Public Inquiry Submission

1. Form posts to a public route.
2. Public Form Request validates input and normalizes allowed fields.
3. Controller delegates creation to an inquiry action or service.
4. Service persists the inquiry, applies allowed metadata capture, and may dispatch background jobs for notification or enrichment later.
5. Response returns success or validation errors without inventing operational promises.

## Public Product Search

1. Request enters the products index route with query parameters.
2. Request object validates allowed search and filter inputs.
3. Search class builds the Eloquent query according to category, collection, keyword, and publication rules.
4. Results are paginated and mapped into public card data objects.
5. Blade page renders result state, filter state, and empty-state guidance.

## Admin Page Request

1. Request enters `routes/admin.php`.
2. Authentication middleware confirms an authorized CMS session.
3. Route middleware and policies enforce permission boundaries.
4. Admin controller coordinates services, read models, and data objects.
5. Controller returns an Inertia response pointing to a React page.
6. React page receives typed props, renders within the admin UI kit, and performs any page-level interactions.

## Admin Write Request

1. Authenticated request hits an admin route.
2. Admin Form Request validates data and checks authorization.
3. Controller delegates to a service or action for the write workflow.
4. Service handles transactions, media associations, status changes, and any side effects.
5. Follow-up work such as image processing or exports is dispatched to queues when appropriate.
6. Response redirects or returns to the Inertia page with status feedback.

## Media Upload Request

1. Authenticated admin request uploads a file.
2. Request validation checks file type, size, and allowed usage rules.
3. Media service stores the original in the selected storage path using safe generated filenames.
4. Job dispatch handles derivative generation and optimization.
5. Media metadata is persisted for later retrieval by public and admin surfaces.

## Error Paths

- Missing or unpublished public records return 404.
- Unauthorized admin access returns the appropriate auth or permission response.
- Validation failures return user-correctable feedback.
- Deferred job failures are logged and retried according to later queue policy.
