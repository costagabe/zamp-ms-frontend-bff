export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  return await proxyToGateway(event, `/auth/companies/${id}`);
});
