import { proxyToGateway } from "../../../utils/gateway";

const BASE_PATH = "/file/files";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return await proxyToGateway(event, `${BASE_PATH}/${id}/download`);
});
