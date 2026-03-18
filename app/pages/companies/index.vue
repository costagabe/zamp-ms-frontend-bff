<template>
  <div class="space-y-6">
    <ZampDataTable
      :columns="columns"
      :state="tableState"
      :selectable="true"
      :actions="rowActions"
      storage-key="companies-table"
      empty-message="Nenhuma empresa encontrada."
      @retry="onRetry"
    >
      <template #toolbar>
        <UButton
          icon="i-lucide-plus"
          label="Nova empresa"
          @click="openCreate"
        />
      </template>

      <template #cell-name="{ item }">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-briefcase" class="w-5 h-5 text-gray-400" />
          <span class="font-medium text-gray-900 dark:text-white">{{
            item.name
          }}</span>
        </div>
      </template>

      <template #cell-cnpj="{ item }">
        <span class="text-gray-600 dark:text-gray-400 font-mono text-sm">
          {{ formatCNPJ(item.cnpj) }}
        </span>
      </template>
    </ZampDataTable>
  </div>
</template>

<script lang="ts" setup>
import { useZampDataTable } from "~/composables/useZampDataTable";
import type { ZampDataTableColumn, RowAction } from "~/types/zamp-data-table";

interface Company {
  id: string;
  name: string;
  cnpj: string;
}

definePageMeta({ layout: "default", title: "Empresas" });

const router = useRouter();
const { consumeFlash } = useFlashMessage();

onMounted(() => consumeFlash());

// --- Table state with auto-fetch ---
const columns: ZampDataTableColumn<Company>[] = [
  {
    key: "name",
    label: "Nome",
    sortable: true,
    filterable: true,
    type: "custom",
  },
  {
    key: "cnpj",
    label: "CNPJ",
    sortable: true,
    filterable: true,
    type: "custom",
  },
];

const tableState = useZampDataTable<Company>(columns, {
  fetchUrl: "/api/companies",
});

function onRetry(): void {
  tableState.refetch();
}

// --- Row actions ---
const rowActions: RowAction<Company>[] = [
  {
    label: "Editar",
    icon: "i-lucide-pencil",
    color: "neutral",
    handler: (company) => openEdit(company),
  },
  {
    label: "Excluir",
    icon: "i-lucide-trash-2",
    color: "error",
    confirm: true,
    confirmTitle: "Confirmar exclusão",
    confirmDescription:
      "Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.",
    confirmLabel: "Excluir",
    successMessage: "Empresa excluída com sucesso!",
    errorMessage: "Não foi possível excluir a empresa.",
    refreshOnSuccess: true,
    handler: async (company) => {
      await $fetch(`/api/companies/${company.id}`, {
        method: "DELETE" as any,
      });
    },
  },
];

function openCreate(): void {
  router.push("/companies/create");
}

function openEdit(company: Company): void {
  router.push(`/companies/${company.id}`);
}

function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}
</script>
