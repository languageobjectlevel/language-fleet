# Load Testing Runbook

1. Run `npm run test:load` to execute baseline latency checks.
2. Track average response times for `/v1/fleet/status`.
3. Trigger scaling policy tests when latency exceeds SLO targets.
