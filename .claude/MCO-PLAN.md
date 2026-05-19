# MCO Management Tool — Implementation Plan (v2)

## Design Analysis (from screenshot)

```
┌──────────────────────────────────────────────────────────────────────┐
│ [logo] Management Tool   [MCO▼]                    User name  [TP]  │  TopBar
├──────┬───────────────────────────────────────────────────────────────┤
│  🗂  │  Dashboard                                                    │
│  🔍  │  Dashboard module scaffold is ready for implementation.       │
│  📊  │                                                               │
│  📈  │  ┌─────────────────────────────────────────────────────────┐  │
│  🌐  │  │☐│Location │Type  │Cap. │LastInsp│Notes│...│▼Contract│▼Status│
│  👥  │  │─┼─────────┼──────┼─────┼────────┼─────┼───┼─────────┼──────│
│      │  │☐│Loc 251  │Tank  │1100 │2026-12 │...  │...│CTR-251  │Expird│
│ logo │  └─────────────────────────────────────────────────────────┘  │
└──────┴───────────────────────────────────────────────────────────────┘
 Sidebar (56px)      Main content
```

---

## PART 1 — Design Token System

### Philosophy: 3-tier token hierarchy

```
Tier 1 (Primitive)   →   Tier 2 (Semantic)    →   Tier 3 (Component)
--color-navy-900         --color-sidebar-bg        --sidebar-bg
--color-amber-500        --color-tab-active         --topbar-tab-active-bg
--font-size-sm           --font-size-body           --table-cell-font-size
```

**Single source of truth**: change one primitive → all semantic + component tokens update.
This is the same pattern used by IBM Carbon, Atlassian, Adobe Spectrum.

### Token Files Structure

```
src/assets/
  tokens/
    _primitives.css    ← Raw values (never use directly in components)
    _semantic.css      ← Contextual aliases (use in components)
    _components.css    ← Per-component overrides
  tokens.css           ← @import all token files
  main.css             ← @import tokens.css + tailwind + global reset
  tailwind.css         ← tailwind + tailwindcss-primeui
```

### `_primitives.css` content plan
```css
:root {
  /* ── Color Palette ── */
  --color-navy-950: #0a1628;
  --color-navy-900: #112240;   /* sidebar / header bg */
  --color-navy-800: #1a3055;
  --color-navy-700: #243d6b;

  --color-amber-600: #c9933a;  /* active tab */
  --color-amber-500: #d4a44e;

  --color-blue-50:  #f0f5fb;
  --color-blue-100: #dce8f5;   /* table header bg */
  --color-blue-200: #b8d1eb;
  --color-blue-600: #2563eb;
  --color-blue-700: #1d4ed8;

  --color-green-600: #16a34a;
  --color-red-600:   #dc2626;
  --color-amber-700: #b45309;

  --color-gray-50:  #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-400: #9ca3af;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
  --color-white:    #ffffff;

  /* ── Typography ── */
  --font-family-base: 'Open Sans', system-ui, sans-serif;
  --font-size-xs:   11px;
  --font-size-sm:   12px;
  --font-size-base: 14px;   /* global base */
  --font-size-md:   16px;
  --font-size-lg:   18px;
  --font-size-xl:   20px;
  --font-size-2xl:  24px;

  --font-weight-regular:   400;
  --font-weight-semibold:  600;   /* global default weight */
  --font-weight-bold:      700;

  --line-height-tight:  1.25;
  --line-height-normal: 1.5;
  --line-height-loose:  1.75;

  /* ── Spacing (4px grid) ── */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;

  /* ── Border Radius ── */
  --radius-sm:   4px;
  --radius-md:   6px;
  --radius-lg:   8px;
  --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* ── Transitions ── */
  --duration-fast:   100ms;
  --duration-normal: 200ms;
  --duration-slow:   300ms;
  --easing-default:  ease-in-out;

  /* ── Z-index ── */
  --z-dropdown:  100;
  --z-modal:     200;
  --z-toast:     300;
  --z-tooltip:   400;
}
```

### `_semantic.css` content plan
```css
:root {
  /* ── Brand ── */
  --color-primary:       var(--color-blue-600);
  --color-primary-hover: var(--color-blue-700);
  --color-accent:        var(--color-amber-600);

  /* ── Layout ── */
  --color-sidebar-bg:    var(--color-navy-900);
  --color-header-bg:     var(--color-navy-900);
  --color-page-bg:       var(--color-white);
  --color-surface:       var(--color-white);
  --color-surface-alt:   var(--color-blue-50);

  /* ── Text ── */
  --color-text-primary:   var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-text-inverse:   var(--color-white);
  --color-text-disabled:  var(--color-gray-400);

  /* ── Border ── */
  --color-border:         var(--color-gray-200);
  --color-border-strong:  var(--color-gray-400);

  /* ── Status ── */
  --color-status-active:  var(--color-green-600);
  --color-status-expired: var(--color-red-600);
  --color-status-pending: var(--color-amber-700);

  /* ── Header / TopBar ── */
  --color-tab-active-bg:   var(--color-accent);
  --color-tab-active-text: var(--color-white);
  --color-tab-text:        var(--color-white);

  /* ── Table ── */
  --color-table-header-bg:   var(--color-blue-100);
  --color-table-row-default: var(--color-white);
  --color-table-row-alt:     var(--color-blue-50);
  --color-table-row-hover:   var(--color-blue-100);
  --color-table-border:      var(--color-border);
}
```

