import { proxyToGateway } from "../../../../utils/gateway";

const BASE_PATH = "/property/buildings";

export default defineEventHandler(async (event) => {
  const buildingId = getRouterParam(event, "id");
  const query = getQuery(event);
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, String(value));
  }

  const qs = params.toString();
  const path = qs
    ? `${BASE_PATH}/${buildingId}/valuations?${qs}`
    : `${BASE_PATH}/${buildingId}/valuations`;

  return await proxyToGateway(event, path);
});
