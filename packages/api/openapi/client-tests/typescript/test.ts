import { createConfiguration, DefaultApi, RequestContext } from "../../clients/typescript";

const configuration = createConfiguration({
  baseServer: {
    makeRequestContext(endpoint, httpMethod) {
      const newEndpoint = `https://localhost:3001/api${endpoint}`;
      console.log("endpoint!!!", newEndpoint);
      return new RequestContext(newEndpoint, httpMethod);
    },
  },
});
const apiInstance = new DefaultApi(configuration);

(async () => {
  // const data1 = await apiInstance.healthOk();
  // console.log("API called successfully. Returned data:", data1);

  console.log("\n=== Testing SSE endpoint healthLiveOk ===");
  await apiInstance.healthLiveOk(
    3, // max_outputs: only get 3 events
    (message: unknown) => {
      console.log(`[${new Date().toISOString()}] SSE Message received:`, message);
    },
    (error: Error) => {
      console.error(`[${new Date().toISOString()}] SSE Error received:`, error);
    },
    () => {
      console.log(`[${new Date().toISOString()}] SSE Stream completed`);
    }
  );
  console.log(`[${new Date().toISOString()}] === SSE test finished ===`);
})();
