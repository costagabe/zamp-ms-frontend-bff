import { proxyToGateway } from "../../utils/gateway";

const BASE_PATH = "/document/documents";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, String(value));
  }

  const qs = params.toString();
  const path = qs ? `${BASE_PATH}?${qs}` : BASE_PATH;
  return await proxyToGateway(event, path);
});
