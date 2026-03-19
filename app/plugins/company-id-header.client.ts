export default defineNuxtPlugin(() => {
  const companyStore = useCompanyStore();

  companyStore.hydrateFromStorage();

  const originalFetch = globalThis.$fetch;

  globalThis.$fetch = originalFetch.create({
    onRequest({ request, options }) {
      const isApiRequest =
        typeof request === "string" && request.startsWith("/api/");

      if (!isApiRequest) return;

      const companyId = companyStore.currentCompany;
      if (!companyId) return;

      const headers = new Headers(options.headers as HeadersInit | undefined);
      headers.set("companyId", companyId);
      options.headers = headers;
    },
  }) as typeof globalThis.$fetch;
});
