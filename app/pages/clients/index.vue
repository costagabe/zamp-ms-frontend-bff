<template>
  <div class="space-y-6">
    <ZampDataTable
      :columns="columns"
      :state="tableState"
      :selectable="true"
      :actions="rowActions"
      storage-key="clients-table"
      empty-message="Nenhum cliente encontrado."
      @retry="onRetry"
    >
      <template #toolbar>
        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-plus"
            label="Novo cliente"
            @click="openCreate"
          />
        </div>
      </template>

      <template #cell-name="{ item }">
        <div class="flex flex-col">
          <span class="font-medium text-gray-900 dark:text-white">
            {{ item.name }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ item.email || "—" }}
          </span>
        </div>
      </template>

      <template #cell-personType="{ item }">
        <UBadge variant="subtle" size="sm">
          {{ item.personType === "PF" ? "Pessoa física" : "Pessoa jurídica" }}
        </UBadge>
      </template>

      <template #cell-clientTypes="{ item }">
        <div class="flex flex-wrap gap-1">
          <UBadge
            v-for="type in item.clientTypes"
            :key="type"
            variant="soft"
            size="xs"
          >
            {{ clientTypeLabel(type) }}
          </UBadge>
        </div>
      </template>
    </ZampDataTable>
  </div>
</template>

<script lang="ts" setup>
import { useClientsPage } from "~/composables/clients/useClientsPage";
import { useZampDataTable } from "~/composables/useZampDataTable";
import type { ZampDataTableColumn, RowAction } from "~/types/zamp-data-table";
import type { Client } from "~/types/client";
import CompanySelector from "~/components/global/CompanySelector.vue";

definePageMeta({ layout: "default", title: "Clientes" });

const { consumeFlash } = useFlashMessage();
const { store, openCreate, openEdit } = useClientsPage();

onMounted(() => consumeFlash());

const columns: ZampDataTableColumn<Client>[] = [
  {
    key: "name",
    label: "Cliente",
    sortable: true,
    filterable: true,
    type: "custom",
  },
  {
    key: "phone",
    label: "Telefone",
    sortable: false,
    filterable: true,
    hideOnMobile: true,
  },
  {
    key: "personType",
    label: "Tipo de pessoa",
    type: "custom",
    filterable: true,
  },
  { key: "clientTypes", label: "Tipos", type: "custom" },
];

const tableState = useZampDataTable<Client>(columns, {
  fetchUrl: "/api/clients",
});

function onRetry(): void {
  tableState.refetch();
}

const rowActions: RowAction<Client>[] = [
  {
    label: "Editar",
    icon: "i-lucide-pencil",
    color: "neutral",
    handler: (client) => openEdit(client),
  },
  {
    label: "Excluir",
    icon: "i-lucide-trash-2",
    color: "error",
    confirm: true,
    confirmTitle: "Confirmar exclusão",
    confirmDescription:
      "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.",
    confirmLabel: "Excluir",
    successMessage: "Cliente excluído com sucesso!",
    errorMessage: "Não foi possível excluir o cliente.",
    refreshOnSuccess: true,
    handler: async (client) => {
      await store.remove(client.id);
    },
  },
];

function clientTypeLabel(type: Client["clientTypes"][number]): string {
  const map: Record<string, string> = {
    LESSEE: "Locatário",
    LESSOR: "Locador",
  };
  return map[type] ?? type;
}
</script>
