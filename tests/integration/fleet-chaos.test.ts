import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createFleetApp } from "../../apps/fleet-api/src/app.js";

describe("fleet chaos and failure scenarios", () => {
  const app = createFleetApp();
  const authHeaders = { "x-service-token": "fleet-local-token" };

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects unauthorized write calls", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/agents/register",
      headers: { "idempotency-key": "bad-auth" },
      payload: { agentId: "unauth", region: "us-east", capabilities: [], registeredAt: new Date().toISOString() }
    });

    expect(response.statusCode).toBe(401);
  });

  it("blocks replay key reuse", async () => {
    const first = await app.inject({
      method: "POST",
      url: "/v1/scaling/policies",
      headers: { ...authHeaders, "idempotency-key": "replay-key" },
      payload: { policyName: "cpu", desiredAgents: 2, reason: "initial" }
    });

    const second = await app.inject({
      method: "POST",
      url: "/v1/scaling/policies",
      headers: { ...authHeaders, "idempotency-key": "replay-key" },
      payload: { policyName: "cpu", desiredAgents: 2, reason: "replay" }
    });

    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(401);
  });

  it("returns conflict when rebalancing expired lease", async () => {
    await app.inject({
      method: "POST",
      url: "/v1/agents/register",
      headers: { ...authHeaders, "idempotency-key": "reg-exp" },
      payload: { agentId: "agent-exp", region: "us-west", capabilities: ["compute"], registeredAt: new Date().toISOString() }
    });

    await app.inject({
      method: "POST",
      url: "/v1/agents/heartbeat",
      headers: { ...authHeaders, "idempotency-key": "hb-exp" },
      payload: { agentId: "agent-exp", healthy: true, cpuLoad: 10, memoryLoad: 10, timestamp: new Date().toISOString() }
    });

    const assignment = await app.inject({
      method: "POST",
      url: "/v1/workloads/assign",
      headers: { ...authHeaders, "idempotency-key": "assign-exp" },
      payload: { workloadId: "workload-exp", agentId: "agent-exp", ttlSeconds: 0 }
    });
    const lease = assignment.json();

    await new Promise((resolve) => setTimeout(resolve, 5));

    const rebalance = await app.inject({
      method: "POST",
      url: "/v1/workloads/rebalance",
      headers: { ...authHeaders, "idempotency-key": "rebalance-exp" },
      payload: { leaseId: lease.leaseId, toAgentId: "agent-exp", ttlSeconds: 30 }
    });

    expect(rebalance.statusCode).toBe(409);
  });
});