### `_components.css` content plan
```css
:root {
  /* ── AppButton ── */
  --btn-font-size:      var(--font-size-base);
  --btn-font-weight:    var(--font-weight-semibold);
  --btn-radius:         var(--radius-md);
  --btn-height-sm:      28px;
  --btn-height-md:      36px;
  --btn-height-lg:      44px;
  --btn-px-sm:          var(--space-3);
  --btn-px-md:          var(--space-4);

  /* ── AppDataTable ── */
  --table-header-height:    40px;
  --table-row-height:       48px;
  --table-cell-font-size:   var(--font-size-base);
  --table-cell-font-weight: var(--font-weight-semibold);
  --table-cell-px:          var(--space-4);
  --table-header-font-weight: var(--font-weight-semibold);

  /* ── AppSidebar ── */
  --sidebar-width:           56px;
  --sidebar-icon-size:       20px;
  --sidebar-item-height:     48px;

  /* ── AppTopBar ── */
  --topbar-height:           48px;
  --topbar-logo-gap:         var(--space-3);
  --topbar-tab-px:           var(--space-4);
  --topbar-tab-height:       100%;

  /* ── AppBadge (status) ── */
  --badge-font-size:         var(--font-size-sm);
  --badge-font-weight:       var(--font-weight-semibold);

  /* ── AppTextInput ── */
  --input-height:            36px;
  --input-font-size:         var(--font-size-base);
  --input-border-radius:     var(--radius-md);

  /* ── AppSelect ── */
  --select-height:           36px;
}
```

---

## PART 2 — Shared Component Library

### Naming convention: `App` prefix for all shared UI components
Reason: avoids collision with PrimeVue components, immediately signals "our design system".

### Atomic Design Hierarchy

```
Atoms            Molecules              Organisms/Layout
──────────────   ────────────────────   ──────────────────────
AppButton        AppDataTable           AppSidebar
AppBadge         AppTextInput           AppTopBar
AppIcon          AppSelect              AppLayout
AppAvatar        AppSearchInput         AppPageHeader
AppTag           AppFilterBadge
AppSkeleton      AppEmptyState
AppDivider
```

### Component Catalog

#### Atom: `AppButton`
Wraps PrimeVue Button. Extends with our design tokens and typed variants.
```typescript
Props:
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'  // default: 'primary'
  size:    'sm' | 'md' | 'lg'                             // default: 'md'
  loading: boolean
  disabled: boolean
  iconLeft?: string   // iconify icon name
  iconRight?: string
Slots: default (label text)
Emits: click
```

#### Atom: `AppBadge`
Status/tag indicator. Used in table Status column and elsewhere.
```typescript
Props:
  label: string
  variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral'
  dot?: boolean   // show colored dot instead of background
Emits: —
```
Maps ContainerStatus → variant in the feature layer (not in AppBadge itself).
`AppBadge` is generic. `ContainerStatusBadge` molecule maps domain → AppBadge.

#### Atom: `AppIcon`
Thin wrapper around `@iconify/vue`.
```typescript
Props:
  name: string    // iconify: 'mdi:home', 'lucide:search', etc.
  size?: number   // default: 16
  color?: string  // default: 'currentColor'
  ariaLabel?: string
```

#### Atom: `AppAvatar`
User avatar circle with initials fallback.
```typescript
Props:
  src?: string       // image URL, optional
  initials: string   // shown when no src, or on image error
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
```

#### Atom: `AppSkeleton`
Loading placeholder. Wraps PrimeVue Skeleton with consistent sizing.
```typescript
Props:
  variant: 'text' | 'rect' | 'circle'
  width?: string    // CSS value, e.g. '100%', '80px'
  height?: string
  rows?: number     // for variant='text': render N skeleton lines
```

#### Atom: `AppEmptyState`
Zero-data state illustration + message.
```typescript
Props:
  icon?: string       // iconify icon
  title: string
  description?: string
Slots: actions (for CTA buttons)
```

#### Molecule: `AppDataTable`
Wraps PrimeVue DataTable. Supports 10,000+ rows. See [DATATABLE-RESEARCH.md](DATATABLE-RESEARCH.md) for full analysis.

##### Two loading modes

**`mode='client'`** — Load all data once, VirtualScroller handles DOM (≤10k rows, no server pagination needed)
```
Server → all rows → shallowRef(Object.freeze(data)) → VirtualScroller renders ~30 DOM nodes
```

**`mode='server'`** — Paginator + lazy, server-side sort/filter/page (any size, most stable)
```
User action → @lazyLoad({ first, rows, sortField, filters }) → fetch page → replace value
```

> **Why not VirtualScroller + lazy?**
> PrimeVue bug: `event.first` returns 0 on scroll, scroll position resets after load.
> Paginator + lazy is stable, works with frozen columns, and suits management tool UX.

