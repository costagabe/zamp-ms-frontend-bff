<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-3 border-t border-[var(--ui-border)] pt-4"
  >
    <span class="text-sm text-gray-500 dark:text-gray-400">
      Mostrando {{ rangeStart }}–{{ rangeEnd }} de {{ total }} resultados
    </span>

    <div class="grid grid-flow-col auto-cols-max items-center gap-3">
      <!-- Page size selector -->
      <div class="grid grid-flow-col auto-cols-max items-center gap-2">
        <span class="text-sm text-gray-500 dark:text-gray-400"
          >Por página:</span
        >
        <select
          :value="pageSize"
          class="text-sm rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-200 pl-2 pr-6 py-1"
          @change="
            emit(
              'update:page-size',
              Number(($event.target as HTMLSelectElement).value),
            )
          "
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>

      <!-- Page controls -->
      <div class="grid grid-flow-col auto-cols-max items-center gap-1">
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-chevrons-left"
          size="xs"
          :disabled="page <= 1"
          aria-label="Primeira página"
          @click="emit('update:page', 1)"
        />
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-chevron-left"
          size="xs"
          :disabled="page <= 1"
          aria-label="Página anterior"
          @click="emit('update:page', page - 1)"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300 px-2">
          {{ page }} / {{ totalPages }}
        </span>
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-chevron-right"
          size="xs"
          :disabled="page >= totalPages"
          aria-label="Próxima página"
          @click="emit('update:page', page + 1)"
        />
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-chevrons-right"
          size="xs"
          :disabled="page >= totalPages"
          aria-label="Última página"
          @click="emit('update:page', totalPages)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions: number[];
}>();

const emit = defineEmits<{
  "update:page": [page: number];
  "update:page-size": [size: number];
}>();

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.pageSize)),
);

const rangeStart = computed(() => {
  if (props.total === 0) return 0;
  return (props.page - 1) * props.pageSize + 1;
});

const rangeEnd = computed(() =>
  Math.min(props.page * props.pageSize, props.total),
);
</script>
