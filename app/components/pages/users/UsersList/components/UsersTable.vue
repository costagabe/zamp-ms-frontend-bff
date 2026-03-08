<template>
  <div class="overflow-x-auto">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon
        name="i-lucide-loader-2"
        class="w-6 h-6 animate-spin text-gray-400"
      />
    </div>

    <div v-else-if="users.length === 0" class="text-center py-12">
      <UIcon
        name="i-lucide-users"
        class="w-10 h-10 text-gray-300 mx-auto mb-3"
      />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Nenhum usuário encontrado
      </p>
    </div>

    <table v-else class="w-full text-sm">
      <thead>
        <tr
          class="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
        >
          <th class="pb-3 font-medium">Nome</th>
          <th class="pb-3 font-medium hidden sm:table-cell">E-mail</th>
          <th class="pb-3 font-medium">Papel</th>
          <th class="pb-3 font-medium">Status</th>
          <th class="pb-3 font-medium text-right">Ações</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <UserRow
          v-for="user in users"
          :key="user.id"
          v-bind="user"
          @edit="emit('edit', user)"
          @delete="emit('delete', user)"
        />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { User } from "~/types/user";
import UserRow from "./UserRow.vue";

defineProps<{
  users: User[];
  loading: boolean;
}>();

const emit = defineEmits<{
  edit: [user: User];
  delete: [user: User];
}>();
</script>
