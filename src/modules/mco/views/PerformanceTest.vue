<template>
  <AppLayout
    :sidebar-items="SIDEBAR_ITEMS"
    :top-bar-tabs="TOP_BAR_TABS"
    app-title="Management Tool"
    :user="CURRENT_USER"
    logo-src="/src/assets/icons/logo.svg"
  >
    <AppPageHeader title="Performance Test — 10,000 rows">
      <template #actions>
        <div class="perf__controls">
          <AppSearchInput
            v-model="searchQuery"
            placeholder="Filter by location / type / notes..."
            :debounce="150"
            @search="onSearch"
          />
          <AppSelect
            v-model="statusFilter"
            :options="STATUS_OPTIONS"
            placeholder="All statuses"
            @change="onStatusFilter"
          />
          <AppButton variant="secondary" size="sm" @click="clearFilters">
            Clear filters
          </AppButton>
        </div>
      </template>
    </AppPageHeader>

    <div class="perf__body">
      <!-- Metrics bar -->
      <div class="perf__metrics">
        <div class="perf__metric">
          <span class="perf__metric-label">Total rows</span>
          <span class="perf__metric-value">{{ totalRows.toLocaleString() }}</span>
        </div>
        <div class="perf__metric">
          <span class="perf__metric-label">Visible after filter</span>
          <span class="perf__metric-value">{{ displayRows.length.toLocaleString() }}</span>
        </div>
        <div class="perf__metric">
          <span class="perf__metric-label">Selected</span>
          <span class="perf__metric-value">{{ selectedRows.length.toLocaleString() }}</span>
        </div>
        <div class="perf__metric">
          <span class="perf__metric-label">Load time</span>
          <span class="perf__metric-value" :class="loadTimeClass">{{ loadTimeMs }}ms</span>
        </div>
        <div class="perf__metric">
          <span class="perf__metric-label">Filter time</span>
          <span class="perf__metric-value">{{ filterTimeMs }}ms</span>
        </div>
        <div class="perf__metric">
          <span class="perf__metric-label">DOM nodes (approx.)</span>
          <span class="perf__metric-value perf__metric-value--highlight">~30 / {{ totalRows.toLocaleString() }}</span>
        </div>
      </div>

      <AppDataTable
        :columns="COLUMNS"
        :data="displayRows"
        :loading="isLoading"
        :selectable="true"
        :selected-rows="selectedRows"
        mode="client"
        :row-height="48"
        :buffer-count="10"
        row-key="id"
        @update:selected-rows="selectedRows = $event"
      >
        <template #status-body="{ data }">
          <AppBadge
            :label="STATUS_LABEL[(data as Container).status]"
            :variant="STATUS_BADGE_VARIANT[(data as Container).status]"
          />
        </template>

        <template #header-right>
          <span class="perf__note">
            VirtualScroller renders ~30 DOM nodes regardless of dataset size
          </span>
        </template>
      </AppDataTable>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout     from '@/modules/shared/components/app-layout/AppLayout.vue'
import AppPageHeader from '@/modules/shared/components/app-page-header/AppPageHeader.vue'
import AppDataTable  from '@/modules/shared/components/app-data-table/AppDataTable.vue'
import AppBadge      from '@/modules/shared/components/app-badge/AppBadge.vue'
import AppButton     from '@/modules/shared/components/app-button/AppButton.vue'
import AppSearchInput from '@/modules/shared/components/app-search-input/AppSearchInput.vue'
import AppSelect     from '@/modules/shared/components/app-select/AppSelect.vue'
import type { AppTableColumn } from '@/modules/shared/components/app-data-table/AppDataTable.type'
import type { SidebarItem } from '@/modules/shared/components/app-sidebar/AppSidebar.type'
import type { TopBarTab } from '@/modules/shared/components/app-top-bar/AppTopBar.type'
import type { Container } from '@/domain/entities/container'
import { generateContainers } from '../mocks/containers.mock'
import { STATUS_BADGE_VARIANT, STATUS_LABEL } from '../utils/statusMapper'

const TOTAL = 10_000

