import { proxyToGateway } from "../../../utils/gateway";

const BASE_PATH = "/property/buildings";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return await proxyToGateway(event, `${BASE_PATH}/${id}/documents`);
});
