export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  return await proxyToGateway(event, `/auth/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
});
