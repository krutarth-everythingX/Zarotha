# ADR-0004: Centralize Media Handling And Use Queues For Slow Work

## Status

Accepted

## Context

Product imagery is a core business asset and image processing can become slow or operationally sensitive.

## Decision

- Centralize media validation, storage, and derivative handling in dedicated application services.
- Use queues for image optimization, derivative generation, and other slow or retryable tasks.

## Consequences

- Media rules stay consistent across products, collections, and pages.
- Upload requests stay leaner when heavy processing is deferred.
- Queue operations become part of production operations.

## Trade-Offs

- Requires worker setup and failure monitoring.
- Provides better long-term control than ad hoc in-request processing.
