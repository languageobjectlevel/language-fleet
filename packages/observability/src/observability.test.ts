import { describe, expect, it } from "vitest";
import { increment, log, readLogs, snapshot } from "./index.js";

describe("observability", () => {
  it("collects metrics and logs", () => {
    increment("fleet.metric");
    log({ level: "info", event: "fleet.test" });

    expect(snapshot()["fleet.metric"]).toBeGreaterThanOrEqual(1);
    expect(readLogs().at(-1)?.event).toBe("fleet.test");
  });
});
