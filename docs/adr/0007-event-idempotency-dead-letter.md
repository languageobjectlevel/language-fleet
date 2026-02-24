# ADR 0007: Event Idempotency and Dead-Letter Strategy

## Status

Accepted

## Decision

Duplicate event ids are diverted to dead-letter storage for operator review while unique events remain in outbox.
