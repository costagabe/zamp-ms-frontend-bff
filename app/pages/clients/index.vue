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
        <span class="font-medium text-gray-900 dark:text-white">
          {{ item.name }}
        </span>
      </template>

      <template #cell-personType="{ item }">
        <UBadge variant="subtle" size="sm">
          {{ item.personType === "PF" ? "Pessoa física" : "Pessoa jurídica" }}
        </UBadge>
      </template>

      <template #cell-phone="{ item }">
        <span class="text-gray-600 dark:text-gray-400">
          {{ formatPhone(item.phone) || "-" }}
        </span>
      </template>

      <template #cell-cpf="{ item }">
        <span class="text-gray-600 dark:text-gray-400">
          {{ formatDocument(item.cpf, item.cnpj) || "-" }}
        </span>
      </template>

      <template #cell-clientTypes="{ item }">
        <div class="flex flex-wrap gap-1">
          <UBadge
            v-for="type in item.clientTypes"
            :key="type"
            variant="soft"
            size="xs"
            :class="['w-24 justify-center', clientTypeBadgeClass(type)]"
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

definePageMeta({ layout: "default", title: "Clientes" });

const { consumeFlash } = useFlashMessage();
const { store, openCreate, openEdit } = useClientsPage();

onMounted(() => consumeFlash());

const columns: ZampDataTableColumn<Client>[] = [
  {
    key: "name",
    label: "Nome",
    sortable: true,
    filterable: true,
    type: "custom",
  },
  {
    key: "email",
    label: "E-mail",
    sortable: true,
    filterable: true,
  },
  {
    key: "phone",
    label: "Telefone",
    sortable: false,
    filterable: true,
    type: "custom",
    hideOnMobile: true,
  },
  {
    key: "cpf",
    label: "CPF/CNPJ",
    sortable: false,
    filterable: true,
    type: "custom",
    hideOnMobile: true,
  },
  {
    key: "personType",
    label: "Tipo de pessoa",
    type: "custom",
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

function clientTypeBadgeClass(type: Client["clientTypes"][number]): string {
  if (type === "LESSEE") {
    return "bg-blue-100 text-blue-700 ring-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:ring-blue-500/30";
  }

  return "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:ring-violet-500/30";
}

function formatPhone(value?: string | null): string {
  const digits = String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatDocument(cpf?: string | null, cnpj?: string | null): string {
  const cpfDigits = String(cpf ?? "").replace(/\D/g, "").slice(0, 11);
  if (cpfDigits.length === 11) {
    return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3, 6)}.${cpfDigits.slice(6, 9)}-${cpfDigits.slice(9)}`;
  }

  const cnpjDigits = String(cnpj ?? "").replace(/\D/g, "").slice(0, 14);
  if (cnpjDigits.length === 14) {
    return `${cnpjDigits.slice(0, 2)}.${cnpjDigits.slice(2, 5)}.${cnpjDigits.slice(5, 8)}/${cnpjDigits.slice(8, 12)}-${cnpjDigits.slice(12)}`;
  }

  return "";
}
</script>
