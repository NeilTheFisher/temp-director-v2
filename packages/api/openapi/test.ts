import {
  createConfiguration,
  DefaultApi,
  RequestContext,
} from "./clients/typescript";

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
  // const request: DefaultApiEventsListEventsLiveRequest = {
  //   body: null,
  // };

  // const data = await apiInstance.eventsListEventsLive(request);

  const data1 = await apiInstance.healthOk();
  console.log("API called successfully. Returned data:", data1);

  const data = await apiInstance.healthLiveOk(2);
  // while (Bun.peek.status(data) === "pending") {
  //   console.log("Waiting for data...", Bun.peek(data));
  // }
  console.log("API called successfully. Returned data:", data);
})();
