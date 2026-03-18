<template>
  <USelect
    v-model="selectedId"
    :items="items"
    value-key="id"
    label-key="name"
    size="sm"
    placeholder="Selecione uma empresa"
  />
</template>

<script lang="ts" setup>
import type { Company } from "~/types/company";

const { data } = await useFetch<Company[]>("/api/companies/my");
const companyStore = useCompanyStore();

const items = computed(() => data.value ?? []);

const selectedId = computed<string | undefined>({
  get: () => companyStore.currentCompany ?? undefined,
  set: (id) => {
    companyStore.setCurrentCompany(id ?? null);
  },
});

watch(
  data,
  (list) => {
    companyStore.syncCurrentCompany(list);
  },
  { immediate: true },
);

onMounted(() => {
  companyStore.hydrateFromStorage();
  companyStore.syncCurrentCompany(data.value);
});
</script>
