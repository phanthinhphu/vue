# AppDataTable — Research & Design Decisions

## TL;DR — Kết luận quan trọng

PrimeVue DataTable có **3 chế độ load** và **nhiều bug cần tránh**.
Dưới đây là toàn bộ phân tích để chọn đúng strategy cho 10,000 dòng.

---

## 1. Các chế độ load data

### Chế độ A — All-at-once + VirtualScroller (DOM virtualization only)

```
Server → [10,000 rows JSON] → VirtualScroller renders ~30 DOM nodes lúc nào cũng
```

**Khi nào dùng**: Dataset ≤ 10k rows, payload JSON chấp nhận được (~2-5MB)
**Pros**: Đơn giản nhất, filter/sort client-side cực nhanh, không bug
**Cons**: Initial load chậm nếu payload lớn, tốn RAM

```vue
<DataTable
  :value="allRows"           <!-- tất cả 10k rows -->
  scrollable
  scrollHeight="600px"       <!-- KHÔNG dùng "flex" -->
  :virtualScrollerOptions="{
    itemSize: 48              <!-- phải khớp chính xác CSS row height -->
  }"
/>
```

---

### Chế độ B — VirtualScroller + Lazy (infinite scroll từ server)

```
Scroll → onLazyLoad({ first: 0, rows: 100 }) → fetch page → fill array slot
```

**Cơ chế**: Pre-initialize array với `null` slots bằng `totalRecords`,
fill dần khi scroll đến vùng chưa load.

