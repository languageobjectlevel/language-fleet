import { describe, expect, it } from "vitest";
import { buildConnectorPing, checkConnectorStatus } from "./index.js";

describe("connectors", () => {
  it("reports compatibility state", () => {
    expect(checkConnectorStatus().compatibility).toBe("ok");
  });

  it("builds connector ping payload", () => {
    const ping = buildConnectorPing("operator", "corr-1");
    expect(ping.target).toBe("operator");
  });
});
