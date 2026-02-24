import { describe, expect, it } from "vitest";
import { assignWorkload } from "./index.js";

describe("allocator", () => {
  it("creates lease", () => {
    const lease = assignWorkload("w1", "a1", 30);
    expect(lease.agentId).toBe("a1");
  });
});
