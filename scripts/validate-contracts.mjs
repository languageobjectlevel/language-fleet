import { existsSync, readFileSync } from "node:fs";

const required = [
  "contracts/openapi/fleet.v1.yaml",
  "contracts/asyncapi/fleet.events.v1.yaml"
];

for (const file of required) {
  if (!existsSync(file) || readFileSync(file, "utf8").trim().length === 0) {
    console.error(`Missing or empty contract artifact: ${file}`);
    process.exitCode = 1;
  }
}

if (process.exitCode !== 1) {
  console.log("Contract files validated");
}