##### Props
```typescript
interface AppDataTableProps<T = Record<string, unknown>> {
  columns: AppTableColumn[]
  data: T[]
  loading?: boolean

  // ── Loading mode ──────────────────────────────────────
  mode?: 'client' | 'server'   // default: 'client'

  // ── client mode: VirtualScroller ──────────────────────
  rowHeight?: number            // default: 48 — MUST match --table-row-height CSS token
  scrollHeight?: string         // default: computed from layout tokens. NEVER 'flex'
  bufferCount?: number          // default: 10 (numToleratedItems outside viewport)

  // ── server mode: Paginator + lazy ─────────────────────
  totalRecords?: number         // required for server mode
  pageSize?: number             // default: 50
  pageSizeOptions?: number[]    // default: [25, 50, 100]

  // ── Shared ─────────────────────────────────────────────
  selectable?: boolean          // show checkbox column
  selectedRows?: T[]
  rowKey?: string               // default: 'id'
  emptyMessage?: string
}
```

##### Emits
```typescript
'update:selectedRows': [rows: T[]]
'lazy-load': [event: AppLazyLoadEvent]   // server mode only
'row-click': [row: T]
'sort': [field: string, order: 1 | -1]
'filter': [filters: Record<string, string[]>]  // normalized, no PrimeVue internals
```

##### LazyLoadEvent (normalized — không expose PrimeVue internals ra feature layer)
```typescript
export interface AppLazyLoadEvent {
  first: number             // row offset (first = page * rows)
  rows: number              // page size
  page: number              // 0-indexed page number
  sortField?: string
  sortOrder?: 1 | -1 | 0
  filters: Record<string, string[]>   // { status: ['Active'], contract: ['CTR-2026'] }
}
```

##### Slots
```
#[field]-body="{ data, index }"  → custom cell per column field
#empty                           → override empty state
#header-right                    → buttons above table (export, column picker)
#loading-row                     → custom skeleton row (optional)
```

##### Column definition type
```typescript
export interface AppTableColumn {
  field: string
  header: string
  width?: string           // '120px', 'auto'
  minWidth?: string
  sortable?: boolean
  filterable?: boolean     // show filter icon → popover with filter options
  filterOptions?: { label: string; value: string }[]  // static options for filter dropdown
  frozen?: boolean         // sticky left — MAXIMUM 2 frozen columns with virtualScroller
  truncate?: boolean       // text-overflow + :title tooltip
  align?: 'left' | 'center' | 'right'
  unit?: string            // appended to value: '°C', '%', 'hPa'
}
```

##### Critical implementation rules (from research)
```
1. NEVER scrollHeight="flex" when virtualScrollerOptions present → table disappears
2. itemSize MUST equal exact CSS row height (--table-row-height: 48px → itemSize: 48)
3. MAX 2 frozen columns with virtualScroller (PrimeVue bug with 3+)
4. Use shallowRef + Object.freeze() for data array in client mode
5. Pre-process display data BEFORE passing to DataTable (avoid computed in cell templates)
6. Select all: use SelectionMode pattern, NOT array of 10k IDs
7. Filter events: normalize PrimeVue FilterMeta → string[] inside component, emit clean type
8. numToleratedItems: 10 + delay: 200 for smooth virtual scroll
```

##### Select-all pattern for large datasets
```typescript
// Inside AppDataTable — track by mode, not by storing 10k IDs
type SelectionMode = 'none' | 'all' | 'some'
// mode='all': track excluded IDs (typically small set)
// mode='some': track included IDs
// → selectedCount works without iterating 10k items
```

#### Molecule: `AppTextInput`
Labeled input with error state.
```typescript
Props:
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  iconLeft?: string
Emits: update:modelValue, blur, focus
```

#### Molecule: `AppSelect`
Labeled dropdown (wraps PrimeVue Select).
```typescript
Props:
  modelValue: unknown
  options: SelectableItem[]
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  loading?: boolean
Emits: update:modelValue, change
```

#### Molecule: `AppSearchInput`
Search bar with debounce built-in.
```typescript
Props:
  modelValue: string
  placeholder?: string
  debounce?: number   // ms, default 300
  loading?: boolean
Emits: update:modelValue, search(value)
```

#### Molecule: `AppPageHeader`
Consistent page title area.
```typescript
Props:
  title: string
  description?: string
Slots: actions (right-side buttons)
```

#### Organism: `AppSidebar`
```typescript
Props:
  items: SidebarItem[]
  logoSrc: string
  bottomLogoSrc?: string

interface SidebarItem {
  icon: string          // iconify name
  label: string         // shown as tooltip
  routeName: string
  active?: boolean
}
Emits: navigate(routeName)
```

#### Organism: `AppTopBar`
```typescript
Props:
  appTitle: string
  tabs: TopBarTab[]
  user: { name: string; initials: string; avatarSrc?: string }

interface TopBarTab {
  label: string
  key: string
  active?: boolean
}
Emits: tab-change(key)
```

#### Template: `AppLayout`
Full app shell. Composes Sidebar + TopBar + router-view slot.
```typescript
Props:
  sidebarItems: SidebarItem[]
  topBarTabs: TopBarTab[]
  appTitle: string
  user: UserInfo
  logoSrc: string
Slots: default (page content)
```

