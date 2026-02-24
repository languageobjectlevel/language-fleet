import { describe, expect, it } from "vitest";
import { evaluateScaling } from "./index.js";

describe("scaling", () => {
  it("rejects invalid desired agents", () => {
    expect(() => evaluateScaling("cpu", 0, "x")).toThrow();
  });
});
