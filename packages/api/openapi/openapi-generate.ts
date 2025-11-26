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
  servers: [
    {
      url: "https://director.odience.com/api",
    },
  ],
});

// Add x-is-sse vendor extension to SSE endpoints
for (const pathItem of Object.values(spec.paths || {})) {
  for (const operation of Object.values(pathItem || {})) {
    if (
      typeof operation === "object" &&
      operation !== null &&
      "responses" in operation
    ) {
      const responses = operation.responses as Record<string, unknown>;
      for (const response of Object.values(responses)) {
        const responseObj = response as Record<string, unknown>;
        const content = responseObj?.content as
          | Record<string, unknown>
          | undefined;
        if (content?.["text/event-stream"]) {
          (operation as Record<string, unknown>)["x-is-sse"] = true;
          break;
        }
      }
    }
  }
}

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
