import { proxyToGateway } from "../../utils/gateway";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return await proxyToGateway(event, "/client/clients", {
    method: "POST",
    body: JSON.stringify(body),
  });
});
