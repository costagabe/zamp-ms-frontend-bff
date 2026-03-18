export type ColumnType =
  | "text"
  | "badge"
  | "date"
  | "boolean"
  | "avatar"
  | "custom";

export type SortDirection = "asc" | "desc" | null;

export type Density = "comfortable" | "compact";

export interface ZampDataTableColumn<T = Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: ColumnType;
  slotName?: string;
  hideOnMobile?: boolean;
}

export interface SortState {
  field: string;
  direction: SortDirection;
}

export interface FetchParams {
  page: number;
  pageSize: number;
  sort: SortState;
  filters: Record<string, string>;
}

export interface BulkAction {
  label: string;
  icon: string;
  action: string;
}

export interface RowAction<T = Record<string, unknown>> {
  label: string;
  icon: string;
  color?: string;
  handler: (item: T) => void | Promise<void>;
  visible?: (item: T) => boolean;
  /** Force confirmation dialog before executing */
  confirm?: boolean;
  /** Custom confirmation dialog content */
  confirmTitle?: string;
  confirmDescription?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Toast messages shown after action execution */
  successMessage?: string;
  errorMessage?: string;
  /** Refresh table data after success when state.refetch is available */
  refreshOnSuccess?: boolean;
}
