<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          Contratos vencendo em breve
        </h3>
        <UButton variant="link" size="sm" to="/contracts">Ver todos</UButton>
      </div>
    </template>

    <ContractsTable :contracts="contracts" />
  </UCard>
</template>

<script lang="ts" setup>
import ContractsTable from "./components/ContractsTable.vue";

interface Contract {
  id: string;
  address: string;
  tenant: string;
  endDate: string;
  rentValue: string;
}

defineProps<{ contracts: Contract[] }>();
</script>
