# Chaos Runbook

## Scenarios

- Agent heartbeat loss and reassignment.
- Replay-key collision attacks.
- Expired lease rebalance attempts.

## Validation

Use `npm run test:integration` and inspect `/v1/events/dead-letter` for anomaly review.
