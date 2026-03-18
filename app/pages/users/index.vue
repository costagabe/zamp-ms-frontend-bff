<template>
  <div class="space-y-6">
    <ZampDataTable
      :columns="columns"
      :state="tableState"
      :selectable="true"
      :actions="rowActions"
      storage-key="users-table"
      empty-message="Nenhum usuário encontrado."
      @retry="onRetry"
    >
      <template #toolbar>
        <UButton
          icon="i-lucide-plus"
          label="Novo usuário"
          @click="openCreate"
        />
      </template>

      <template #cell-name="{ item }">
        <div class="flex items-center gap-3">
          <UAvatar size="sm" :alt="item.name" />
          <span class="font-medium text-gray-900 dark:text-white">{{
            item.name
          }}</span>
        </div>
      </template>

      <template #cell-situation="{ item }">
        <UBadge
          :color="item.situation === 'ACTIVE' ? 'success' : 'neutral'"
          variant="subtle"
          size="sm"
        >
          {{ item.situation === "ACTIVE" ? "Ativo" : "Inativo" }}
        </UBadge>
      </template>

      <template #cell-roles="{ item }">
        <UBadge v-if="item.roles.length" variant="subtle" size="sm">
          {{ item.roles[0]!.name }}
        </UBadge>
        <span v-else class="text-gray-400 text-xs">—</span>
      </template>
    </ZampDataTable>

    <DeleteUserModal
      v-model="showDeleteModal"
      :user="store.selectedUser"
      :loading="store.loading"
      @confirm="() => deleteUser(store.selectedUser!.id)"
    />
  </div>
</template>

<script lang="ts" setup>
import DeleteUserModal from "~/components/pages/users/DeleteUserModal.vue";
import { useUsersPage } from "~/composables/users/useUsersPage";
import { useZampDataTable } from "~/composables/useZampDataTable";
import type { ZampDataTableColumn, RowAction } from "~/types/zamp-data-table";
import type { User } from "~/types/user";

definePageMeta({ layout: "default" });

const { consumeFlash } = useFlashMessage();

const { store, showDeleteModal, deleteUser, openCreate, openEdit, openDelete } =
  useUsersPage();

onMounted(() => consumeFlash());

// --- Table state with auto-fetch ---
const columns: ZampDataTableColumn<User>[] = [
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
    hideOnMobile: true,
  },
  { key: "roles", label: "Papel", type: "custom" },
  { key: "situation", label: "Status", type: "custom" },
];

const tableState = useZampDataTable<User>(columns, {
  fetchUrl: "/api/users",
});

function onRetry(): void {
  tableState.setPage(tableState.page.value);
}

// --- Row actions ---
const rowActions: RowAction<User>[] = [
  {
    label: "Editar",
    icon: "i-lucide-pencil",
    color: "neutral",
    handler: (user) => openEdit(user),
  },
  {
    label: "Excluir",
    icon: "i-lucide-trash-2",
    color: "error",
    handler: (user) => openDelete(user),
  },
];
</script>
