<template>
  <AppLayout
    :sidebar-items="SIDEBAR_ITEMS"
    :top-bar-tabs="TOP_BAR_TABS"
    app-title="Management Tool"
    :user="CURRENT_USER"
    logo-src="/src/assets/icons/logo.svg"
  >
    <AppPageHeader title="Dashboard" description="Container Monitoring Overview">
      <template #actions>
        <AppSearchInput
          v-model="searchQuery"
          placeholder="Search containers..."
          @search="onSearch"
        />
      </template>
    </AppPageHeader>

    <div class="dashboard__body">
      <ContainerTable
        :containers="containers"
        :is-loading="isLoading"
        :selected-rows="selectedContainers"
        @update:selected-rows="selectedContainers = $event"
        @filter-change="onFilterChange"
        @row-click="onRowClick"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/modules/shared/components/app-layout/AppLayout.vue'
import AppPageHeader from '@/modules/shared/components/app-page-header/AppPageHeader.vue'
import AppSearchInput from '@/modules/shared/components/app-search-input/AppSearchInput.vue'
import ContainerTable from '../components/container-table/ContainerTable.vue'
import { useContainers } from '../composables/use-containers/useContainers'
import type { Container } from '@/domain/entities/container'
import type { SidebarItem } from '@/modules/shared/components/app-sidebar/AppSidebar.type'
import type { TopBarTab } from '@/modules/shared/components/app-top-bar/AppTopBar.type'

const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: 'mdi:view-dashboard',    label: 'Dashboard', routeName: 'mco-dashboard' },
  { icon: 'mdi:magnify',           label: 'Search',    routeName: 'mco-dashboard' },
  { icon: 'mdi:chart-bar',         label: 'Reports',   routeName: 'mco-dashboard' },
  { icon: 'mdi:trending-up',       label: 'Trends',    routeName: 'mco-dashboard' },
  { icon: 'mdi:earth',             label: 'Map',       routeName: 'mco-dashboard' },
  { icon: 'mdi:account-group',     label: 'Teams',     routeName: 'mco-dashboard' },
]

const TOP_BAR_TABS: TopBarTab[] = [
  { key: 'mco-dashboard', label: 'MCO' },
]

const CURRENT_USER = { name: 'User Name', initials: 'UN' }

const { containers, isLoading, execute, applyFilter } = useContainers()

const searchQuery = ref('')
const selectedContainers = ref<Container[]>([])

onMounted(() => execute())

function onSearch(val: string) {
  applyFilter({ search: val })
}

function onFilterChange(filters: Record<string, string[]>) {
  if (filters.status?.length) {
    applyFilter({ status: filters.status as Container['status'][] })
  } else {
    applyFilter({ status: undefined })
  }
}

function onRowClick(_row: Container) {
  // future: open detail panel
}
</script>

<style scoped>
.dashboard__body {
  padding: var(--space-4) var(--space-6);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
