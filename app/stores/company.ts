import type { Company } from "~/types/company";
import { useCompanySelectionStorage } from "~/composables/companies/useCompanySelectionStorage";

export const useCompanyStore = defineStore("company", () => {
  const currentCompany = ref<string | null>(null);
  const storage = useCompanySelectionStorage();
  const hydrated = ref(false);

  function hydrateFromStorage() {
    if (hydrated.value) return;

    const persistedId = storage.load();
    if (persistedId) {
      currentCompany.value = persistedId;
    }

    hydrated.value = true;
  }

  function setCurrentCompany(
    companyId: string | null,
    options: { persist?: boolean } = {},
  ) {
    const { persist = true } = options;

    currentCompany.value = companyId;
    if (persist) {
      storage.save(companyId);
    }
  }

  function syncCurrentCompany(companies?: Company[] | null) {
    if (!companies) return;

    if (!companies.length) {
      setCurrentCompany(null, { persist: false });
      return;
    }

    const hasCurrent = companies.some(
      (company) => company.id === currentCompany.value,
    );
    if (hasCurrent) return;

    setCurrentCompany(companies[0]?.id ?? null, { persist: false });
  }

  return {
    currentCompany,
    hydrateFromStorage,
    setCurrentCompany,
    syncCurrentCompany,
  };
});
