<template>
  <div class="app-dt">
    <div v-if="$slots['header-right']" class="app-dt__header-actions">
      <slot name="header-right" />
    </div>

    <DataTable
      :value="displayData"
      :loading="false"
      scrollable
      :scroll-height="computedScrollHeight"
      :row-class="rowClass"
      :data-key="rowKey"
      :virtual-scroller-options="mode === 'client' ? virtualScrollerOpts : undefined"
      :lazy="mode === 'server'"
      :paginator="mode === 'server'"
      :rows="pageSize"
      :rows-per-page-options="pageSizeOptions"
      :total-records="totalRecords"
      :selection="internalSelected"
      :selection-mode="selectable ? 'multiple' : undefined"
      class="app-dt__table"
      @row-click="onRowClick"
      @sort="onSort"
      @page="onPage"
      @update:selection="onSelectionUpdate"
    >
      <Column
        v-if="selectable"
        selection-mode="multiple"
        :frozen="true"
        align-frozen="left"
        :header-style="{ width: '48px', minWidth: '48px' }"
        :body-style="{ width: '48px', minWidth: '48px' }"
        class="app-dt__col-checkbox"
      />

      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :sortable="col.sortable"
        :frozen="col.frozen"
        :align-frozen="col.frozen ? 'left' : undefined"
        :style="colStyle(col)"
        :header-style="colStyle(col)"
        class="app-dt__col"
        :class="`app-dt__col--${col.align ?? 'left'}`"
      >
        <template #header>
          <span class="app-dt__col-header">
            {{ col.header }}
            <button
              v-if="col.filterable"
              class="app-dt__filter-btn"
              :class="{ 'app-dt__filter-btn--active': hasActiveFilter(col.field) }"
              :aria-label="`Filter ${col.header}`"
              @click.stop="toggleFilter(col)"
            >
              <AppIcon name="mdi:filter" :size="13" />
            </button>
          </span>
          <div
            v-if="openFilterField === col.field && col.filterOptions"
            class="app-dt__filter-popover"
            @click.stop
          >
            <label
              v-for="opt in col.filterOptions"
              :key="opt.value"
              class="app-dt__filter-option"
            >
              <input
                type="checkbox"
                :checked="isFilterActive(col.field, opt.value)"
                @change="toggleFilterOption(col.field, opt.value)"
              />
              {{ opt.label }}
            </label>
            <button class="app-dt__filter-clear" @click="clearFieldFilter(col.field)">Clear</button>
          </div>
        </template>

        <template #body="{ data: row, index }">
          <template v-if="loading || row == null">
            <AppSkeleton variant="rect" height="20px" />
          </template>
          <template v-else-if="$slots[`${col.field}-body`]">
            <slot :name="`${col.field}-body`" :data="row" :index="index" />
          </template>
          <template v-else>
            <span
              v-if="col.truncate"
              class="app-dt__cell-truncate"
              :title="String(getCellValue(row, col.field) ?? '')"
            >{{ formatCell(row, col) }}</span>
            <span v-else>{{ formatCell(row, col) }}</span>
          </template>
        </template>
      </Column>

      <template #empty>
        <slot v-if="$slots.empty" name="empty" />
        <AppEmptyState
          v-else
          icon="mdi:inbox-outline"
          :title="emptyMessage ?? 'No data available'"
        />
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, triggerRef, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import AppIcon from '../app-icon/AppIcon.vue'
import AppEmptyState from '../app-empty-state/AppEmptyState.vue'
import AppSkeleton from '../app-skeleton/AppSkeleton.vue'
import type { AppDataTableProps, AppLazyLoadEvent, AppTableColumn, AppVirtualLoadEvent } from './AppDataTable.type'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const props = withDefaults(defineProps<AppDataTableProps<any>>(), {
  mode: 'client',
  lazyScroll: false,
  rowHeight: 48,
  bufferCount: 10,
  pageSize: 50,
  pageSizeOptions: () => [25, 50, 100],
  selectable: false,
  selectedRows: () => [],
  rowKey: 'id',
  emptyMessage: 'No data available',
  loading: false,
})

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'update:selectedRows': [rows: any[]]
  'lazy-load': [event: AppLazyLoadEvent]
  'virtual-load': [event: AppVirtualLoadEvent]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'row-click': [row: any]
  'sort': [field: string, order: 1 | -1]
  'filter': [filters: Record<string, string[]>]
}>()

// ── Frozen data for client mode ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const frozenData = shallowRef<any[]>([])
watch(
  () => props.data,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (val) => { frozenData.value = Object.freeze([...val]) as any[] },
  { immediate: true },
)

const displayData = computed(() => (props.mode === 'client' ? frozenData.value : props.data))

const computedScrollHeight = computed(() => props.scrollHeight ?? 'flex')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onVirtualLoad(event: any) {
  emit('virtual-load', { first: event.first as number, last: event.last as number })
}

const virtualScrollerOpts = computed(() => ({
  itemSize: props.rowHeight,
  numToleratedItems: props.bufferCount,
  lazy: props.lazyScroll,
  ...(props.lazyScroll ? { onLazyLoad: onVirtualLoad } : {}),
}))

// ── Row alternating class — PrimeVue expects (data: any) => string ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowClass(_data: any): string {
  return ''
}

// ── Column style ──
function colStyle(col: AppTableColumn): Record<string, string> {
  const style: Record<string, string> = {}
  if (col.width) style.width = col.width
  if (col.minWidth) style.minWidth = col.minWidth
  return style
}

