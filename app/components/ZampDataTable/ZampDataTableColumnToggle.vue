<template>
  <UDropdownMenu :items="dropdownItems">
    <UButton
      variant="ghost"
      color="neutral"
      icon="i-lucide-columns-3"
      size="xs"
      aria-label="Visibilidade de colunas"
    />
  </UDropdownMenu>
</template>

<script lang="ts" setup>
import type { ZampDataTableColumn } from "~/types/zamp-data-table";

const props = defineProps<{
  columns: ZampDataTableColumn<any>[];
  hiddenColumns: Set<string>;
}>();

const emit = defineEmits<{
  "toggle-column": [key: string];
}>();

const dropdownItems = computed(() => [
  props.columns.map((col) => ({
    label: col.label,
    icon: props.hiddenColumns.has(col.key)
      ? "i-lucide-eye-off"
      : "i-lucide-eye",
    onSelect: () => emit("toggle-column", col.key),
  })),
]);
</script>