### Index exports — `src/modules/shared/components/index.ts`
```typescript
export { default as AppButton }      from './app-button'
export { default as AppBadge }       from './app-badge'
export { default as AppIcon }        from './app-icon'
export { default as AppAvatar }      from './app-avatar'
export { default as AppSkeleton }    from './app-skeleton'
export { default as AppEmptyState }  from './app-empty-state'
export { default as AppDataTable }   from './app-data-table'
export { default as AppTextInput }   from './app-text-input'
export { default as AppSelect }      from './app-select'
export { default as AppSearchInput } from './app-search-input'
export { default as AppPageHeader }  from './app-page-header'
export { default as AppSidebar }     from './app-sidebar'
export { default as AppTopBar }      from './app-top-bar'
export { default as AppLayout }      from './app-layout'
```

---

## PART 3 — Feature: MCO Module

### Domain → Shared mapping
`ContainerStatus` ('Active' | 'Expired' | 'PendingReview') is domain knowledge.
The mapping to `AppBadge` variant lives in the MCO module, not in shared:
```typescript
// src/modules/mco/utils/statusMapper.ts
export const STATUS_BADGE_VARIANT: Record<ContainerStatus, AppBadgeVariant> = {
  Active:        'success',
  Expired:       'danger',
  PendingReview: 'warning',
}
export const STATUS_LABEL: Record<ContainerStatus, string> = {
  Active:        'Active',
  Expired:       'Expired',
  PendingReview: 'Pending Review',
}
```

### Full MCO file tree
```
src/modules/mco/
  components/
    container-table/
      ContainerTable.vue        ← uses AppDataTable, AppBadge
      ContainerTable.type.ts    ← TABLE_COLUMNS: AppTableColumn[]
      ContainerTable.spec.ts
      index.ts
  composables/
    use-containers/
      useContainers.ts
      useContainers.spec.ts
      index.ts
  constants/
    index.ts                    ← route names, storage keys
  mocks/
    containers.mock.ts          ← 20+ Container records
  router/
    index.ts
  stores/
    containers/
      containers.ts             ← Pinia store
      containers.spec.ts
  types/
    index.ts                    ← Container, ContainerStatus, ContainerFilter
  utils/
    statusMapper.ts             ← domain → badge mapping
  views/
    Dashboard.vue               ← uses AppLayout, AppPageHeader, ContainerTable
```

---

## PART 4 — Implementation Steps

### STEP 1 — Token System Foundation
**Files**:
- `src/assets/tokens/_primitives.css`
- `src/assets/tokens/_semantic.css`
- `src/assets/tokens/_components.css`
- `src/assets/tokens.css`
- `src/assets/main.css` (update: import tokens + Google Fonts Open Sans)
- `src/assets/tailwind.css` (update: add `@theme` Tailwind 4 CSS vars)
- `src/plugins/ui/primevue.ts` (update: theme preset with navy/amber palette)

**Definition of Done**:
- `--color-sidebar-bg`, `--font-family-base`, `--table-row-height` visible in DevTools
- Body renders in Open Sans 14px weight 600
- PrimeVue components pick up custom colors

---

### STEP 2 — Domain Layer
**Files**:
- `src/domain/entities/container.ts`
- `src/domain/interfaces/iContainerRepository.ts`
- `src/domain/services/container/containerService.ts`

**Definition of Done**: `tsc --noEmit` passes, entity and service fully typed.

---

### STEP 3 — Infrastructure + Mock Data
**Files**:
- `src/infrastructure/repositories/container/containerRepository.ts`
- `src/modules/mco/mocks/containers.mock.ts` (20 records, varied statuses)
- `src/plugins/services/services.ts` (add containerService)
- `src/infrastructure/repositories/repositoryFactory.ts` (add ContainerRepository)

**Definition of Done**: `containerService.getAll()` resolves with 20 typed records.

---

### STEP 4 — Atom Components
**Files** (one folder each, pattern: `.vue` + `.type.ts` + `.spec.ts` + `index.ts`):
- `src/modules/shared/components/app-button/`
- `src/modules/shared/components/app-badge/`
- `src/modules/shared/components/app-icon/`
- `src/modules/shared/components/app-avatar/`
- `src/modules/shared/components/app-skeleton/`
- `src/modules/shared/components/app-empty-state/`
- `src/modules/shared/components/index.ts` (barrel export)

**Definition of Done**:
- All atoms import correctly from `@/modules/shared/components`
- Each has at least 3 passing test cases
- Visual: correct tokens applied (no hardcoded colors)

---

### STEP 5 — Molecule Components
**Files**:
- `src/modules/shared/components/app-data-table/`
  - `AppDataTable.vue` — PrimeVue DataTable wrapper
  - `AppDataTable.type.ts` — `AppTableColumn`, `SortEvent`, `FilterEvent`
  - `AppDataTable.spec.ts`
  - `index.ts`
- `src/modules/shared/components/app-text-input/`
- `src/modules/shared/components/app-select/`
- `src/modules/shared/components/app-search-input/`
- `src/modules/shared/components/app-page-header/`
- Update `src/modules/shared/components/index.ts`

**AppDataTable implementation notes** (see DATATABLE-RESEARCH.md for full analysis):

**Mode='client' (VirtualScroller)**:
- `shallowRef(Object.freeze(data))` — tránh Vue tạo reactive proxy cho 10k objects
- `scrollHeight` = computed pixel height từ layout tokens, KHÔNG dùng `"flex"`
- `itemSize: 48` — phải bằng `--table-row-height` CSS token chính xác
- `numToleratedItems: 10`, `delay: 200` — buffer + debounce scroll
- Max 2 frozen columns (PrimeVue bug với 3+)

