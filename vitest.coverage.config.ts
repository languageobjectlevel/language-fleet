import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/**/*.test.ts", "tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["apps/fleet-api/src/**/*.ts", "packages/*/src/**/*.ts"],
      exclude: ["apps/**/server.ts", "packages/contracts/src/index.ts"],
      reporter: ["text"],
      thresholds: {
        lines: 85,
        branches: 80,
        functions: 85,
        statements: 85
      }
    }
  }
});
