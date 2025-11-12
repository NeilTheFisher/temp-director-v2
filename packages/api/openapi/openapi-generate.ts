import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { $ } from "bun";
import { version as directorVersion } from "../package.json" with {
  type: "json",
};
import { appRouter } from "../src/routers";

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});

const spec = await generator.generate(appRouter, {
  info: {
    title: "Director API",
    version: directorVersion,
  },
});

const output = "./openapi/openapi.json";
await $`echo '${JSON.stringify(spec, null, 2)}' > ${output}`;
console.log(`OpenAPI spec generated at ${output}`);

await $`openapi-generator-cli generate`;

// const clientsGenerated = Object.keys(
//   openapiToolsJson["generator-cli"].generators,
// );
// await Promise.all(
//   clientsGenerated.map(async (client) => {
//     const packageJsonContent = JSON.stringify(
//       {
//         name: `@director-api/clients-${client}`,
//         version: directorVersion,
//         files: ["dist"],
//       },
//       null,
//       2,
//     );
//     const packageJsonPath = `./openapi/clients/${client}/package.json`;
//     await $`echo '${packageJsonContent}' > ${packageJsonPath}`;
//     console.log(`package.json generated at ${packageJsonPath}`);
//   }),
// );
