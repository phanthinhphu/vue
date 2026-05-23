<template>
  <AppDataTable
    :columns="CONTAINER_COLUMNS"
    :data="containers"
    :loading="isLoading"
    :selectable="true"
    :selected-rows="selectedRows"
    row-key="id"
    :mode="mode"
    :lazy-scroll="lazyScroll"
    @update:selected-rows="onSelectionUpdate"
    @filter="onFilter"
    @lazy-load="onLazyLoad"
    @virtual-load="onVirtualLoad"
    @row-click="onRowClick"
  >
    <template #status-body="{ data }">
      <AppBadge
        v-if="data != null"
        :label="getStatusLabel(data)"
        :variant="getStatusVariant(data)"
      />
    </template>
  </AppDataTable>
</template>

<script setup lang="ts">
import AppDataTable from '@/modules/shared/components/app-data-table/AppDataTable.vue'
import AppBadge from '@/modules/shared/components/app-badge/AppBadge.vue'
import type { Container, ContainerStatus } from '@/domain/entities/container'
import type { AppLazyLoadEvent, AppVirtualLoadEvent, DataTableMode } from '@/modules/shared/components/app-data-table/AppDataTable.type'
import type { AppBadgeVariant } from '@/modules/shared/components/app-badge/AppBadge.type'
import { STATUS_BADGE_VARIANT, STATUS_LABEL } from '../../utils/statusMapper'
import { CONTAINER_COLUMNS } from './ContainerTable.type'

withDefaults(defineProps<{
  containers: (Container | null)[]
  isLoading: boolean
  selectedRows?: Container[]
  mode?: DataTableMode
  lazyScroll?: boolean
}>(), { mode: 'client', lazyScroll: false })

const emit = defineEmits<{
  'update:selectedRows': [rows: Container[]]
  'filter-change': [filters: Record<string, string[]>]
  'lazy-load': [event: AppLazyLoadEvent]
  'virtual-load': [event: AppVirtualLoadEvent]
  'row-click': [row: Container]
}>()

function getStatusLabel(data: unknown): string {
  const status = (data as Container)?.status as ContainerStatus
  return STATUS_LABEL[status] ?? status
}

function getStatusVariant(data: unknown): AppBadgeVariant {
  const status = (data as Container)?.status as ContainerStatus
  return STATUS_BADGE_VARIANT[status] ?? 'neutral'
}

function onSelectionUpdate(rows: unknown[]) {
  emit('update:selectedRows', rows as Container[])
}

function onFilter(filters: Record<string, string[]>) {
  emit('filter-change', filters)
}

function onLazyLoad(event: AppLazyLoadEvent) {
  emit('lazy-load', event)
}

function onVirtualLoad(event: AppVirtualLoadEvent) {
  emit('virtual-load', event)
}

function onRowClick(row: unknown) {
  if (row == null) return
  emit('row-click', row as Container)
}
</script>
