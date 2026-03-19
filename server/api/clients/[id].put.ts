import { proxyToGateway } from "../../utils/gateway";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  return await proxyToGateway(event, `/client/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
});
