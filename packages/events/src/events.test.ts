import { describe, expect, it } from "vitest";
import { publishFleetEvent, readDeadLetter, readFleetOutbox } from "./index.js";

describe("fleet events", () => {
  it("routes duplicate events to dead letter", () => {
    publishFleetEvent({ id: "evt_duplicate", name: "fleet.agent.registered.v1", emittedAt: new Date().toISOString(), payload: {} });
    publishFleetEvent({ id: "evt_duplicate", name: "fleet.agent.registered.v1", emittedAt: new Date().toISOString(), payload: {} });

    expect(readFleetOutbox().some((event) => event.id === "evt_duplicate")).toBe(true);
    expect(readDeadLetter().some((event) => event.id === "evt_duplicate")).toBe(true);
  });
});
