# language-fleet

Orchestration and control plane for Language Object Level.

## Core API

- `POST /v1/agents/register`
- `POST /v1/agents/heartbeat`
- `POST /v1/workloads/assign`
- `POST /v1/workloads/rebalance`
- `POST /v1/scaling/policies`
- `GET /v1/fleet/status`
- `GET /v1/agents/{agentId}/health`

## Event Contracts

- `fleet.agent.registered.v1`
- `fleet.agent.heartbeat.v1`
- `fleet.workload.assigned.v1`
- `fleet.workload.rebalanced.v1`
- `fleet.scaling.triggered.v1`

## Engineering Gates

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run contract:validate`
- `npm run security:scan`
- `npm run sbom`
- `npm run license:check`
- `npm run docs:link-check`
