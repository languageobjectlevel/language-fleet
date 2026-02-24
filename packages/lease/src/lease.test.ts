import { describe, expect, it } from "vitest";
import { isLeaseExpired, renewLease } from "./index.js";

describe("lease management", () => {
  it("rejects invalid ttl", () => {
    expect(() => renewLease({ leaseId: "l1", workloadId: "w1", agentId: "a1", expiresAt: new Date().toISOString() }, 1)).toThrow();
  });

  it("detects expired leases", () => {
    const expired = isLeaseExpired({
      leaseId: "l2",
      workloadId: "w2",
      agentId: "a2",
      expiresAt: new Date(Date.now() - 1000).toISOString()
    });
    expect(expired).toBe(true);
  });
});
