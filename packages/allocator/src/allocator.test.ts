import { describe, expect, it } from "vitest";
import { assignWorkload, selectAgentForWorkload } from "./index.js";

describe("allocator", () => {
  it("creates lease", () => {
    const lease = assignWorkload("w1", "a1", 30);
    expect(lease.agentId).toBe("a1");
  });

  it("selects lowest load healthy agent", () => {
    const selected = selectAgentForWorkload([
      { agentId: "a1", healthy: true, cpuLoad: 50, memoryLoad: 70, timestamp: new Date().toISOString() },
      { agentId: "a2", healthy: true, cpuLoad: 20, memoryLoad: 30, timestamp: new Date().toISOString() },
      { agentId: "a3", healthy: false, cpuLoad: 10, memoryLoad: 10, timestamp: new Date().toISOString() }
    ]);

    expect(selected).toBe("a2");
  });
});
