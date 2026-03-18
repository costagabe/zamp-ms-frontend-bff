<template>
  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
    <!-- Loading skeleton -->
    <template v-if="loading">
      <tr v-for="row in pageSize" :key="`skeleton-${row}`">
        <td v-if="selectable" :class="cellPadding">
          <USkeleton class="w-4 h-4 rounded" />
        </td>
        <td
          v-for="col in visibleColumns"
          :key="`skeleton-${row}-${col.key}`"
          :class="[cellPadding, col.hideOnMobile ? 'hidden sm:table-cell' : '']"
        >
          <div v-if="col.type === 'avatar'" class="flex items-center gap-3">
            <USkeleton class="w-8 h-8 rounded-full" />
            <USkeleton class="w-24 h-4 rounded" />
          </div>
          <USkeleton
            v-else-if="col.type === 'badge' || col.type === 'boolean'"
            class="w-16 h-5 rounded-full"
          />
          <USkeleton v-else class="w-32 h-4 rounded" />
        </td>
        <td v-if="hasActions" :class="cellPadding">
          <div class="flex justify-end gap-1">
            <USkeleton class="w-7 h-7 rounded" />
            <USkeleton class="w-7 h-7 rounded" />
          </div>
        </td>
      </tr>
    </template>

    <!-- Error state -->
    <tr v-else-if="error">
      <td :colspan="totalCols" class="text-center py-12">
        <UIcon
          name="i-lucide-alert-triangle"
          class="w-10 h-10 text-red-400 mx-auto mb-3"
        />
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {{
            typeof error === "string"
              ? error
              : "Ocorreu um erro ao carregar os dados."
          }}
        </p>
        <UButton
          variant="soft"
          color="error"
          size="sm"
          icon="i-lucide-refresh-cw"
          label="Tentar novamente"
          @click="emit('retry')"
        />
      </td>
    </tr>

    <!-- Empty state -->
    <tr v-else-if="items.length === 0">
      <td :colspan="totalCols" class="text-center py-12">
        <slot name="empty">
          <UIcon
            name="i-lucide-inbox"
            class="w-10 h-10 text-gray-300 mx-auto mb-3"
          />
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ emptyMessage }}
          </p>
        </slot>
      </td>
    </tr>

    <!-- Data rows -->
    <template v-else>
      <tr
        v-for="(item, idx) in items"
        :key="idx"
        class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
        :class="{ 'bg-primary-50 dark:bg-primary-900/20': isSelected(item) }"
      >
        <td v-if="selectable" :class="cellPadding">
          <input
            type="checkbox"
            class="rounded border-gray-300 dark:border-gray-600"
            :checked="isSelected(item)"
            @change="emit('toggle-select', item)"
          />
        </td>
        <td
          v-for="col in visibleColumns"
          :key="col.key"
          :class="[cellPadding, col.hideOnMobile ? 'hidden sm:table-cell' : '']"
        >
          <!-- Custom slot -->
          <slot
            v-if="col.type === 'custom'"
            :name="`cell-${col.slotName ?? col.key}`"
            :item="item"
            :value="(item as any)[col.key]"
          />

          <!-- Avatar -->
          <div
            v-else-if="col.type === 'avatar'"
            class="flex items-center gap-3"
          >
            <UAvatar size="sm" :alt="String((item as any)[col.key])" />
            <span class="font-medium text-gray-900 dark:text-white">
              {{ (item as any)[col.key] }}
            </span>
          </div>

          <!-- Badge -->
          <UBadge v-else-if="col.type === 'badge'" variant="subtle" size="sm">
            {{ (item as any)[col.key] }}
          </UBadge>

          <!-- Boolean -->
          <UBadge
            v-else-if="col.type === 'boolean'"
            :color="(item as any)[col.key] ? 'success' : 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ (item as any)[col.key] ? "Sim" : "Não" }}
          </UBadge>

          <!-- Date -->
          <span
            v-else-if="col.type === 'date'"
            class="text-gray-600 dark:text-gray-400"
          >
            {{ formatDate((item as any)[col.key]) }}
          </span>

          <!-- Text (default) -->
          <span v-else class="text-gray-600 dark:text-gray-400">
            {{ (item as any)[col.key] }}
          </span>
        </td>

        <!-- Actions column -->
        <td v-if="hasActions" :class="[cellPadding, 'text-right']">
          <slot name="actions" :item="item">
            <div class="flex items-center justify-end gap-1">
              <template
                v-for="action in visibleActions(item)"
                :key="action.label"
              >
                <UButton
                  variant="ghost"
                  :color="(action.color as any) ?? 'neutral'"
                  :icon="action.icon"
                  size="xs"
                  :aria-label="action.label"
                  @click="emit('action-click', { action, item })"
                />
              </template>
            </div>
          </slot>
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import type {
  ZampDataTableColumn,
  RowAction,
  Density,
} from "~/types/zamp-data-table";

const props = defineProps<{
  items: T[];
  visibleColumns: ZampDataTableColumn<T>[];
  loading: boolean;
  error: boolean | string;
  emptyMessage: string;
  pageSize: number;
  selectable: boolean;
  selectedItems: T[];
  actions: RowAction<T>[];
  hasActions: boolean;
  density: Density;
}>();

const emit = defineEmits<{
  retry: [];
  "toggle-select": [item: T];
  "action-click": [payload: { action: RowAction<T>; item: T }];
}>();

defineSlots<{
  empty?(): any;
  actions?(props: { item: T }): any;
  // accept any cell-* slot forwarded from the parent
  [key: string]: ((props: any) => any) | undefined;
}>();

const cellPadding = computed(() =>
  props.density === "compact" ? "py-2 pr-2 pl-1" : "py-3 pr-4 pl-1",
);

const totalCols = computed(() => {
  let count = props.visibleColumns.length;
  if (props.selectable) count++;
  if (props.hasActions) count++;
  return count;
});

function isSelected(item: T): boolean {
  return props.selectedItems.includes(item);
}

function visibleActions(item: T): RowAction<T>[] {
  return props.actions.filter((a) => !a.visible || a.visible(item));
}

function formatDate(value: unknown): string {
  if (!value) return "";
  const date = new Date(String(value));
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("pt-BR");
}
</script>
