import { proxyToGateway } from "../../utils/gateway";

const BASE_PATH = "/property/key-handovers";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return await proxyToGateway(event, BASE_PATH, {
    method: "POST",
    body: JSON.stringify(body),
  });
});
