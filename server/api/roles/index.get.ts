export default defineEventHandler(async (event) => {
  return await proxyToGateway(event, "/auth/roles");
});
