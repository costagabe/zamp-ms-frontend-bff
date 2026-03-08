<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-search" class="w-4 h-4 text-gray-400" />
        <UInput
          :model-value="modelValue"
          placeholder="Buscar por nome ou e-mail..."
          variant="none"
          class="flex-1"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </div>
    </template>

    <UsersTable
      :users="users"
      :loading="loading"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    />
  </UCard>
</template>

<script lang="ts" setup>
import type { User } from "~/types/user";
import UsersTable from "./components/UsersTable.vue";

defineProps<{
  users: User[];
  loading: boolean;
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  edit: [user: User];
  delete: [user: User];
}>();
</script>