// ── Cell helpers ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCellValue(row: any, field: string): unknown {
  return (row as Record<string, unknown>)[field]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatCell(row: any, col: AppTableColumn): string {
  const val = getCellValue(row, col.field)
  if (val == null || val === '') return '—'
  return col.unit ? `${val}${col.unit}` : String(val)
}

// ── Selection ──
const internalSelected = computed(() => props.selectedRows)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSelectionUpdate(rows: readonly any[] | null) {
  emit('update:selectedRows', rows ? [...rows] : [])
}

// ── Filter state ──
const activeFilters = ref<Record<string, string[]>>({})
const openFilterField = ref<string | null>(null)

function hasActiveFilter(field: string): boolean {
  return (activeFilters.value[field]?.length ?? 0) > 0
}

function isFilterActive(field: string, value: string): boolean {
  return activeFilters.value[field]?.includes(value) ?? false
}

function toggleFilter(col: AppTableColumn) {
  openFilterField.value = openFilterField.value === col.field ? null : col.field
}

function toggleFilterOption(field: string, value: string) {
  const current = activeFilters.value[field] ?? []
  if (current.includes(value)) {
    activeFilters.value = { ...activeFilters.value, [field]: current.filter((v) => v !== value) }
  } else {
    activeFilters.value = { ...activeFilters.value, [field]: [...current, value] }
  }
  emit('filter', { ...activeFilters.value })
}

function clearFieldFilter(field: string) {
  const { [field]: _removed, ...rest } = activeFilters.value
  activeFilters.value = rest
  openFilterField.value = null
  emit('filter', { ...activeFilters.value })
}

// ── Sort ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onSort(event: any) {
  if (event.sortField && typeof event.sortField === 'string') {
    emit('sort', event.sortField, event.sortOrder as 1 | -1)
  }
}

// ── Pagination ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onPage(event: any) {
  const lazyEvent: AppLazyLoadEvent = {
    first: event.first,
    rows: event.rows,
    page: event.page,
    filters: { ...activeFilters.value },
  }
  emit('lazy-load', lazyEvent)
}

// ── Row click ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onRowClick(event: any) {
  emit('row-click', event.data)
}
</script>

<style scoped>
.app-dt {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.app-dt__table {
  flex: 1;
  min-height: 0;
}

.app-dt__header-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-bottom: var(--space-3);
}

.app-dt__table :deep(.p-datatable-header-cell) {
  background-color: var(--color-table-header-bg);
  height: var(--table-header-height);
  font-size: var(--table-cell-font-size);
  font-weight: var(--table-header-font-weight);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-table-border);
  padding: 0 var(--table-cell-px);
  white-space: nowrap;
  position: relative;
}

.app-dt__table :deep(.p-datatable-tbody > tr > td) {
  height: var(--table-row-height);
  font-size: var(--table-cell-font-size);
  font-weight: var(--table-cell-font-weight);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-table-border);
  padding: 0 var(--table-cell-px);
}

.app-dt__table :deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background-color: var(--color-table-row-alt);
}

.app-dt__table :deep(.p-datatable-tbody > tr:hover > td) {
  background-color: var(--color-table-row-hover);
}

/* ── Selected rows ── */

/* Background + strip default gray border-bottom */
.app-dt__table :deep(.p-datatable-tbody > tr[aria-selected="true"] > td) {
  background-color: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface)) !important;
  border-bottom: none !important;
}

/* Left / Right borders (box-shadow: layout-neutral) */
.app-dt__table :deep(.p-datatable-tbody > tr[aria-selected="true"] > td:first-child) {
  box-shadow: inset 2px 0 0 var(--color-primary);
}
.app-dt__table :deep(.p-datatable-tbody > tr[aria-selected="true"] > td:last-child) {
  box-shadow: inset -2px 0 0 var(--color-primary);
}

/* Top border: borrow the border-bottom of the non-selected row directly above */
.app-dt__table :deep(.p-datatable-tbody > tr:not([aria-selected="true"]):has(+ tr[aria-selected="true"]) > td) {
  border-bottom: 2px solid var(--color-primary) !important;
}
/* Top border fallback: first selected row is also the first table row */
.app-dt__table :deep(.p-datatable-tbody > tr[aria-selected="true"]:first-child > td) {
  border-top: 2px solid var(--color-primary) !important;
}

/* Bottom border: only on the last row of the consecutive group */
.app-dt__table :deep(.p-datatable-tbody > tr[aria-selected="true"]:not(:has(+ tr[aria-selected="true"])) > td) {
  border-bottom: 2px solid var(--color-primary) !important;
}

/* 1px separator between consecutive selected rows (no stacking) */
.app-dt__table :deep(.p-datatable-tbody > tr[aria-selected="true"] + tr[aria-selected="true"] > td) {
  border-top: 1px solid color-mix(in srgb, var(--color-primary) 25%, transparent) !important;
}

.app-dt__col--center :deep(.p-column-header-content),
.app-dt__col--center :deep(td) {
  text-align: center;
  justify-content: center;
}

.app-dt__col--right :deep(.p-column-header-content) {
  justify-content: flex-end;
}

.app-dt__col-header {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.app-dt__filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  transition: color var(--duration-fast) var(--easing-default);
}

.app-dt__filter-btn:hover,
.app-dt__filter-btn--active {
  color: var(--color-primary);
}

.app-dt__filter-popover {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: var(--z-dropdown);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-3);
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.app-dt__filter-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.app-dt__filter-clear {
  margin-top: var(--space-1);
  border: none;
  background: none;
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.app-dt__cell-truncate {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
