export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.sortField) params.set("sortField", String(query.sortField));
  if (query.sortDir) params.set("sortDir", String(query.sortDir));

  // Forward filter_* params
  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith("filter_") && value) {
      params.set(key, String(value));
    }
  }

  const qs = params.toString();
  const path = qs ? `/auth/companies?${qs}` : "/auth/companies";

  const companies = await proxyToGateway(event, path);
  return companies;
});
