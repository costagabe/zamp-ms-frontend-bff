<template>
  <UCard>
    <template #header>
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">
        Ações rápidas
      </h3>
    </template>

    <div class="space-y-2">
      <UButton
        v-for="action in actions"
        :key="action.label"
        :to="action.to"
        :icon="action.icon"
        variant="soft"
        block
        class="justify-start"
      >
        {{ action.label }}
      </UButton>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
interface QuickAction {
  label: string;
  icon: string;
  to: string;
}

defineProps<{ actions: QuickAction[] }>();
</script>