**Mode='server' (Paginator + lazy)**:
- `lazy=true` + `paginator` + `:totalRecords`
- Listen `@lazyLoad` → normalize event → emit `lazy-load` với `AppLazyLoadEvent`
- Filter: normalize `DataTableFilterMeta` → `Record<string, string[]>` bên trong component
- Không để PrimeVue internals leak ra feature layer

**Shared rules**:
- `:rowClass` → alternating rows dùng `--color-table-row-alt`
- `frozen: true` trên column → PrimeVue Column `:frozen="true" alignFrozen="left"`
- `truncate: true` → `<span class="truncate" :title="value">` trong cell
- Filter icon header → PrimeVue Popover với `filterOptions` dropdown
- Loading: `<AppSkeleton>` rows thay thế data rows
- Empty: `<AppEmptyState>` trong PrimeVue `#empty` slot
- Select all: `SelectionMode` pattern (none/all/some) — không store 10k IDs

**Pre-process data trước khi pass vào DataTable** (tránh computed trong cell):
```typescript
const displayRows = computed(() =>
  props.data.map(row => ({
    ...row,
    _temperature: row.temperature != null ? `${row.temperature}°C` : '—',
    _humidity:    row.humidity != null    ? `${row.humidity}%`      : '—',
  }))
)
```

**Definition of Done**:
- `AppDataTable` renders with arbitrary column defs + data
- Sorting, frozen columns, truncation, loading, empty state all work
- `npm test` passes for molecule specs

---

### STEP 6 — Layout/Organism Components
**Files**:
- `src/modules/shared/components/app-sidebar/`
- `src/modules/shared/components/app-top-bar/`
- `src/modules/shared/components/app-layout/`
- `src/modules/shared/layouts/AppLayout.vue` (alias or the same)
- Update `src/modules/shared/components/index.ts`

**AppSidebar implementation notes**:
- `position: fixed; left: 0; top: 0; height: 100vh; width: var(--sidebar-width)`
- Iconify icons for nav items, `v-tooltip` on each with the label
- Active item: lighter bg or accent left-border indicator
- Bottom logo: `position: absolute; bottom: var(--space-4)`

**AppTopBar implementation notes**:
- `position: fixed; top: 0; left: var(--sidebar-width); right: 0; height: var(--topbar-height)`
- Logo (svg) + title + tabs (flex row) + avatar (flex: auto → right-align)
- Tab active: `background: var(--color-tab-active-bg); color: var(--color-tab-active-text)`
- Avatar: `background: var(--color-navy-700); color: var(--color-white); border-radius: var(--radius-full)`

**AppLayout content-area offset**:
```css
.app-layout__content {
  margin-left: var(--sidebar-width);
  margin-top:  var(--topbar-height);
  height: calc(100vh - var(--topbar-height));
  overflow: auto;
}
```
This offset uses tokens → change sidebar width in one place, layout adapts.

**Definition of Done**: Full layout renders correctly, content area fills remaining space.

---

### STEP 7 — MCO Module Wiring
**Files**:
- `src/modules/mco/types/index.ts`
- `src/modules/mco/utils/statusMapper.ts`
- `src/modules/mco/stores/containers/containers.ts`
- `src/modules/mco/composables/use-containers/useContainers.ts`
- `src/modules/mco/components/container-table/ContainerTable.vue`
  - Uses `AppDataTable` with MCO-specific column defs
  - Uses scoped slot `#status-body` to render `AppBadge` with mapped variant
- `src/modules/mco/views/Dashboard.vue`
- `src/modules/mco/router/index.ts`
- `src/router/index.ts` (register MCO routes)

**ContainerTable column defs**:
```typescript
export const CONTAINER_COLUMNS: AppTableColumn[] = [
  { field: 'location',       header: 'Location',       width: '130px', frozen: true, sortable: true },
  { field: 'type',           header: 'Type',           width: '80px',  sortable: true },
  { field: 'capacity',       header: 'Capacity',       width: '90px',  sortable: true, align: 'right' },
  { field: 'lastInspection', header: 'Last Inspection',width: '130px', sortable: true },
  { field: 'notes',          header: 'Notes',          minWidth: '200px', truncate: true },
  { field: 'assignedTeam',   header: 'Assigned Team',  width: '110px' },
  { field: 'temperature',    header: 'Temperature',    width: '110px', align: 'right' },
  { field: 'humidity',       header: 'Humidity',       width: '90px',  align: 'right' },
  { field: 'pressure',       header: 'Pressure',       width: '100px', align: 'right' },
  { field: 'contract',       header: 'Contract',       width: '130px', filterable: true },
  { field: 'owner',          header: 'Owner',          width: '100px', filterable: true },
  { field: 'status',         header: 'Status',         width: '130px', filterable: true },
]
```

**Definition of Done**: `/mco/dashboard` renders full table with 20 mock rows, correct styling, working filters and multi-select.

---

