import { describe, expect, it } from "vitest";
import { evaluateByUtilization, evaluateScaling } from "./index.js";

describe("scaling", () => {
  it("rejects invalid desired agents", () => {
    expect(() => evaluateScaling("cpu", 0, "x")).toThrow();
  });

  it("scales out on sustained high utilization", () => {
    const decision = evaluateByUtilization("cpu", 3, 86);
    expect(decision.desiredAgents).toBe(4);
  });
});
