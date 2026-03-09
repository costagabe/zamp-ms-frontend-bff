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
  handler: (item: T) => void;
  visible?: (item: T) => boolean;
}
