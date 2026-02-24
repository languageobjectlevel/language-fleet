import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createFleetApp } from "../../apps/fleet-api/src/app.js";

describe("fleet security regression", () => {
  const app = createFleetApp();
  const authHeaders = { "x-service-token": "fleet-local-token" };

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects region outside allowlist", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/agents/register",
      headers: { ...authHeaders, "idempotency-key": "sec-reg-1" },
      payload: { agentId: "agent-sec-1", region: "moon-1", capabilities: [], registeredAt: new Date().toISOString() }
    });

    expect(response.statusCode).toBe(400);
  });

  it("rejects heartbeat load out of bounds", async () => {
    await app.inject({
      method: "POST",
      url: "/v1/agents/register",
      headers: { ...authHeaders, "idempotency-key": "sec-reg-2" },
      payload: { agentId: "agent-sec-2", region: "us-east", capabilities: [], registeredAt: new Date().toISOString() }
    });

    const heartbeat = await app.inject({
      method: "POST",
      url: "/v1/agents/heartbeat",
      headers: { ...authHeaders, "idempotency-key": "sec-hb-1" },
      payload: { agentId: "agent-sec-2", healthy: true, cpuLoad: 150, memoryLoad: 10, timestamp: new Date().toISOString() }
    });

    expect(heartbeat.statusCode).toBe(400);
  });
});
