<template>
  <thead>
    <tr
      class="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
    >
      <th v-if="selectable" class="pb-3 pl-2 w-10">
        <input
          type="checkbox"
          class="rounded border-gray-300 dark:border-gray-600"
          :checked="allSelected"
          :indeterminate="indeterminate"
          @change="emit('toggle-all')"
        />
      </th>
      <th
        v-for="col in visibleColumns"
        :key="col.key"
        class="font-medium"
        :class="[
          density === 'compact' ? 'pb-2 pr-2' : 'pb-3 pr-4',
          col.hideOnMobile ? 'hidden sm:table-cell' : '',
        ]"
      >
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-1">
            <button
              v-if="col.sortable"
              type="button"
              class="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
              @click="emit('toggle-sort', col.key)"
            >
              {{ col.label }}
              <UIcon
                v-if="sort.field === col.key && sort.direction === 'asc'"
                name="i-lucide-arrow-up"
                class="w-3.5 h-3.5"
              />
              <UIcon
                v-else-if="sort.field === col.key && sort.direction === 'desc'"
                name="i-lucide-arrow-down"
                class="w-3.5 h-3.5"
              />
              <UIcon
                v-else
                name="i-lucide-arrow-up-down"
                class="w-3.5 h-3.5 opacity-30"
              />
            </button>
            <span v-else>{{ col.label }}</span>
          </div>
          <UInput
            v-if="col.filterable"
            :model-value="pendingFilters[col.key] ?? ''"
            :placeholder="`Filtrar ${col.label.toLowerCase()}...`"
            size="xs"
            :ui="{ root: 'max-w-48' }"
            icon="i-lucide-search"
            @update:model-value="
              (v: string | number) => emit('set-filter', col.key, String(v))
            "
          />
        </div>
      </th>
      <th
        v-if="hasActions"
        class="font-medium text-right"
        :class="density === 'compact' ? 'pb-2' : 'pb-3'"
      >
        Ações
      </th>
    </tr>
  </thead>
</template>

<script lang="ts" setup>
import type {
  ZampDataTableColumn,
  SortState,
  Density,
} from "~/types/zamp-data-table";

defineProps<{
  visibleColumns: ZampDataTableColumn<any>[];
  sort: SortState;
  pendingFilters: Record<string, string>;
  selectable: boolean;
  allSelected: boolean;
  indeterminate: boolean;
  hasActions: boolean;
  density: Density;
}>();

const emit = defineEmits<{
  "toggle-sort": [field: string];
  "set-filter": [key: string, value: string];
  "toggle-all": [];
}>();
</script>
