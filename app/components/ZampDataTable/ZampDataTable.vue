<template>
  <div
    class="rounded-lg overflow-hidden bg-default divide-y divide-default ring ring-default px-8"
  >
    <!-- Header -->
    <div class="p-4 sm:px-6">
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 flex-1">
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
    </div>

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
          :items="resolvedItems"
          :visible-columns="visibleColumns"
          :loading="resolvedLoading"
          :error="resolvedError"
          :empty-message="emptyMessage"
          :page-size="tableState.pageSize.value"
          :selectable="selectable"
          :selected-items="selectedItems"
          :actions="actions"
          :has-actions="hasActions"
          :density="density"
          @retry="emit('retry')"
          @toggle-select="toggleSelect"
          @action-click="onRowActionClick"
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
    <div class="p-4 sm:px-6">
      <ZampDataTablePagination
        :page="tableState.page.value"
        :page-size="tableState.pageSize.value"
        :total="resolvedTotal"
        :page-size-options="tableState.pageSizeOptions"
        @update:page="tableState.setPage"
        @update:page-size="tableState.setPageSize"
      />
    </div>

    <UModal v-model:open="confirmOpen" :prevent-close="!actionLoading">
      <template #content>
        <LazyUCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ pendingAction?.confirmTitle ?? "Confirmar ação" }}
            </h3>
          </template>

          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{
              pendingAction?.confirmDescription ??
              "Tem certeza que deseja continuar?"
            }}
          </p>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                variant="outline"
                color="neutral"
                :disabled="actionLoading"
                :label="pendingAction?.cancelLabel ?? 'Cancelar'"
                @click="confirmOpen = false"
              />
              <UButton
                color="error"
                :loading="actionLoading"
                :label="pendingAction?.confirmLabel ?? 'Confirmar'"
                @click="confirmAndRun"
              />
            </div>
          </template>
        </LazyUCard>
      </template>
    </UModal>
  </div>
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
    items?: T[];
    total?: number;
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
    items: undefined,
    total: undefined,
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
const toast = useToast();

type RowActionPayload = { action: RowAction<T>; item: T };
const confirmOpen = ref(false);
const actionLoading = ref(false);
const pendingAction = ref<RowAction<T> | null>(null);
const pendingItem = ref<T | null>(null);

// --- Resolved data (prefer state over props) ---
const resolvedItems = computed<T[]>(
  () => props.items ?? tableState.items.value,
);
const resolvedTotal = computed<number>(
  () => props.total ?? tableState.total.value,
);
const resolvedLoading = computed<boolean>(
  () => props.loading || tableState.loading.value,
);
const resolvedError = computed<boolean | string>(
  () => props.error || tableState.error.value,
);

// --- Column visibility ---
const hiddenColumns = ref<Set<string>>(new Set());

// Load column visibility from localStorage
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
    resolvedItems.value.length > 0 &&
    selectedItems.value.length === resolvedItems.value.length,
);

const indeterminate = computed(
  () =>
    selectedItems.value.length > 0 &&
    selectedItems.value.length < resolvedItems.value.length,
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
    selectedItems.value = [...resolvedItems.value];
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

function isDestructiveAction(action: RowAction<T>): boolean {
  if (typeof action.confirm === "boolean") return action.confirm;

  const color = String(action.color ?? "").toLowerCase();
  const label = action.label.toLowerCase();
  const destructiveLabels = ["excluir", "remover", "deletar", "delete"];

  return (
    color === "error" || destructiveLabels.some((word) => label.includes(word))
  );
}

async function runAction(action: RowAction<T>, item: T): Promise<void> {
  actionLoading.value = true;
  const destructive = isDestructiveAction(action);

  try {
    await action.handler(item);

    if (destructive || action.successMessage) {
      toast.add({
        title: "Sucesso",
        description: action.successMessage ?? "Ação executada com sucesso.",
        color: "success",
      });
    }

    if (action.refreshOnSuccess && "refetch" in tableState) {
      const refetch = (tableState as { refetch?: () => Promise<void> | void })
        .refetch;
      await refetch?.();
    }
  } catch (err) {
    const fallback = "Não foi possível executar a ação.";
    const message =
      action.errorMessage ?? (err instanceof Error ? err.message : fallback);

    toast.add({
      title: "Erro",
      description: message,
      color: "error",
    });
  } finally {
    actionLoading.value = false;
  }
}

function onRowActionClick({ action, item }: RowActionPayload): void {
  if (!isDestructiveAction(action)) {
    void runAction(action, item);
    return;
  }

  pendingAction.value = action;
  pendingItem.value = item;
  confirmOpen.value = true;
}

async function confirmAndRun(): Promise<void> {
  if (!pendingAction.value || !pendingItem.value) {
    confirmOpen.value = false;
    return;
  }

  await runAction(pendingAction.value, pendingItem.value);
  confirmOpen.value = false;
  pendingAction.value = null;
  pendingItem.value = null;
}

watch(confirmOpen, (open) => {
  if (open) return;
  if (actionLoading.value) return;
  pendingAction.value = null;
  pendingItem.value = null;
});

// --- Emit fetch on state change (dedup to prevent double-fire on init) ---
let lastFetchKey = "";

watch(
  () => tableState.fetchParams.value,
  (params) => {
    const key = JSON.stringify(params);

    if (key === lastFetchKey) return;
    lastFetchKey = key;
    selectedItems.value = [];
    emit("fetch", params);
  },
  { deep: true, immediate: true },
);
</script>
