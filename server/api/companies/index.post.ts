export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return await proxyToGateway(event, "/auth/companies", {
    method: "POST",
    body: JSON.stringify(body),
  });
});
