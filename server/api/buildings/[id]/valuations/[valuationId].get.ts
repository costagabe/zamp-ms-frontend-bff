const BASE_PATH = "/property/buildings";

export default defineEventHandler(async (event) => {
  const buildingId = getRouterParam(event, "id");
  const valuationId = getRouterParam(event, "valuationId");

  return await proxyToGateway(
    event,
    `${BASE_PATH}/${buildingId}/valuations/${valuationId}`,
  );
});
