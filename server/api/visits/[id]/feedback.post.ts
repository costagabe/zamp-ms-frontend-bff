import { proxyToGateway } from "../../../utils/gateway";

const BASE_PATH = "/property/visits";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  return await proxyToGateway(event, `${BASE_PATH}/${id}/feedback`, {
    method: "POST",
    body: JSON.stringify(body),
  });
});
