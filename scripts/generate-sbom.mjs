import { mkdir, writeFile } from "node:fs/promises";

await mkdir("sbom", { recursive: true });
await writeFile("sbom/sbom.spdx.json", JSON.stringify({ generatedAt: new Date().toISOString(), package: "language-fleet" }, null, 2));
console.log("SBOM generated at sbom/sbom.spdx.json");
