<template>
  <div
    v-if="selectedCount > 0"
    class="flex items-center gap-3 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
  >
    <span class="text-sm font-medium text-primary-700 dark:text-primary-300">
      {{ selectedCount }}
      {{ selectedCount === 1 ? "item selecionado" : "itens selecionados" }}
    </span>
    <div class="flex items-center gap-1">
      <UButton
        v-for="action in bulkActions"
        :key="action.action"
        variant="soft"
        color="primary"
        size="xs"
        :icon="action.icon"
        :label="action.label"
        @click="emit('bulk-action', action.action)"
      />
    </div>
    <UButton
      variant="ghost"
      color="neutral"
      size="xs"
      icon="i-lucide-x"
      label="Limpar seleção"
      @click="emit('clear-selection')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { BulkAction } from "~/types/zamp-data-table";

defineProps<{
  selectedCount: number;
  bulkActions: BulkAction[];
}>();

const emit = defineEmits<{
  "bulk-action": [action: string];
  "clear-selection": [];
}>();
</script>
