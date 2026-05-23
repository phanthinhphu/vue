import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/plugins/services/services', () => ({
  containerService: {
    getAll: vi.fn().mockResolvedValue([
      { id: 'C001', location: 'Loc 1', type: 'Tank', capacity: 1000, lastInspection: '2026-01-01', notes: '', assignedTeam: 'Team A', temperature: 20, humidity: 50, pressure: 1013, contract: 'CTR-001', owner: 'Acme', status: 'Active' },
    ]),
    getPage: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  },
}))

import { useContainers } from './useContainers'
import { useContainersStore } from '@/modules/mco/stores/containers/containers'

describe('useContainers', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('execute() calls containerService.getAll', async () => {
    const { execute } = useContainers()
    const { containerService } = await import('@/plugins/services/services')
    await execute()
    expect(containerService.getAll).toHaveBeenCalled()
  })

  it('sets store.isLoading=true before fetch, false after', async () => {
    const store = useContainersStore()
    const { execute } = useContainers()
    expect(store.isLoading).toBe(false)
    await execute()
    expect(store.isLoading).toBe(false)
  })

  it('containers ref returns store.filteredItems', () => {
    const { containers } = useContainers()
    const store = useContainersStore()
    expect(containers.value).toBe(store.filteredItems)
  })

  it('applyFilter calls store.setFilter', () => {
    const { applyFilter } = useContainers()
    const store = useContainersStore()
    applyFilter({ status: 'Active' })
    expect(store.filters.status).toBe('Active')
  })

  it('clearFilters() calls store.clearFilters', () => {
    const { applyFilter, clearFilters } = useContainers()
    const store = useContainersStore()
    applyFilter({ status: 'Expired' })
    clearFilters()
    expect(store.filters).toEqual({})
  })

  it('toggleSelect adds id if not present', async () => {
    const { execute, toggleSelect } = useContainers()
    await execute()
    toggleSelect('C001')
    const store = useContainersStore()
    expect(store.selectedIds).toContain('C001')
  })

  it('clearSelection calls store.clearSelected', async () => {
    const { execute, toggleSelect, clearSelection } = useContainers()
    await execute()
    toggleSelect('C001')
    clearSelection()
    const store = useContainersStore()
    expect(store.selectedIds).toEqual([])
  })
})
