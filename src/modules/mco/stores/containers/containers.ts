import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Container, ContainerFilter } from '@/domain/entities/container'

export const useContainersStore = defineStore('containers', () => {
  const items = ref<Container[]>([])
  const isLoading = ref(false)
  const total = ref(0)
  const selectedIds = ref<string[]>([])
  const filters = ref<ContainerFilter>({})

  const filteredItems = computed(() => {
    let result = items.value

    if (filters.value.status) {
      const statuses = Array.isArray(filters.value.status)
        ? filters.value.status
        : [filters.value.status]
      result = result.filter((c) => statuses.includes(c.status))
    }

    if (filters.value.contract) {
      result = result.filter((c) =>
        c.contract.toLowerCase().includes(filters.value.contract!.toLowerCase()),
      )
    }

    if (filters.value.owner) {
      result = result.filter((c) =>
        c.owner.toLowerCase().includes(filters.value.owner!.toLowerCase()),
      )
    }

    return result
  })

  function setContainers(data: Container[]) {
    items.value = data
  }

  function setLoading(val: boolean) {
    isLoading.value = val
  }

  function setTotal(val: number) {
    total.value = val
  }

  function setSelected(ids: string[]) {
    selectedIds.value = ids
  }

  function clearSelected() {
    selectedIds.value = []
  }

  function setFilter(filter: Partial<ContainerFilter>) {
    filters.value = { ...filters.value, ...filter }
  }

  function clearFilters() {
    filters.value = {}
  }

  return {
    items,
    isLoading,
    total,
    selectedIds,
    filters,
    filteredItems,
    setContainers,
    setLoading,
    setTotal,
    setSelected,
    clearSelected,
    setFilter,
    clearFilters,
  }
})
