import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
if (packageJson.license !== "Apache-2.0") {
  console.error("License policy failure");
  process.exit(1);
}
console.log("License check passed");
