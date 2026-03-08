<template>
  <div class="space-y-6">
    <PageHeader @create="openCreate" />

    <UsersList
      v-model="searchQuery"
      :users="filteredUsers"
      :loading="store.loading"
      @edit="openEdit"
      @delete="openDelete"
    />

    <DeleteUserModal
      v-model="showDeleteModal"
      :user="store.selectedUser"
      :loading="store.loading"
      @confirm="() => deleteUser(store.selectedUser!.id)"
    />
  </div>
</template>

<script lang="ts" setup>
import PageHeader from "~/components/pages/users/PageHeader.vue";
import UsersList from "~/components/pages/users/UsersList/index.vue";
import DeleteUserModal from "~/components/pages/users/DeleteUserModal.vue";
import { useUsersPage } from "~/composables/users/useUsersPage";

definePageMeta({ layout: "default" });

const {
  store,
  searchQuery,
  filteredUsers,
  showDeleteModal,
  loadUsers,
  deleteUser,
  openCreate,
  openEdit,
  openDelete,
} = useUsersPage();

onMounted(() => {
  loadUsers();
});
</script>