const COLUMNS: AppTableColumn[] = [
  { field: 'id',             header: 'ID',              width: '100px', frozen: true, sortable: true },
  { field: 'location',       header: 'Location',        width: '110px', sortable: true },
  { field: 'type',           header: 'Type',            width: '80px',  sortable: true },
  { field: 'capacity',       header: 'Cap.',            width: '80px',  align: 'right', sortable: true },
  { field: 'lastInspection', header: 'Last Insp.',      width: '120px', sortable: true },
  { field: 'notes',          header: 'Notes',           minWidth: '180px', truncate: true },
  { field: 'assignedTeam',   header: 'Team',            width: '110px' },
  { field: 'temperature',    header: 'Temp',            width: '80px',  align: 'right', unit: '°C' },
  { field: 'humidity',       header: 'Hum.',            width: '75px',  align: 'right', unit: '%' },
  { field: 'pressure',       header: 'Pressure',        width: '90px',  align: 'right', unit: ' hPa' },
  { field: 'contract',       header: 'Contract',        width: '110px' },
  { field: 'owner',          header: 'Owner',           width: '100px' },
  { field: 'status',         header: 'Status',          width: '130px' },
]

const STATUS_OPTIONS = [
  { label: 'Active',         value: 'Active' },
  { label: 'Expired',        value: 'Expired' },
  { label: 'Pending Review', value: 'PendingReview' },
]

const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: 'mdi:view-dashboard',  label: 'Dashboard',    routeName: 'mco-dashboard' },
  { icon: 'mdi:table-large',     label: 'Perf Test',    routeName: 'mco-perf' },
  { icon: 'mdi:chart-bar',       label: 'Reports',      routeName: 'mco-dashboard' },
  { icon: 'mdi:account-group',   label: 'Teams',        routeName: 'mco-dashboard' },
]

const TOP_BAR_TABS: TopBarTab[] = [
  { key: 'mco-dashboard', label: 'MCO' },
  { key: 'mco-perf',      label: 'Perf Test' },
]

const CURRENT_USER = { name: 'User Name', initials: 'UN' }

// ── State ──
const allRows    = ref<Container[]>([])
const isLoading  = ref(true)
const loadTimeMs = ref(0)
const filterTimeMs = ref(0)
const selectedRows = ref<Container[]>([])
const searchQuery  = ref('')
const statusFilter = ref<string | null>(null)
const totalRows    = TOTAL

// ── Filtered rows ──
const displayRows = computed<Container[]>(() => {
  const t0 = performance.now()
  let result = allRows.value

  if (statusFilter.value) {
    result = result.filter((c) => c.status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.location.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q),
    )
  }

  filterTimeMs.value = Math.round(performance.now() - t0)
  return result
})

const loadTimeClass = computed(() => {
  if (loadTimeMs.value < 100) return 'perf__metric-value--good'
  if (loadTimeMs.value < 300) return 'perf__metric-value--warn'
  return 'perf__metric-value--bad'
})

// ── Load ──
onMounted(() => {
  const t0 = performance.now()
  // Push to next tick so the skeleton shows first
  requestAnimationFrame(() => {
    allRows.value = generateContainers(TOTAL)
    loadTimeMs.value = Math.round(performance.now() - t0)
    isLoading.value = false
  })
})

function onSearch(val: string) {
  searchQuery.value = val
}

function onStatusFilter(val: unknown) {
  statusFilter.value = (val as string | null) ?? null
}

function clearFilters() {
  searchQuery.value  = ''
  statusFilter.value = null
}
</script>

<style scoped>
.perf__body {
  padding: var(--space-4) var(--space-6);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  overflow: hidden;
}

.perf__controls {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.perf__metrics {
  display: flex;
  gap: var(--space-4);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.perf__metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  min-width: 110px;
}

.perf__metric-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.perf__metric-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.perf__metric-value--highlight {
  color: var(--color-primary);
}

.perf__metric-value--good { color: var(--color-status-active); }
.perf__metric-value--warn { color: var(--color-status-pending); }
.perf__metric-value--bad  { color: var(--color-status-expired); }

.perf__note {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-style: italic;
}
</style>
