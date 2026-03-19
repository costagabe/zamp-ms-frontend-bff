<template>
  <div class="space-y-6">
    <ZampDataTable
      :columns="columns"
      :state="tableState"
      :actions="rowActions"
      storage-key="buildings-table"
      empty-message="Nenhum imóvel encontrado."
      @retry="onRetry"
    >
      <template #toolbar>
        <div class="flex flex-wrap items-center gap-3">
          <UButton
            icon="i-lucide-plus"
            label="Novo imóvel"
            @click="openCreate"
          />

          <USelect
            v-model="tableState.pendingFilters.status"
            :options="statusFilters"
            value-attribute="value"
            option-attribute="label"
            placeholder="Status"
            class="w-44"
            @change="commitFilters('status')"
          />

          <USelect
            v-model="tableState.pendingFilters.propertyType"
            :options="propertyTypeFilters"
            value-attribute="value"
            option-attribute="label"
            placeholder="Tipo"
            class="w-44"
            @change="commitFilters('propertyType')"
          />

          <UInput
            v-model="tableState.pendingFilters.city"
            placeholder="Cidade"
            icon="i-lucide-search"
            class="w-56"
            @input="commitFilters('city')"
          />

          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-eraser"
            label="Limpar filtros"
            @click="clearFilters()"
          />
        </div>
      </template>

      <template #cell-address="{ item }">
        <div class="text-sm text-gray-900 dark:text-white">
          {{ formatAddress(item.address) }}
        </div>
        <div class="text-xs text-gray-500">
          {{ item.address.city }} - {{ item.address.state }}
        </div>
      </template>

      <template #cell-status="{ item }">
        <UBadge variant="soft" size="xs" :class="statusBadgeClass(item.status)">
          {{ statusLabel(item.status) }}
        </UBadge>
      </template>

      <template #cell-propertyType="{ item }">
        <UBadge variant="subtle" size="xs">
          {{ propertyTypeLabel(item.propertyType) }}
        </UBadge>
      </template>

      <template #cell-rentValue="{ item }">
        <span class="text-gray-800 dark:text-gray-100">
          {{ formatCurrency(item.rentValue) }}
        </span>
      </template>

      <template #cell-saleValue="{ item }">
        <span class="text-gray-800 dark:text-gray-100">
          {{ formatCurrency(item.saleValue) }}
        </span>
      </template>
    </ZampDataTable>
  </div>
</template>

<script lang="ts" setup>
import { useBuildingsPage } from "~/composables/buildings/useBuildingsPage";
import { useZampDataTable } from "~/composables/useZampDataTable";
import type { ZampDataTableColumn, RowAction } from "~/types/zamp-data-table";
import type { Building } from "~/types/building";

definePageMeta({ layout: "default", title: "Imóveis" });

const { consumeFlash } = useFlashMessage();
const { store, openCreate, openEdit, openDetails } = useBuildingsPage();

onMounted(() => consumeFlash());

const columns: ZampDataTableColumn<Building>[] = [
  { key: "address", label: "Endereço", type: "custom", filterable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    filterable: true,
    type: "custom",
  },
  {
    key: "propertyType",
    label: "Tipo",
    sortable: true,
    filterable: true,
    type: "custom",
  },
  {
    key: "rentValue",
    label: "Aluguel",
    sortable: true,
    type: "custom",
    hideOnMobile: true,
  },
  {
    key: "saleValue",
    label: "Venda",
    sortable: true,
    type: "custom",
    hideOnMobile: true,
  },
];

const tableState = useZampDataTable<Building>(columns, {
  fetchUrl: "/api/buildings",
});

const rowActions: RowAction<Building>[] = [
  {
    label: "Detalhes",
    icon: "i-lucide-eye",
    handler: openDetails,
  },
  {
    label: "Editar",
    icon: "i-lucide-pencil",
    handler: openEdit,
  },
  {
    label: "Excluir",
    icon: "i-lucide-trash",
    color: "error",
    confirm: true,
    confirmTitle: "Excluir imóvel",
    confirmDescription:
      "Tem certeza que deseja remover este imóvel? Essa ação não pode ser desfeita.",
    confirmLabel: "Excluir",
    cancelLabel: "Cancelar",
    successMessage: "Imóvel removido com sucesso.",
    errorMessage: "Não foi possível remover o imóvel.",
    refreshOnSuccess: true,
    handler: async (item) => {
      await store.remove(item.id);
    },
  },
];

const statusFilters = [
  { label: "Disponível", value: "AVAILABLE" },
  { label: "Alugado", value: "RENTED" },
  { label: "Manutenção", value: "MAINTENANCE" },
  { label: "Inativo", value: "INACTIVE" },
];

const propertyTypeFilters = [
  { label: "Casa", value: "HOUSE" },
  { label: "Apartamento", value: "APARTMENT" },
  { label: "Comercial", value: "COMMERCIAL" },
  { label: "Terreno", value: "LAND" },
  { label: "Fazenda", value: "FARM" },
];

function formatAddress(address: Building["address"]) {
  if (!address) return "-";
  return `${address.street}, ${address.number} - ${address.neighbourhood}`;
}

function formatCurrency(value?: number | null) {
  if (!value && value !== 0) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

function statusLabel(status: Building["status"]): string {
  switch (status) {
    case "AVAILABLE":
      return "Disponível";
    case "RENTED":
      return "Alugado";
    case "MAINTENANCE":
      return "Manutenção";
    case "INACTIVE":
      return "Inativo";
    default:
      return status;
  }
}

function statusBadgeClass(status: Building["status"]) {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200";
    case "RENTED":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200";
    case "MAINTENANCE":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
  }
}

function propertyTypeLabel(type: Building["propertyType"]): string {
  switch (type) {
    case "HOUSE":
      return "Casa";
    case "APARTMENT":
      return "Apartamento";
    case "COMMERCIAL":
      return "Comercial";
    case "LAND":
      return "Terreno";
    case "FARM":
      return "Fazenda";
    default:
      return type;
  }
}

function commitFilters(key: string) {
  const value = tableState.pendingFilters[key] ?? "";
  tableState.setFilter(key, value as string);
}

function clearFilters() {
  tableState.clearFilters();
}

function onRetry() {
  tableState.refetch();
}
</script>
