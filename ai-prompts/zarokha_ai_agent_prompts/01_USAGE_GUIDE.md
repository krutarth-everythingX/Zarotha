# How to Use the Zarokha AI Agent Prompt Pack

## Project Snapshot

**Client:** Zarokha Wooden Arts  
**Location:** Vadodara, Gujarat, India  
**Business:** Manufacturer and seller of handcrafted wooden décor, including wooden jharokhas, elephants, wall décor, sculptures, temple décor, handcrafted art, and custom decorative pieces.

**Website model:** Product catalogue and inquiry website. It is not an ecommerce website. There is no cart, checkout, online payment, order management, or inventory management in the current scope.

**Public website:** Laravel-rendered semantic HTML5 with production CSS and JavaScript.  
**Admin CMS:** React + Inertia.js + TypeScript using the supplied admin UI kit without redesigning it.  
**Backend:** Latest stable Laravel version available when implementation starts.  
**Database:** MySQL.  
**Authentication:** Laravel authentication for authorized CMS users.  
**Primary goals:** Luxury brand presentation, fast product discovery, strong SEO, high-quality product imagery, inquiry conversion, easy CMS management, accessibility, security, and future extensibility.

## Recommended Workflow

1. Start a new coding-agent session in the project repository.
2. Paste `00_MASTER_RULES.md`.
3. Paste `02_STAGE_01_DISCOVERY_AND_SCOPE.md`.
4. Review the agent's stage completion report.
5. Approve only after the corresponding checklist passes.
6. Paste the next stage file.
7. Continue until the final audit is complete.

## Important Operating Rule

Do not paste all implementation stages at once. The purpose of this pack is to prevent the agent from rushing into code before architecture and requirements are settled.

## Approval Message Template

Use this after checking a stage:

```text
Stage [number] is approved.

Approved decisions:
- [decision]
- [decision]

Required corrections before the next stage:
- None

Proceed only with Stage [next number].
```

When corrections are required:

```text
Stage [number] is not approved.

Fix only these items:
1. [issue]
2. [issue]
3. [issue]

Re-run the stage validation and return the complete stage report again.
Do not start the next stage.
```

## Files the Agent Must Maintain

- `docs/PROJECT_PROGRESS.md`
- `docs/architecture/*`
- `docs/content/content-requirements.md`
- `docs/testing/test-strategy.md`
- ADR records for major technical decisions

## Content Safety

The agent must not publish invented business facts. Until the client supplies real phone numbers, email addresses, map location, social links, legal text, testimonials, project counts, years of experience, awards, or certifications, those values must remain unpublished CMS content requirements rather than fabricated frontend data.

## Stage Map

| Stage | Purpose | Coding Allowed |
|---|---|---:|
| 1 | Discovery and scope | No |
| 2 | Information architecture and content | No |
| 3 | Technical architecture and folder structure | No |
| 4 | Database and domain design | No |
| 5 | Routes, authorization, CMS, and APIs | No |
| 6 | UI/UX system and responsive behavior | No |
| 7 | SEO, performance, accessibility, and security plans | No |
| 8 | Project foundation and authentication | Yes |
| 9 | Backend CMS implementation | Yes |
| 10 | Media and image pipeline | Yes |
| 11 | Public website implementation | Yes |
| 12 | Admin panel implementation | Yes |
| 13 | Inquiry, search, export, SEO, and sitemap | Yes |
| 14 | Optimization and hardening | Yes |
| 15 | Automated testing and QA | Yes |
| 16 | Deployment and documentation | Yes |
| 17 | Final production audit | Fixes only |
