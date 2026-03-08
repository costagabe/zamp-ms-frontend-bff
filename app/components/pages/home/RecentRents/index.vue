<template>
  <UCard class="lg:col-span-2">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          Aluguéis recentes
        </h3>
        <UButton variant="link" size="sm" to="/rents">Ver todos</UButton>
      </div>
    </template>

    <div class="divide-y divide-gray-200 dark:divide-gray-700">
      <RentItem v-for="rent in rents" :key="rent.id" v-bind="rent" />
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import RentItem from "./components/RentItem.vue";

interface Rent {
  id: string;
  address: string;
  tenant: string;
  dueDate: string;
  value: string;
  statusLabel: string;
  statusColor: "warning" | "success" | "error";
}

defineProps<{ rents: Rent[] }>();
</script>
