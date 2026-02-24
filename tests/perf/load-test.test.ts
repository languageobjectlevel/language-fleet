import { performance } from "node:perf_hooks";
import { describe, expect, it } from "vitest";
import { createFleetApp } from "../../apps/fleet-api/src/app.js";

describe("fleet load probe", () => {
  it("measures status endpoint latency under sequential load", async () => {
    const app = createFleetApp();
    await app.ready();

    await app.inject({
      method: "POST",
      url: "/v1/agents/register",
      headers: { "x-service-token": "fleet-local-token", "idempotency-key": "perf-register" },
      payload: { agentId: "perf-agent", region: "us-east", capabilities: ["compute"], registeredAt: new Date().toISOString() }
    });

    const totalRequests = 100;
    const start = performance.now();
    for (let index = 0; index < totalRequests; index += 1) {
      await app.inject({ method: "GET", url: "/v1/fleet/status" });
    }
    const end = performance.now();
    const averageMs = (end - start) / totalRequests;

    expect(averageMs).toBeLessThan(50);

    await app.close();
  });
});
