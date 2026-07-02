# Risk Register

| ID | Risk | Probability | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| R1 | Product content is incomplete or inconsistent at implementation start. | High | High | Define required product fields now, request source spreadsheet early, and validate content readiness before build. | Client + Content Manager |
| R2 | Product imagery quality is insufficient for a premium catalogue experience. | High | High | Request image standards, sample review, and minimum resolution requirements before implementation. | Client + Content Manager |
| R3 | Legal pages and consent language are not approved in time. | Medium | High | Mark legal copy as launch-critical dependency and obtain review owner early. | Client + Legal Reviewer |
| R4 | Contact routing and inquiry ownership are undefined, causing missed leads after launch. | Medium | High | Document operational workflow, owners, reply expectations, and escalation path before implementation. | Client + Inquiry Manager |
| R5 | Scope drifts toward ecommerce features during implementation. | Medium | High | Lock exclusions in discovery, repeat them in architecture, and reject non-approved transactional additions. | Project Lead |
| R6 | Instagram integration depends on an unstable or unauthorized source. | Medium | Medium | Treat Instagram as optional and only implement with an approved stable integration approach. | Project Lead + Client |
| R7 | Public address or map display creates privacy or operational concerns. | Medium | Medium | Keep map optional and require explicit client approval for address exposure. | Client |
| R8 | SEO value is weakened by missing metadata, weak copy, or poor taxonomy decisions. | Medium | High | Define metadata requirements, content dependencies, and taxonomy ownership before build. | SEO Editor + Content Manager |
| R9 | Inquiry export could introduce spreadsheet formula injection risk. | Medium | Medium | Require protected CSV export behavior in implementation planning and testing. | Engineering Lead |
| R10 | Admin permissions are too broad or unclear, creating security and workflow issues. | Medium | High | Define admin personas and permission boundaries before architecture and implementation. | Engineering Lead + Client |
| R11 | Premium design goals are undermined by weak content or late decision-making. | Medium | High | Treat copy and imagery as first-class dependencies and review mood and content direction before UI implementation. | Client + Design Lead |
| R12 | Performance targets are missed due to heavy media usage. | Medium | High | Plan responsive images, optimized formats, and strict asset budgets before implementation. | Engineering Lead |
