# Recovery Runbook

1. Freeze assignment and rebalance API traffic.
2. Validate latest heartbeat snapshots and lease map integrity.
3. Replay pending outbox events in chronological order.
4. Re-enable write traffic after integration and security tests pass.
