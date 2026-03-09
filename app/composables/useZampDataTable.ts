import { ref, computed, watch, type Ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import type {
  SortState,
  FetchParams,
  ZampDataTableColumn,
} from "~/types/zamp-data-table";

export interface UseZampDataTableOptions {
  defaultPage?: number;
  defaultPageSize?: number;
  defaultSort?: SortState;
  pageSizeOptions?: number[];
  syncWithUrl?: boolean;
}

export function useZampDataTable<T = Record<string, unknown>>(
  columns: Ref<ZampDataTableColumn<T>[]> | ZampDataTableColumn<T>[],
  options: UseZampDataTableOptions = {},
) {
  const {
    defaultPage = 1,
    defaultPageSize = 10,
    defaultSort = { field: "", direction: null },
    pageSizeOptions = [5, 10, 25],
    syncWithUrl = true,
  } = options;

  const route = useRoute();
  const router = useRouter();

  // --- State ---
  const page = ref(defaultPage);
  const pageSize = ref(defaultPageSize);
  const sort = ref<SortState>({ ...defaultSort });
  const filters = ref<Record<string, string>>({});
  const pendingFilters = ref<Record<string, string>>({});

  // --- URL Sync: read initial state ---
  if (syncWithUrl) {
    const q = route.query;
    if (q.page) page.value = Number(q.page);
    if (q.pageSize) pageSize.value = Number(q.pageSize);
    if (q.sortField && typeof q.sortField === "string") {
      sort.value = {
        field: q.sortField,
        direction: (q.sortDir as "asc" | "desc") ?? "asc",
      };
    }
    const resolvedColumns = toValue(columns);
    for (const col of resolvedColumns) {
      if (col.filterable) {
        const val = q[`filter_${col.key}`];
        if (val && typeof val === "string") {
          filters.value[col.key] = val;
          pendingFilters.value[col.key] = val;
        }
      }
    }
  }

  // --- Computed fetch params ---
  const fetchParams = computed<FetchParams>(() => ({
    page: page.value,
    pageSize: pageSize.value,
    sort: { ...sort.value },
    filters: { ...filters.value },
  }));

  // --- Debounced filter commit ---
  const commitFilters = useDebounceFn(() => {
    const cleaned: Record<string, string> = {};
    for (const [key, value] of Object.entries(pendingFilters.value)) {
      if (value.trim()) cleaned[key] = value.trim();
    }
    filters.value = cleaned;
    page.value = 1;
  }, 300);

  function setFilter(key: string, value: string) {
    pendingFilters.value = { ...pendingFilters.value, [key]: value };
    commitFilters();
  }

  function removeFilter(key: string) {
    const next = { ...pendingFilters.value };
    delete next[key];
    pendingFilters.value = next;
    const nextFilters = { ...filters.value };
    delete nextFilters[key];
    filters.value = nextFilters;
    page.value = 1;
  }

  function clearFilters() {
    pendingFilters.value = {};
    filters.value = {};
    page.value = 1;
  }

  // --- Sort ---
  function toggleSort(field: string) {
    if (sort.value.field === field) {
      if (sort.value.direction === "asc") {
        sort.value = { field, direction: "desc" };
      } else if (sort.value.direction === "desc") {
        sort.value = { field: "", direction: null };
      } else {
        sort.value = { field, direction: "asc" };
      }
    } else {
      sort.value = { field, direction: "asc" };
    }
    page.value = 1;
  }

  // --- Pagination ---
  function setPage(p: number) {
    page.value = p;
  }

  function setPageSize(size: number) {
    pageSize.value = size;
    page.value = 1;
  }

  // --- URL Sync: write state changes ---
  if (syncWithUrl) {
    watch(
      fetchParams,
      (params) => {
        const query: Record<string, string> = {};
        query.page = String(params.page);
        query.pageSize = String(params.pageSize);
        if (params.sort.field && params.sort.direction) {
          query.sortField = params.sort.field;
          query.sortDir = params.sort.direction;
        }
        for (const [key, value] of Object.entries(params.filters)) {
          query[`filter_${key}`] = value;
        }
        router.replace({ query });
      },
      { deep: true },
    );
  }

  return {
    page,
    pageSize,
    sort,
    filters,
    pendingFilters,
    pageSizeOptions,
    fetchParams,
    setFilter,
    removeFilter,
    clearFilters,
    toggleSort,
    setPage,
    setPageSize,
  };
}
