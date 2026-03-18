import type { Company } from "~/types/company";
import { useCompanySelectionStorage } from "~/composables/companies/useCompanySelectionStorage";

export const useCompanyStore = defineStore("company", () => {
  const currentCompany = ref<string | null>(null);
  const storage = useCompanySelectionStorage();
  const hydrated = ref(false);

  function hydrateFromStorage() {
    if (hydrated.value) return;

    currentCompany.value = storage.load();
    hydrated.value = true;
  }

  function setCurrentCompany(companyId: string | null) {
    currentCompany.value = companyId;
    storage.save(companyId);
  }

  function syncCurrentCompany(companies?: Company[] | null) {
    hydrateFromStorage();

    if (!companies) return;

    if (!companies.length) {
      setCurrentCompany(null);
      return;
    }

    const hasCurrent = companies.some(
      (company) => company.id === currentCompany.value,
    );
    if (hasCurrent) return;

    const persistedId = storage.load();
    const hasPersisted = companies.some(
      (company) => company.id === persistedId,
    );

    if (hasPersisted) {
      setCurrentCompany(persistedId);
      return;
    }

    setCurrentCompany(companies[0]?.id ?? null);
  }

  return {
    currentCompany,
    hydrateFromStorage,
    setCurrentCompany,
    syncCurrentCompany,
  };
});
