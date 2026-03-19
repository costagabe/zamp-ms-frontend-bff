const STORAGE_KEY = "zamp:current-company-id";

interface CompanySelectionStorage {
  load(): string | null;
  save(companyId: string | null): void;
}

export const useCompanySelectionStorage = (): CompanySelectionStorage => {
  const cookie = useCookie<string | null>(STORAGE_KEY, {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  const load = (): string | null => {
    // Use a cookie so SSR and client bootstrap from the same value.
    return cookie.value ?? null;
  };

  const save = (companyId: string | null): void => {
    cookie.value = companyId;

    if (!import.meta.client) return;

    if (companyId) {
      localStorage.setItem(STORAGE_KEY, companyId);
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    load,
    save,
  };
};
