# language-fleet

`language-fleet` is the orchestration and control-plane service for Language Object Level. It manages agent registration, heartbeat health, workload leasing, rebalancing, and scaling decisions for distributed runtime capacity.

## Platform Role

`language-fleet` is one of three platform repositories:

- `language-commerce` generates revenue workflow demand
- `language-operator` performs execution workloads
- `language-fleet` routes and governs distributed workload placement

## Control-Plane Responsibilities

- Agent registry and heartbeat admission
- Load-aware workload assignment
- Lease lifecycle and rebalance enforcement
- Scaling policy evaluation (manual and utilization-based)
- Connector compatibility diagnostics for operator and commerce paths
- Event outbox and dead-letter monitoring

## API Surface (v1)

- `POST /v1/agents/register`
- `POST /v1/agents/heartbeat`
- `POST /v1/workloads/assign`
- `POST /v1/workloads/rebalance`
- `POST /v1/scaling/policies`
- `GET /v1/fleet/status`
- `GET /v1/agents/{agentId}/health`

Additional operational endpoints:

- `GET /v1/connectors/status`
- `POST /v1/connectors/ping`
- `GET /v1/events/outbox`
- `GET /v1/events/dead-letter`
- `GET /v1/observability/logs`

Contract source of truth:

- `contracts/openapi/fleet.v1.yaml`

## Event Contracts (v1)

- `fleet.agent.registered.v1`
- `fleet.agent.heartbeat.v1`
- `fleet.workload.assigned.v1`
- `fleet.workload.rebalanced.v1`
- `fleet.scaling.triggered.v1`

Contract source of truth:

- `contracts/asyncapi/fleet.events.v1.yaml`

## Core Domain Types

Exported from workspace packages:

- `AgentRegistration`
- `HeartbeatSnapshot`
- `WorkloadLease`
- `RebalancePlan`
- `ScalingDecision`
- `FleetHealthReport`

## Repository Layout

```text
apps/
  fleet-api/
packages/
  contracts/
  events/
  registry/
  allocator/
  lease/
  scaling/
  connectors/
  security/
  observability/
contracts/
  openapi/
  asyncapi/
docs/
  adr/
  runbooks/
tests/
  integration/
  security/
  perf/
```

## Quick Start

### Prerequisites

- Node.js 22+
- npm 10+

### Install and Verify

```bash
npm ci
npm run lint
npm run typecheck
npm run test
```

### Run Performance Probe

```bash
npm run test:load
```

## Required Engineering Gates

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration
npm run contract:validate
npm run security:scan
npm run sbom
npm run license:check
npm run docs:link-check
npm run test:load
```

Coverage target policy:

- Lines: >= 85%
- Branches: >= 80%

## Security Model

- Service-token authentication for mutating endpoints
- Replay-key protection via `idempotency-key` headers
- Region allowlist for agent admission
- Heartbeat telemetry bounds validation
- Threat model and response runbooks in `docs/`

## Documentation Path (Recommended Order)

1. `docs/architecture.md`
2. `docs/testing-strategy.md`
3. `docs/threat-model.md`
4. `docs/adr/`
5. `docs/runbooks/monitoring.md`
6. `docs/runbooks/chaos.md`
7. `docs/runbooks/load-testing.md`
8. `docs/release-notes-1.0.0.md`

## Release and Branch Model

- Long-lived branches: `main`, `develop`
- Working branches: `feature/*`, `security/*`, `test/*`, `docs/*`, `perf/*`, `release/*`, `hotfix/*`
- Releases are produced from `release/x.y.z`, then merged to `main` and back-merged to `develop`

## Contributing and Support

- Contribution process: `CONTRIBUTING.md`
- Code ownership: `CODEOWNERS`
- Security reporting: `SECURITY.md`
- Operational support: `SUPPORT.md`
