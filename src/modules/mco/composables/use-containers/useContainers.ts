import { computed, shallowRef } from 'vue'
import { containerService } from '@/plugins/services/services'
import { useContainersStore } from '@/modules/mco/stores/containers/containers'
import type { Container, ContainerFilter } from '@/domain/entities/container'
import type { AppLazyLoadEvent, AppVirtualLoadEvent } from '@/modules/shared/components/app-data-table/AppDataTable.type'

const CHUNK_SIZE = 100

export function useContainers() {
  const store = useContainersStore()

  // Pre-allocated sparse array for lazy virtual scroll
  const virtualList = shallowRef<(Container | null)[]>([])

  async function execute(signal?: AbortSignal) {
    store.setLoading(true)
    try {
      const data = await containerService.getAll(store.filters, signal)
      store.setContainers(data)
      store.setTotal(data.length)
    } finally {
      store.setLoading(false)
    }
  }

  function initVirtual(total: number) {
    virtualList.value = new Array(total).fill(null)
    store.setTotal(total)
  }

  async function onVirtualLoad(event: AppVirtualLoadEvent) {
    const first = event.first
    const last = Math.min(event.last + CHUNK_SIZE, virtualList.value.length)

    // Skip if already loaded
    if (virtualList.value[first] !== null) return

    store.setLoading(true)
    try {
      const items = await containerService.getChunk(first, last - first)
      const updated = virtualList.value.slice()
      items.forEach((item, i) => { updated[first + i] = item })
      virtualList.value = updated
    } finally {
      store.setLoading(false)
    }
  }

  async function onLazyLoad(event: AppLazyLoadEvent) {
    store.setLoading(true)
    try {
      const result = await containerService.getPage({
        page: event.page,
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

  function applyFilter(filter: Partial<ContainerFilter>) {
    store.setFilter(filter)
  }

  function clearFilters() {
    store.clearFilters()
  }

  function toggleSelect(id: string) {
    const current = store.selectedIds
    const next = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id]
    store.setSelected(next)
  }

  function selectAll() {
    store.setSelected(store.items.map((c) => c.id))
  }

  function clearSelection() {
    store.clearSelected()
  }

  return {
    containers: computed(() =>
      virtualList.value.length > 0 ? virtualList.value : store.filteredItems
    ) as ReturnType<typeof computed<(Container | null)[]>>,
    totalRecords: computed(() => store.total),
    isLoading: computed(() => store.isLoading),
    selectedIds: computed(() => store.selectedIds),
    execute,
    initVirtual,
    onVirtualLoad,
    onLazyLoad,
    applyFilter,
    clearFilters,
    toggleSelect,
    selectAll,
    clearSelection,
  }
}