### STEP 8 — Polish & Accessibility
1. `aria-label` on every icon-only sidebar button
2. `role="status"` on AppBadge
3. `aria-sort` wired to PrimeVue DataTable sort state
4. Focus ring visible on all interactive elements (Tailwind `focus-visible:ring-2`)
5. Notes tooltip on truncated text
6. PrimeVue `virtualScrollerOptions` enabled (itemSize = `--table-row-height` → 48)
7. Responsive: table wraps in horizontal-scroll container on narrow viewports
8. Skeleton rows during isLoading (same number as last data length or 10 default)

---

## PART 5 — Test Plan

### Test Tools
- **Vitest** — test runner
- **@vue/test-utils** — `mount()` / `shallowMount()`
- **jsdom** — DOM environment
- **Pattern**: each component folder has `.spec.ts` alongside `.vue`

---

### Token System Tests
No unit tests. Manual verification via DevTools.
**Checklist**:
```
[ ] CSS variables visible in :root in DevTools
[ ] Body font: Open Sans, 14px, weight 600
[ ] Sidebar bg: #112240
[ ] Active tab bg: #c9933a
[ ] Table header bg: #dce8f5
```

---

### Shared Component Tests

#### AppButton (`app-button/AppButton.spec.ts`)
```
✓ renders slot content as button label
✓ variant='primary' applies primary CSS class
✓ variant='danger' applies danger CSS class
✓ size='sm' / 'md' / 'lg' applies correct height token class
✓ loading=true shows spinner, disables click
✓ disabled=true applies disabled attribute
✓ emits 'click' when clicked
✓ does NOT emit 'click' when disabled
✓ iconLeft renders AppIcon before label
✓ passes through unknown attrs (data-testid etc.)
```

#### AppBadge (`app-badge/AppBadge.spec.ts`)
```
✓ renders label text
✓ variant='success' → applies success color CSS class
✓ variant='danger'  → applies danger color CSS class
✓ variant='warning' → applies warning color CSS class
✓ variant='neutral' → applies neutral color CSS class
✓ has role="status" aria attribute
✓ dot=true renders dot indicator
```

#### AppIcon (`app-icon/AppIcon.spec.ts`)
```
✓ renders Icon from iconify
✓ passes name prop to Icon
✓ applies size prop
✓ applies ariaLabel as aria-label attribute
✓ uses aria-hidden when no ariaLabel provided
```

#### AppAvatar (`app-avatar/AppAvatar.spec.ts`)
```
✓ renders initials text when no src
✓ renders img element when src provided
✓ on img error → falls back to initials
✓ size='sm' / 'md' / 'lg' applies size classes
✓ applies ariaLabel attribute
```

#### AppSkeleton (`app-skeleton/AppSkeleton.spec.ts`)
```
✓ variant='text' renders text skeleton lines
✓ rows=3 renders 3 skeleton lines
✓ variant='rect' renders block skeleton
✓ variant='circle' renders circular skeleton
✓ applies width/height style props
✓ has aria-hidden="true" (decorative)
```

#### AppEmptyState (`app-empty-state/AppEmptyState.spec.ts`)
```
✓ renders title prop
✓ renders description prop when provided
✓ renders icon when provided
✓ renders #actions slot content
✓ does not render description node when prop absent
```

#### AppDataTable (`app-data-table/AppDataTable.spec.ts`)

**Shared (both modes)**:
```
✓ renders correct number of column headers from columns prop
✓ shows AppSkeleton rows when loading=true (data rows hidden)
✓ shows AppEmptyState when data=[] and loading=false
✓ selectable=true renders checkbox column as first frozen column
✓ clicking row checkbox emits update:selectedRows with toggled row
✓ clicking header checkbox in mode='none' → selects all (mode='all')
✓ clicking header checkbox in mode='all' → deselects all (mode='none')
✓ sortable column header renders sort icon
✓ clicking sortable column emits sort(field, 1) → then sort(field, -1) on second click
✓ filterable column header renders filter icon button
✓ column with unit='°C' appends unit to cell value
✓ column with truncate=true renders cell with title attribute
✓ custom slot #status-body renders slot content instead of default text
✓ frozen column passes frozen=true + alignFrozen='left' to PrimeVue Column
✓ #header-right slot renders content above table
✓ #empty slot overrides AppEmptyState when provided
```

**mode='client' (VirtualScroller)**:
```
✓ renders with virtualScrollerOptions when mode='client'
✓ itemSize matches rowHeight prop (default 48)
✓ scrollHeight uses pixel value, NOT 'flex'
✓ numToleratedItems=10 and delay=200 set on virtualScrollerOptions
✓ data wrapped in shallowRef (not deep reactive)
✓ does NOT render paginator when mode='client'
```

**mode='server' (Paginator + lazy)**:
```
✓ renders PrimeVue paginator when mode='server'
✓ totalRecords prop sets paginator total
✓ pageSize prop sets rows per page (default 50)
✓ pageSizeOptions renders page size dropdown
✓ table fires @lazyLoad on mount (initial load)
✓ emits lazy-load event with normalized AppLazyLoadEvent shape
✓ lazy-load event.page = first / rows (correct page number)
✓ lazy-load filters are Record<string, string[]> (no PrimeVue FilterMeta)
✓ sorting triggers lazy-load with sortField and sortOrder
✓ filter input triggers lazy-load with updated filters
✓ does NOT use virtualScrollerOptions when mode='server'
```

