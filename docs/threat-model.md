# Threat Model

## Assets

- Agent registrations and health telemetry.
- Workload leases and rebalance plans.
- Scaling decisions and connector status.

## Primary Threats

- Replay of registration and assignment calls.
- Unauthorized region enrollment.
- Workload hijacking during rebalances.

## Controls

- Replay key validation.
- Region allowlist.
- Signed service identity enforcement.
