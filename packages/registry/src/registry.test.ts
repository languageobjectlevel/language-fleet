import { describe, expect, it } from "vitest";
import { registerAgent, registerHeartbeat } from "./index.js";

describe("registry", () => {
  it("validates agent id", () => {
    expect(() => registerAgent({ agentId: "", region: "us-east", capabilities: [], registeredAt: "" })).toThrow();
  });

  it("validates heartbeat load ranges", () => {
    expect(() =>
      registerHeartbeat({
        agentId: "a1",
        healthy: true,
        cpuLoad: 120,
        memoryLoad: 30,
        timestamp: new Date().toISOString()
      })
    ).toThrow();
  });
});