**Performance / edge cases**:
```
✓ select-all with 10k rows does NOT iterate array (uses SelectionMode='all')
✓ selectedCount computed is correct for mode='all' with exclusions
✓ selectedCount computed is correct for mode='some' with inclusions
✓ deselecting one row from 'all' mode → mode='all', excludedIds=[thatId]
✓ filter emit normalizes FilterMeta.IN matchMode → string[]
✓ filter emit normalizes FilterMeta.CONTAINS matchMode → string[]
```

#### AppTextInput (`app-text-input/AppTextInput.spec.ts`)
```
✓ renders label text
✓ modelValue binds to input value
✓ emits update:modelValue on input
✓ error prop shows error message text
✓ error state applies error CSS class to input border
✓ disabled=true disables input
✓ required=true marks label with required indicator
✓ iconLeft renders icon inside input
```

#### AppSelect (`app-select/AppSelect.spec.ts`)
```
✓ renders label text
✓ renders PrimeVue Select with options prop
✓ emits update:modelValue on selection
✓ placeholder shown when no value
✓ disabled=true disables select
✓ loading=true shows loading indicator
```

#### AppSearchInput (`app-search-input/AppSearchInput.spec.ts`)
```
✓ renders search icon
✓ emits update:modelValue on input
✓ debounces search emit by debounce prop ms
✓ emits search event after debounce
✓ loading=true shows spinner
✓ placeholder prop applied
```

#### AppPageHeader (`app-page-header/AppPageHeader.spec.ts`)
```
✓ renders title prop as h1
✓ renders description prop as subtitle text
✓ renders #actions slot
✓ does not render description node when absent
```

#### AppSidebar (`app-sidebar/AppSidebar.spec.ts`)
```
✓ renders one button per item in items prop
✓ active item has active CSS class applied
✓ each button has aria-label matching item.label
✓ clicking nav item emits navigate(routeName)
✓ renders logoSrc in img element
✓ renders bottomLogoSrc in footer img
✓ tooltip visible on icon (v-tooltip directive present)
```

#### AppTopBar (`app-top-bar/AppTopBar.spec.ts`)
```
✓ renders appTitle text
✓ renders tab label for each tab in tabs prop
✓ active tab has active CSS class
✓ clicking tab emits tab-change(key)
✓ renders user.name text
✓ renders AppAvatar with user.initials
✓ tab with active=false does NOT have active class
```

#### AppLayout (`app-layout/AppLayout.spec.ts`)
```
✓ renders AppSidebar
✓ renders AppTopBar
✓ renders default slot in content area
✓ content area has correct margin-left (sidebar width)
✓ content area has correct margin-top (topbar height)
```

---

### Domain Layer Tests

#### ContainerService (`domain/services/container/containerService.spec.ts`)
```
✓ getAll() calls repository.get() with no args by default
✓ getAll(filter) passes filter to repository.get()
✓ getAll() returns Promise<Container[]>
✓ getAll(undefined, signal) passes AbortSignal
✓ ContainerStatus type includes 'Active', 'Expired', 'PendingReview'
```

---

### MCO Module Tests

#### Containers Store (`mco/stores/containers/containers.spec.ts`)
```
✓ initial state: items=[], selectedIds=[], isLoading=false, filters={}
✓ setContainers(items) updates state.items
✓ setLoading(true/false) toggles isLoading
✓ setSelected([id1, id2]) updates selectedIds
✓ clearSelected() resets selectedIds to []
✓ setFilter({ status: 'Active' }) merges into filters
✓ clearFilters() resets filters to {}
✓ computed: filteredItems returns only items matching active filters
✓ computed: filteredItems returns all items when filters={}
```

#### useContainers Composable (`mco/composables/use-containers/useContainers.spec.ts`)
```
✓ calls containerService.getAll() on mount (auto-execute)
✓ sets store.isLoading=true before fetch, false after
✓ calls store.setContainers() with fetched data
✓ containers ref returns store.filteredItems
✓ execute() re-fetches and updates store
✓ applyFilter(filter) calls store.setFilter()
✓ clearFilters() calls store.clearFilters()
✓ toggleSelect(id) calls store.setSelected() toggling that id
✓ selectAll() calls store.setSelected(allIds)
✓ clearSelection() calls store.clearSelected()
✓ isLoading matches store.isLoading
```

#### ContainerTable (`mco/components/container-table/ContainerTable.spec.ts`)
```
✓ renders AppDataTable with CONTAINER_COLUMNS as columns prop
✓ passes containers prop to AppDataTable data prop
✓ passes isLoading to AppDataTable
✓ status column slot renders AppBadge with correct variant for 'Active'
✓ status column slot renders AppBadge with correct variant for 'Expired'
✓ status column slot renders AppBadge with correct variant for 'PendingReview'
✓ status badge label matches STATUS_LABEL mapping
✓ temperature cell renders value with '°C' suffix
✓ humidity cell renders value with '%' suffix
✓ pressure cell renders value with 'hPa' suffix
✓ emits update:selectedRows when AppDataTable selection changes
✓ emits filter-change when AppDataTable filter emitted
```

