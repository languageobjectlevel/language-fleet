import { performance } from "node:perf_hooks";
import { createFleetApp } from "../../apps/fleet-api/src/app.js";

const app = createFleetApp();
await app.ready();

const headers = { "x-service-token": "fleet-local-token", "idempotency-key": "perf-register" };
await app.inject({
  method: "POST",
  url: "/v1/agents/register",
  headers,
  payload: { agentId: "perf-agent", region: "us-east", capabilities: ["compute"], registeredAt: new Date().toISOString() }
});

const start = performance.now();
const totalRequests = 100;
for (let index = 0; index < totalRequests; index += 1) {
  await app.inject({
    method: "GET",
    url: "/v1/fleet/status"
  });
}
const end = performance.now();

const averageMs = (end - start) / totalRequests;
console.log(`Average /v1/fleet/status latency: ${averageMs.toFixed(2)}ms across ${totalRequests} requests`);

await app.close();
