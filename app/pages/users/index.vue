<template>
  <div class="space-y-6">
    <ZampDataTable
      :columns="columns"
      :items="users"
      :total="total"
      :loading="loading"
      :error="error"
      :selectable="true"
      :actions="rowActions"
      storage-key="users-table"
      empty-message="Nenhum usuário encontrado."
      @fetch="onFetch"
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
import { useUsersService } from "~/composables/users/useUsersService";
import type {
  ZampDataTableColumn,
  RowAction,
  FetchParams,
} from "~/types/zamp-data-table";
import type { User } from "~/types/user";

definePageMeta({ layout: "default" });

const { consumeFlash } = useFlashMessage();
const service = useUsersService();

const { store, showDeleteModal, deleteUser, openCreate, openEdit, openDelete } =
  useUsersPage();

onMounted(() => consumeFlash());

// --- Table data ---
const users = ref<User[]>([]);
const total = ref(0);
const loading = ref(false);
const error = ref(false);

async function onFetch(params: FetchParams) {
  console.log("Fetch users with params:", params);
  loading.value = true;
  error.value = false;
  try {
    const data = await service.fetchPaginated(params);
    users.value = data.content;
    total.value = data.totalElements;
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

function onRetry() {
  // Re-trigger fetch via a fetchParams watcher inside the composable;
  // emitting @retry causes the table to re-emit @fetch automatically
  error.value = false;
}

// --- Column definitions ---
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