#### Dashboard View (`mco/views/Dashboard.spec.ts`)
```
✓ renders AppLayout
✓ renders AppPageHeader with title='Dashboard'
✓ renders ContainerTable
✓ ContainerTable receives containers from useContainers composable
✓ applies filter → ContainerTable receives filtered data
✓ selecting rows → store selectedIds updates
```

---

### E2E Manual Checklist
```
[ ] Navigate to /mco/dashboard — page loads without console errors
[ ] Table renders 20 mock rows
[ ] Horizontal scroll shows all columns
[ ] Frozen Location column stays visible while scrolling right
[ ] Checkbox click selects row (visual highlight)
[ ] Header checkbox selects / deselects all rows
[ ] Filter icon on Status column → filter popover opens
[ ] Select 'Active' in Status filter → only Active rows shown
[ ] Badge colors: Active=green, Expired=red, Pending Review=amber
[ ] Clear filter → all rows return
[ ] Notes column truncated with ellipsis
[ ] Hover truncated Notes → full text shown in tooltip
[ ] Sidebar icons have tooltips on hover
[ ] MCO tab in TopBar has gold background
[ ] Font is Open Sans 14px weight 600 (verify in DevTools)
[ ] Resize to 1024px width — horizontal scroll appears
[ ] No layout shift during initial load (skeleton shows)
[ ] Page accessible: Tab key navigates table + sidebar
```

---

## PART 6 — File Creation Order (dependency-safe)

```
Phase A — Foundation (no Vue dependencies)
  1.  src/assets/tokens/_primitives.css
  2.  src/assets/tokens/_semantic.css
  3.  src/assets/tokens/_components.css
  4.  src/assets/tokens.css
  5.  src/assets/main.css                             (update)
  6.  src/assets/tailwind.css                         (update)
  7.  src/plugins/ui/primevue.ts                      (update theme)
  8.  src/domain/entities/container.ts
  9.  src/domain/interfaces/iContainerRepository.ts
  10. src/domain/services/container/containerService.ts

Phase B — Infrastructure
  11. src/infrastructure/repositories/container/containerRepository.ts
  12. src/modules/mco/mocks/containers.mock.ts
  13. src/plugins/services/services.ts                (update)
  14. src/infrastructure/repositories/repositoryFactory.ts (update)

Phase C — Atoms (no inter-component dependencies)
  15. src/modules/shared/components/app-icon/
  16. src/modules/shared/components/app-badge/
  17. src/modules/shared/components/app-avatar/
  18. src/modules/shared/components/app-skeleton/
  19. src/modules/shared/components/app-empty-state/
  20. src/modules/shared/components/app-button/

Phase D — Molecules (depend on atoms)
  21. src/modules/shared/components/app-data-table/
  22. src/modules/shared/components/app-text-input/
  23. src/modules/shared/components/app-select/
  24. src/modules/shared/components/app-search-input/
  25. src/modules/shared/components/app-page-header/
  26. src/modules/shared/components/index.ts           (barrel export)

Phase E — Organisms/Layout (depend on molecules+atoms)
  27. src/modules/shared/components/app-sidebar/
  28. src/modules/shared/components/app-top-bar/
  29. src/modules/shared/components/app-layout/
  30. src/modules/shared/components/index.ts           (update)

Phase F — MCO Feature
  31. src/modules/mco/types/index.ts
  32. src/modules/mco/utils/statusMapper.ts
  33. src/modules/mco/constants/index.ts
  34. src/modules/mco/stores/containers/containers.ts
  35. src/modules/mco/composables/use-containers/useContainers.ts
  36. src/modules/mco/components/container-table/ContainerTable.vue
  37. src/modules/mco/views/Dashboard.vue
  38. src/modules/mco/router/index.ts
  39. src/router/index.ts                              (register MCO)
```

---

## PART 7 — Professional Frontend Recommendations

### 1. Token-first development (already in plan)
Never hardcode a color, size, or font value in a component.
Always use a token. If no token exists → add it to `_semantic.css` or `_components.css`.

### 2. Component contract via types (`.type.ts`)
Every shared component has a `.type.ts` file exporting its props interface + all related types.
Feature code imports types from there, not from the component directly.

### 3. Prop drilling vs composable (rule of thumb)
- 1 level deep → props
- 2+ levels deep → composable or provide/inject
- Global app state → Pinia store

### 4. PrimeVue passthrough (PT) for deep styling
For complex PrimeVue components (DataTable, Select), use `pt` prop to apply tokens
to internal DOM nodes without overriding CSS specificity:
```vue
<DataTable :pt="{ header: { class: 'app-dt-header' }, row: { class: rowClass } }" />
```

### 5. AppDataTable → single wrapper for all tables
Every table in the app goes through `AppDataTable`.
Feature tables only configure columns + slots. Style lives once in AppDataTable.

### 6. Future: Column visibility + Export (already scaffolded)
AppDataTable has `#header-right` slot → drop in column picker + export button.
`xlsx` vendor already in project → just wire `useExport()` composable.

### 7. Future: Global filter bar
`AppSearchInput` + filter dropdowns composable can be added above `AppDataTable`
via `#header-right` slot without changing AppDataTable internals.

### 8. Storybook (optional, future)
When the component library grows, add Storybook.
Each `AppXxx` component maps directly to a Storybook story.
Until then, the spec files serve as living documentation.
