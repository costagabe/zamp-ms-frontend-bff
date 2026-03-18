export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const user = await proxyToGateway(event, `/auth/users/${id}`);

  return user;
});
