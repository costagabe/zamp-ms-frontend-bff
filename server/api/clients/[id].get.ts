import { proxyToGateway } from "../../utils/gateway";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  return await proxyToGateway(event, `/client/clients/${id}`);
});
