import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

if (!statSync("docs").isDirectory()) {
  console.log("No docs directory to validate");
  process.exit(0);
}

for (const entry of readdirSync("docs", { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith(".md")) {
    const content = readFileSync(join("docs", entry.name), "utf8");
    if (content.includes("](./")) {
      console.error(`Relative markdown link requires validation update in ${entry.name}`);
      process.exit(1);
    }
  }
}

console.log("Documentation links validated");
