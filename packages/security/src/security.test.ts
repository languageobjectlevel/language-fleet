import { describe, expect, it } from "vitest";
import { assertAllowedRegion, assertNoReplayKeyReuse } from "./index.js";

describe("security", () => {
  it("guards allowed region and replay keys", () => {
    expect(() => assertAllowedRegion("moon-1")).toThrow();
    const keys = new Set<string>();
    assertNoReplayKeyReuse(keys, "k1");
    keys.add("k1");
    expect(() => assertNoReplayKeyReuse(keys, "k1")).toThrow();
  });
});
