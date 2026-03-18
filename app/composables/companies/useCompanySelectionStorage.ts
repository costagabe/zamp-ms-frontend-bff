const STORAGE_KEY = "zamp:current-company-id";

interface CompanySelectionStorage {
  load(): string | null;
  save(companyId: string | null): void;
}

export const useCompanySelectionStorage = (): CompanySelectionStorage => {
  const load = (): string | null => {
    if (!import.meta.client) return null;
    return localStorage.getItem(STORAGE_KEY);
  };

  const save = (companyId: string | null): void => {
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
