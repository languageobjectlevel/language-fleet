import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createFleetApp } from "../../apps/fleet-api/src/app.js";

describe("fleet integration flow", () => {
  const app = createFleetApp();
  const authHeaders = { "x-service-token": "fleet-local-token" };

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("registers agents and executes assignment to rebalance lifecycle", async () => {
    const registerA = await app.inject({
      method: "POST",
      url: "/v1/agents/register",
      headers: { ...authHeaders, "idempotency-key": "reg-a" },
      payload: { agentId: "agent-a", region: "us-east", capabilities: ["compute"], registeredAt: new Date().toISOString() }
    });
    expect(registerA.statusCode).toBe(201);

    const registerB = await app.inject({
      method: "POST",
      url: "/v1/agents/register",
      headers: { ...authHeaders, "idempotency-key": "reg-b" },
      payload: { agentId: "agent-b", region: "us-east", capabilities: ["compute"], registeredAt: new Date().toISOString() }
    });
    expect(registerB.statusCode).toBe(201);

    const heartbeatA = await app.inject({
      method: "POST",
      url: "/v1/agents/heartbeat",
      headers: { ...authHeaders, "idempotency-key": "hb-a" },
      payload: { agentId: "agent-a", healthy: true, cpuLoad: 70, memoryLoad: 65, timestamp: new Date().toISOString() }
    });
    expect(heartbeatA.statusCode).toBe(202);

    const heartbeatB = await app.inject({
      method: "POST",
      url: "/v1/agents/heartbeat",
      headers: { ...authHeaders, "idempotency-key": "hb-b" },
      payload: { agentId: "agent-b", healthy: true, cpuLoad: 15, memoryLoad: 25, timestamp: new Date().toISOString() }
    });
    expect(heartbeatB.statusCode).toBe(202);

    const assign = await app.inject({
      method: "POST",
      url: "/v1/workloads/assign",
      headers: { ...authHeaders, "idempotency-key": "assign-1" },
      payload: { workloadId: "workload-1" }
    });
    expect(assign.statusCode).toBe(201);
    const lease = assign.json();
    expect(lease.agentId).toBe("agent-b");

    const rebalance = await app.inject({
      method: "POST",
      url: "/v1/workloads/rebalance",
      headers: { ...authHeaders, "idempotency-key": "rebalance-1" },
      payload: { leaseId: lease.leaseId, toAgentId: "agent-a", ttlSeconds: 90 }
    });
    expect(rebalance.statusCode).toBe(200);

    const scaling = await app.inject({
      method: "POST",
      url: "/v1/scaling/policies",
      headers: { ...authHeaders, "idempotency-key": "scale-1" },
      payload: { policyName: "cpu", currentAgents: 2, averageCpuLoad: 80 }
    });
    expect(scaling.statusCode).toBe(201);

    const status = await app.inject({ method: "GET", url: "/v1/fleet/status" });
    expect(status.statusCode).toBe(200);

    const outbox = await app.inject({ method: "GET", url: "/v1/events/outbox" });
    expect(outbox.statusCode).toBe(200);
    expect(outbox.json().count).toBeGreaterThan(0);
  });
});
