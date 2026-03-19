import { proxyToGateway } from "../../utils/gateway";

const BASE_PATH = "/address/addresses";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  return await proxyToGateway(event, `${BASE_PATH}/${id}`, {
    method: "DELETE",
  });
});
