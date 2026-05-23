export interface AppTableColumn {
  field: string
  header: string
  width?: string
  minWidth?: string
  sortable?: boolean
  filterable?: boolean
  filterOptions?: { label: string; value: string }[]
  frozen?: boolean
  truncate?: boolean
  align?: 'left' | 'center' | 'right'
  unit?: string
}

export type DataTableMode = 'client' | 'server'

export interface AppLazyLoadEvent {
  first: number
  rows: number
  page: number
  sortField?: string
  sortOrder?: 1 | -1 | 0
  filters: Record<string, string[]>
}

export interface AppVirtualLoadEvent {
  first: number
  last: number
}

export interface AppDataTableProps<T = Record<string, unknown>> {
  columns: AppTableColumn[]
  data: T[]
  loading?: boolean
  mode?: DataTableMode
  lazyScroll?: boolean
  rowHeight?: number
  scrollHeight?: string
  bufferCount?: number
  totalRecords?: number
  pageSize?: number
  pageSizeOptions?: number[]
  selectable?: boolean
  selectedRows?: T[]
  rowKey?: string
  emptyMessage?: string
}