**Known bugs quan trọng** (GitHub issues #6870, #2729):
- `event.first` thỉnh thoảng luôn trả về `0` khi scroll
- Scroll position reset về top sau khi lazy load xong
- Không trigger `onLazyLoad` đều đặn khi scroll nhanh

**Workaround**:
```javascript
const loadLazy = (event) => {
  const { first, last } = event
  // Check nếu slot đã load rồi thì skip
  if (virtualItems.value[first] !== undefined) return
  // Fetch chunk từ first → last
  fetchChunk(first, last - first)
}
```

**Khi nào dùng**: UX infinite scroll, server-side data, totalRecords lớn (>50k)

---

### Chế độ C — Paginator + Lazy (server-side pagination)

```
Click page/sort/filter → @lazyLoad({ first, rows, sortField, filters }) → fetch page → replace value
```

**Đây là chế độ ổn định nhất**, được recommend cho production.

```vue
<DataTable
  :value="currentPageRows"    <!-- chỉ current page -->
  lazy
  :totalRecords="10000"
  paginator
  :rows="50"
  @sort="onSort"
  @filter="onFilter"
  @page="onPage"
/>
```

**Event payload** (`DataTablePageEvent`):
```typescript
{
  first: number       // row index của đầu trang
  rows: number        // page size
  page: number        // current page (0-indexed)
  pageCount: number
  sortField: string
  sortOrder: 1 | -1 | 0
  filters: Record<string, DataTableFilterMeta>
}
```

---

## 2. Bug Matrix quan trọng

| Feature Combo | Status | Giải pháp |
|---|---|---|
| `scrollHeight="flex"` + `virtualScrollerOptions` | ❌ Table biến mất | Dùng pixel height: `"600px"` |
| Frozen columns > 2 + virtualScroller | ❌ Chỉ 2 cols đầu frozen | Giới hạn ≤ 2 frozen columns |
| `itemSize` sai + virtualScroller | ⚠️ Scroll bar sai, flicker | Đo chính xác CSS row height |
| `autoSize: true` | ❌ Không hoạt động | Không dùng, hardcode `itemSize` |
| Dynamic row height + virtualScroller | ❌ Layout thrash | Tất cả rows phải fixed height |
| Select all 10k rows | ⚠️ UI freeze | Dùng "select all records" pattern (không select DOM) |

---

## 3. Performance rules cho 10,000 dòng

### Rule 1: Object.freeze() cho data array
```typescript
// BAD — Vue tạo reactive proxy cho 10,000 objects → overhead lớn
const rows = ref<Container[]>(data)

// GOOD — display-only data không cần reactive deep
const rows = ref<Container[]>(Object.freeze(data))
// Hoặc dùng shallowRef
const rows = shallowRef<Container[]>(data)
```

### Rule 2: itemSize phải khớp CSS tuyệt đối
```
itemSize = padding-top + content-height + padding-bottom + border
Ví dụ: 8px + 30px + 8px + 2px = 48px → itemSize: 48
```
Nếu sai → scrollbar tính sai → jump khi scroll.

### Rule 3: numToleratedItems buffer
```javascript
virtualScrollerOptions: {
  itemSize: 48,
  numToleratedItems: 10,  // render thêm 10 rows ngoài viewport để tránh flicker
  delay: 200,             // debounce 200ms cho lazy load events
}
```

### Rule 4: Không dùng computed trong template cell cho 10k rows
```vue
<!-- BAD: computed chạy 10,000 lần khi re-render -->
<template #body="{ data }">
  {{ expensiveComputed(data) }}
</template>

<!-- GOOD: pre-process data trước khi đưa vào DataTable -->
const processedRows = computed(() =>
  rows.value.map(r => ({ ...r, displayStatus: STATUS_LABEL[r.status] }))
)
```

### Rule 5: v-memo trên row template
```vue
<!-- Chỉ re-render row khi chính row đó thay đổi -->
<template #body="{ data }" v-memo="[data.id, data.status]">
  ...
</template>
```

### Rule 6: Debounce filter input
```typescript
const filterValue = ref('')
const debouncedFilter = useDebounceFn(() => {
  applyFilter(filterValue.value)
}, 300)
```

---

## 4. "Select all" pattern cho 10k rows

**Vấn đề**: Nếu check "select all" và store 10,000 IDs trong một mảng → UI có thể freeze.

**Giải pháp**: Track bằng "select mode" thay vì array of IDs:

```typescript
type SelectionMode = 'none' | 'all' | 'some'

const selectionMode = ref<SelectionMode>('none')
const excludedIds = ref<Set<string>>(new Set())  // khi mode='all', track deselected
const includedIds = ref<Set<string>>(new Set())  // khi mode='some', track selected

// "Đã chọn row X không?"
function isSelected(id: string): boolean {
  if (selectionMode.value === 'all') return !excludedIds.value.has(id)
  if (selectionMode.value === 'some') return includedIds.value.has(id)
  return false
}

// "Đã chọn bao nhiêu?"
const selectedCount = computed(() => {
  if (selectionMode.value === 'all') return totalRecords.value - excludedIds.value.size
  return includedIds.value.size
})
```

---

## 5. Quyết định thiết kế cho AppDataTable

### Chosen Strategy: **Chế độ C (Paginator + Lazy) làm default, hỗ trợ Chế độ A (VirtualScroller all-at-once)**

**Lý do**:
- Chế độ C ổn định nhất, không bug scroll position
- Paginator UX phù hợp với management tool
- Frozen columns hoạt động tốt với Chế độ C
- Chế độ B (virtualScroller + lazy) quá nhiều bug production

### AppDataTable sẽ hỗ trợ 2 mode:

```typescript
type DataTableMode =
  | 'client'    // Tất cả data load 1 lần, VirtualScroller render DOM
  | 'server'    // Paginator + lazy, server-side sort/filter/page
```

### Props cho `AppDataTable`:

```typescript
interface AppDataTableProps<T> {
  columns: AppTableColumn[]
  data: T[]
  loading?: boolean

  // Mode
  mode?: 'client' | 'server'   // default: 'client'

  // CLIENT mode (VirtualScroller)
  rowHeight?: number            // default: 48 — PHẢI khớp CSS
  scrollHeight?: string         // default: '600px' — KHÔNG 'flex'
  bufferCount?: number          // default: 10 (numToleratedItems)

  // SERVER mode (Paginator + lazy)
  totalRecords?: number
  pageSize?: number             // default: 50
  pageSizeOptions?: number[]    // default: [25, 50, 100]

  // Shared
  selectable?: boolean
  selectedRows?: T[]
  rowKey?: string               // default: 'id'
  emptyMessage?: string
}

// Emits
interface AppDataTableEmits<T> {
  'update:selectedRows': [rows: T[]]
  'lazy-load': [event: LazyLoadEvent]   // server mode
  'row-click': [row: T]
  'sort': [field: string, order: 1 | -1]
}

// LazyLoadEvent (unified type)
interface LazyLoadEvent {
  first: number
  rows: number
  sortField?: string
  sortOrder?: 1 | -1 | 0
  filters?: Record<string, string[]>
}
```

### Scrollbar height khi mode='client':
```typescript
// KHÔNG dùng 'flex' với virtualScroller
// Dùng CSS calc dựa trên layout tokens
const scrollHeight = computed(() =>
  props.scrollHeight ?? `calc(100vh - var(--topbar-height) - var(--page-header-height) - var(--space-8))`
)
```

---

## 6. Lazy Load trong MCO: use case cụ thể

### useContainers composable với server mode:

```typescript
export function useContainers() {
  const store = useContainersStore()

  const lazyState = ref<LazyLoadEvent>({
    first: 0,
    rows: 50,
    sortField: undefined,
    sortOrder: undefined,
    filters: {}
  })

  async function onLazyLoad(event: LazyLoadEvent) {
    lazyState.value = event
    store.setLoading(true)
    try {
      const result = await containerService.getPage({
        page: event.first / event.rows,
        size: event.rows,
        sortField: event.sortField,
        sortOrder: event.sortOrder,
        filters: event.filters,
      })
      store.setContainers(result.items)
      store.setTotal(result.total)
    } finally {
      store.setLoading(false)
    }
  }

  return {
    containers: computed(() => store.items),
    totalRecords: computed(() => store.total),
    isLoading: computed(() => store.isLoading),
    onLazyLoad,
  }
}
```

---

## 7. Column filter với server-side

PrimeVue DataTable filter modes khi `lazy=true`:
- Filter event đi vào `@filter` (hoặc trong `@lazyLoad` payload `filters`)
- `filters` là `Record<string, DataTableFilterMeta>`

```typescript
// DataTableFilterMeta structure
{
  contract: {
    value: 'CTR-2026',
    matchMode: FilterMatchMode.CONTAINS
  },
  status: {
    value: ['Active', 'Expired'],
    matchMode: FilterMatchMode.IN
  }
}
```

AppDataTable cần normalize filters → `Record<string, string[]>` trước khi emit ra ngoài.
Feature layer không cần biết về PrimeVue FilterMatchMode internals.

---

## 8. Summary: AppDataTable implementation checklist

```
[ ] mode='client': dùng virtualScrollerOptions + shallowRef data + Object.freeze
[ ] mode='server': dùng lazy=true + paginator + @lazyLoad event
[ ] itemSize = 48 (match --table-row-height token)
[ ] scrollHeight = pixel value (KHÔNG 'flex' khi có virtualScroller)
[ ] Frozen columns: tối đa 2 (checkbox + 1 data column)
[ ] Filter normalize: PrimeVue FilterMeta → string[] trước khi emit
[ ] Select all: dùng SelectionMode pattern, không store 10k IDs
[ ] numToleratedItems: 10 (buffer ngoài viewport)
[ ] delay: 200ms (debounce lazy load trigger)
[ ] Cell template: tránh expensive computed, pre-process data trước
[ ] v-memo trên row nếu cần micro-optimize
```
