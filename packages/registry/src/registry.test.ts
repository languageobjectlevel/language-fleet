import { describe, expect, it } from "vitest";
import { registerAgent } from "./index.js";

describe("registry", () => {
  it("validates agent id", () => {
    expect(() => registerAgent({ agentId: "", region: "us-east", capabilities: [], registeredAt: "" })).toThrow();
  });
});
