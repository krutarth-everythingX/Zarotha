# Service And Action Map

## Planning Rule

This map documents likely workflow boundaries, not mandatory class creation. Create services, actions, or related abstractions only when their documented use criteria are actually satisfied during implementation.

## Use-Criteria Reminder

- Use an action for a focused write workflow that is clearer when isolated.
- Use a service for multi-step orchestration, cross-model coordination, or reusable business logic.
- Keep logic in a controller only when it remains small, local, and not reused.
- Do not create repositories, DTOs, services, actions, events, listeners, observers, jobs, or commands merely because they appear in the documented structure.

## Planned Query Boundaries

| Concern | Recommended Boundary | Create Only If | Notes |
| --- | --- | --- | --- |
| Public product search | query object or search class | search logic spans keyword, category, collection, pagination, and publication filters | Strong candidate because behavior is shared and query-heavy |
| Collection detail product query | query object or scoped query helper | repeated ordered-collection read logic appears in more than one place | May stay local if used only once |
| Homepage assembly | service or dedicated query builder | multiple section sources and cache invalidation logic become non-trivial | Good candidate if homepage controller gets complex |
| Redirect lookup | focused query helper or action | loop prevention and path normalization need reuse | Keep isolated from content controllers |
| Sitemap generation | service | route aggregation and SEO rules need reuse or testing | Strong candidate |

## Planned Write Workflow Boundaries

| Workflow | Recommended Boundary | Create Only If | Why |
| --- | --- | --- | --- |
| Create or update inquiry | action or service | contact and product inquiry flows share persistence, privacy metadata, and activity creation rules | Shared public write workflow |
| Publish product | action | publish requires prerequisite checks, status transition, audit logging, and cache invalidation | Strong candidate |
| Update product with gallery and collections | service | update spans product fields, pivot sync, SEO fields, and media rules | Multi-step write path |
| Reorder collection products | action | deterministic pivot reordering needs isolated validation and persistence | Focused write workflow |
| Reorder product gallery | action | deterministic gallery order and visibility updates need isolated logic | Focused write workflow |
| Upload and register media | service | storage, validation aftermath, metadata persistence, and optional processing dispatch must stay consistent | Strong candidate |
| Update homepage section | service or action | section-key-specific rules and curated-item sync become complex | Use only if controller would otherwise become large |
| Update inquiry status or assignment | action | state transitions must create inquiry activity rows consistently | Strong candidate |
| Export inquiries | service | filter reuse, CSV shaping, and spreadsheet-safety rules must stay consistent | Strong candidate |
| Create or update redirect | action | uniqueness and loop-prevention rules should stay centralized | Strong candidate |
| Update SEO defaults | action | cache invalidation plus typed-setting update should remain predictable | Optional but reasonable |

## Planned Data Contract Boundaries

| Concern | Recommended Boundary | Create Only If | Notes |
| --- | --- | --- | --- |
| Inertia page props | typed data objects or arrays documented by interface | page props become large enough that untyped associative arrays are error-prone | Strong candidate for admin pages |
| Public view models | typed data objects | view payload shaping is reused or complex | Optional for public pages |
| Export rows | dedicated export row mapper | CSV columns and injection-safety shaping are non-trivial | Reasonable candidate |

## Jobs, Events, And Observers

| Concern | Boundary | Create Only If | Notes |
| --- | --- | --- | --- |
| Media derivative generation | job | production media processing is slow or retryable | Already justified by architecture |
| Inquiry export generation | job | synchronous export becomes too slow for request cycle | Hosting-dependent decision |
| Inquiry notifications | event plus listener or job | the client later approves an actual notification workflow | Not required now |
| Slug-history redirect creation | observer or explicit action step | slug-change behavior needs centralization and remains predictable | Prefer explicit workflow step first unless lifecycle hook is clearly safer |
| Audit logging side effects | explicit action step or listener | repeated audit creation becomes cross-cutting and noisy | Avoid premature event fan-out |

## What Should Probably Stay Simple

- Straightforward read-only dashboard counts may stay inside a controller-backed query if they remain small.
- Small fixed-page updates do not automatically justify a service if they only persist one record cleanly.
- Basic category create or update may remain controller plus request plus policy if no multi-step workflow emerges.
