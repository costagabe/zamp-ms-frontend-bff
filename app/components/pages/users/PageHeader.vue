<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
  >
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Usuários</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Gerencie os usuários do sistema
      </p>
    </div>
    <UButton
      icon="i-lucide-user-plus"
      label="Novo usuário"
      @click="emit('create')"
    />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{ create: [] }>();
</script>
