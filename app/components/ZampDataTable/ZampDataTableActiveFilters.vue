<template>
  <div v-if="activeFilters.length" class="flex flex-wrap items-center gap-2">
    <UBadge
      v-for="filter in activeFilters"
      :key="filter.key"
      color="primary"
      variant="subtle"
      size="sm"
      class="gap-1"
    >
      {{ filter.label }}: {{ filter.value }}
      <button
        type="button"
        class="ml-1 hover:text-red-500 transition-colors"
        @click="emit('remove-filter', filter.key)"
      >
        <UIcon name="i-lucide-x" class="w-3 h-3" />
      </button>
    </UBadge>
    <UButton
      v-if="activeFilters.length > 1"
      variant="ghost"
      color="neutral"
      size="xs"
      icon="i-lucide-x-circle"
      label="Limpar todos"
      @click="emit('clear-filters')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { ZampDataTableColumn } from "~/types/zamp-data-table";

const props = defineProps<{
  columns: ZampDataTableColumn<any>[];
  filters: Record<string, string>;
}>();

const emit = defineEmits<{
  "remove-filter": [key: string];
  "clear-filters": [];
}>();

const activeFilters = computed(() => {
  return Object.entries(props.filters).map(([key, value]) => {
    const col = props.columns.find((c) => c.key === key);
    return { key, label: col?.label ?? key, value };
  });
});
</script>
