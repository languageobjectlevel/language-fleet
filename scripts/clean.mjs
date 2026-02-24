import { rm } from "node:fs/promises";

const targets = ["dist", "coverage", ".turbo", "node_modules/.cache"];
await Promise.all(targets.map(async (target) => rm(target, { recursive: true, force: true })));
