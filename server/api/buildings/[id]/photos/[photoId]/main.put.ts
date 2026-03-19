import { proxyToGateway } from "../../../../../utils/gateway";

const BASE_PATH = "/property/buildings";

export default defineEventHandler(async (event) => {
  const buildingId = getRouterParam(event, "id");
  const photoId = getRouterParam(event, "photoId");

  return await proxyToGateway(
    event,
    `${BASE_PATH}/${buildingId}/photos/${photoId}/main`,
    {
      method: "PUT",
    },
  );
});
