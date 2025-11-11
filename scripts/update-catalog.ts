import { $ } from "bun";
import pkg from "../package.json";

const { catalog } = pkg.workspaces;

console.log("Checking catalog packages...\n");

const updates: string[] = [];

await Promise.all(
  Object.entries(catalog).map(async ([_name, version]) => {
    const name = _name as keyof typeof catalog;
    const latest = (await $`npm view ${name} version`.quiet().text()).trim();
    const current = version.replace(/^[\^~]/, "");
    const prefix = version.match(/^[\^~]/)?.[0] || "^";

    if (latest !== current) {
      updates.push(`${name}: ${version} → ${prefix}${latest}`);
      catalog[name] = `${prefix}${latest}`;
    }
  }),
);

// Print updates in order
for (const update of updates) {
  console.log(update);
}

if (updates.length > 0) {
  console.log("\nUpdated catalog:");
  console.log(JSON.stringify(catalog, null, 2));
  console.log("\nWrite to package.json? (Y/n):");

  const input = prompt("");

  if (input?.toUpperCase() === "Y") {
    pkg.workspaces.catalog = catalog;
    await Bun.write("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
    console.log("✓ Done");
  } else {
    console.log("Cancelled");
  }
} else {
  console.log("\nAll packages up to date!");
}
