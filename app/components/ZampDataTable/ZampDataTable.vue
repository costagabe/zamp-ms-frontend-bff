<template>
  <UCard>
    <template #header>
      <div class="grid grid-cols-1 gap-3">
        <div class="grid grid-cols-[1fr_auto] items-center gap-3">
          <div class="grid grid-flow-col auto-cols-max gap-2">
            <slot name="toolbar" />
          </div>
          <ZampDataTableColumnToggle
            :columns="columns"
            :hidden-columns="hiddenColumns"
            @toggle-column="toggleColumnVisibility"
          />
        </div>

        <!-- Bulk actions bar -->
        <ZampDataTableBulkActions
          v-if="selectable"
          :selected-count="selectedItems.length"
          :bulk-actions="bulkActions"
          @bulk-action="onBulkAction"
          @clear-selection="clearSelection"
        />

        <!-- Active filters -->
        <ZampDataTableActiveFilters
          :columns="columns"
          :filters="tableState.filters.value"
          @remove-filter="tableState.removeFilter"
          @clear-filters="tableState.clearFilters"
        />
      </div>
    </template>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <ZampDataTableHeader
          :visible-columns="visibleColumns"
          :sort="tableState.sort.value"
          :pending-filters="tableState.pendingFilters.value"
          :selectable="selectable"
          :all-selected="allSelected"
          :indeterminate="indeterminate"
          :has-actions="hasActions"
          :density="density"
          @toggle-sort="tableState.toggleSort"
          @set-filter="tableState.setFilter"
          @toggle-all="toggleAll"
        />
        <ZampDataTableBody
          :items="items"
          :visible-columns="visibleColumns"
          :loading="loading"
          :error="error"
          :empty-message="emptyMessage"
          :page-size="tableState.pageSize.value"
          :selectable="selectable"
          :selected-items="selectedItems"
          :actions="actions"
          :has-actions="hasActions"
          :density="density"
          @retry="emit('retry')"
          @toggle-select="toggleSelect"
        >
          <template #empty>
            <slot name="empty" />
          </template>
          <template #actions="{ item }">
            <slot name="actions" :item="item" />
          </template>
          <template
            v-for="col in customColumns"
            :key="col.key"
            #[`cell-${col.slotName??col.key}`]="{ item, value }"
          >
            <slot
              :name="`cell-${col.slotName ?? col.key}`"
              :item="item"
              :value="value"
            />
          </template>
        </ZampDataTableBody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pt-4">
      <ZampDataTablePagination
        :page="tableState.page.value"
        :page-size="tableState.pageSize.value"
        :total="total"
        :page-size-options="tableState.pageSizeOptions"
        @update:page="tableState.setPage"
        @update:page-size="tableState.setPageSize"
      />
    </div>
  </UCard>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import type {
  ZampDataTableColumn,
  RowAction,
  BulkAction,
  Density,
  FetchParams,
} from "~/types/zamp-data-table";
import {
  useZampDataTable,
  type UseZampDataTableOptions,
} from "~/composables/useZampDataTable";
import ZampDataTableHeader from "./ZampDataTableHeader.vue";
import ZampDataTableBody from "./ZampDataTableBody.vue";
import ZampDataTablePagination from "./ZampDataTablePagination.vue";
import ZampDataTableBulkActions from "./ZampDataTableBulkActions.vue";
import ZampDataTableActiveFilters from "./ZampDataTableActiveFilters.vue";
import ZampDataTableColumnToggle from "./ZampDataTableColumnToggle.vue";

const props = withDefaults(
  defineProps<{
    columns: ZampDataTableColumn<T>[];
    items: T[];
    total: number;
    loading?: boolean;
    error?: boolean | string;
    emptyMessage?: string;
    selectable?: boolean;
    actions?: RowAction<T>[];
    bulkActions?: BulkAction[];
    density?: Density;
    storageKey?: string;
    pageSizeOptions?: number[];
    /** Pass an external composable state to control the table externally */
    state?: ReturnType<typeof useZampDataTable<T>>;
  }>(),
  {
    loading: false,
    error: false,
    emptyMessage: "Nenhum resultado encontrado.",
    selectable: false,
    actions: () => [],
    bulkActions: () => [],
    density: "comfortable",
    storageKey: "zamp-table",
    pageSizeOptions: () => [5, 10, 25],
  },
);

const emit = defineEmits<{
  fetch: [params: FetchParams];
  retry: [];
  "selection-change": [items: T[]];
  "bulk-action": [action: string, items: T[]];
}>();

// --- Table state (external or internal) ---
const internalState = props.state
  ? undefined
  : useZampDataTable<T>(props.columns, {
      pageSizeOptions: props.pageSizeOptions,
    } satisfies UseZampDataTableOptions);

const tableState = (props.state ?? internalState)!;

// --- Column visibility ---
const hiddenColumns = ref<Set<string>>(new Set());

// Load from localStorage
onMounted(() => {
  try {
    const stored = localStorage.getItem(`${props.storageKey}:columns`);
    if (stored) {
      hiddenColumns.value = new Set(JSON.parse(stored));
    }
  } catch {
    // ignore
  }
});

function toggleColumnVisibility(key: string) {
  const next = new Set(hiddenColumns.value);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  hiddenColumns.value = next;
  try {
    localStorage.setItem(
      `${props.storageKey}:columns`,
      JSON.stringify([...next]),
    );
  } catch {
    // ignore
  }
}

const visibleColumns = computed(() =>
  props.columns.filter((col) => !hiddenColumns.value.has(col.key)),
);

const customColumns = computed(() =>
  props.columns.filter((col) => col.type === "custom"),
);

const hasActions = computed(
  () => props.actions.length > 0 || !!useSlots().actions,
);

// --- Selection ---
const selectedItems = ref<T[]>([]) as Ref<T[]>;

const allSelected = computed(
  () =>
    props.items.length > 0 && selectedItems.value.length === props.items.length,
);

const indeterminate = computed(
  () =>
    selectedItems.value.length > 0 &&
    selectedItems.value.length < props.items.length,
);

function toggleSelect(item: T) {
  const idx = selectedItems.value.indexOf(item);
  if (idx >= 0) {
    selectedItems.value.splice(idx, 1);
  } else {
    selectedItems.value.push(item);
  }
  emit("selection-change", [...selectedItems.value]);
}

function toggleAll() {
  if (allSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = [...props.items];
  }
  emit("selection-change", [...selectedItems.value]);
}

function clearSelection() {
  selectedItems.value = [];
  emit("selection-change", []);
}

function onBulkAction(action: string) {
  emit("bulk-action", action, [...selectedItems.value]);
}

// --- Emit fetch on state change ---
watch(
  () => tableState.fetchParams.value,
  (params) => {
    selectedItems.value = [];
    emit("fetch", params);
  },
  { immediate: true, deep: true },
);
</script>
