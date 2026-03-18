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
interface Company {
  id: string;
  name: string;
  cnpj: string;
}

const { data } = await useFetch<Company[]>("/api/companies/my");

const items = computed(() => data.value ?? []);

const selectedId = ref<string | undefined>(
  items.value.length ? items.value[0]!.id : undefined,
);

watch(items, (list) => {
  if (list.length && !selectedId.value) {
    selectedId.value = list[0]!.id;
  }
});
</script>
