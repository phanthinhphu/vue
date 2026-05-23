import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useContainersStore } from './containers'
import type { Container } from '@/domain/entities/container'

const mockContainers: Container[] = [
  { id: 'C001', location: 'Loc 251', type: 'Tank', capacity: 1100, lastInspection: '2026-12-01', notes: '', assignedTeam: 'Team A', temperature: 22, humidity: 45, pressure: 1013, contract: 'CTR-001', owner: 'Acme', status: 'Active' },
  { id: 'C002', location: 'Loc 102', type: 'Drum', capacity: 200, lastInspection: '2026-08-15', notes: '', assignedTeam: 'Team B', temperature: 18, humidity: 60, pressure: 1010, contract: 'CTR-002', owner: 'BetaCo', status: 'Expired' },
  { id: 'C003', location: 'Loc 305', type: 'IBC', capacity: 1000, lastInspection: '2026-03-22', notes: '', assignedTeam: 'Team A', temperature: 20, humidity: 55, pressure: 1012, contract: 'CTR-003', owner: 'GammaTech', status: 'PendingReview' },
]

describe('useContainersStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('initial state: items=[], selectedIds=[], isLoading=false, filters={}', () => {
    const store = useContainersStore()
    expect(store.items).toEqual([])
    expect(store.selectedIds).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.filters).toEqual({})
  })

  it('setContainers(items) updates state.items', () => {
    const store = useContainersStore()
    store.setContainers(mockContainers)
    expect(store.items).toHaveLength(3)
  })

  it('setLoading(true/false) toggles isLoading', () => {
    const store = useContainersStore()
    store.setLoading(true)
    expect(store.isLoading).toBe(true)
    store.setLoading(false)
    expect(store.isLoading).toBe(false)
  })

  it('setSelected([id1, id2]) updates selectedIds', () => {
    const store = useContainersStore()
    store.setSelected(['C001', 'C002'])
    expect(store.selectedIds).toEqual(['C001', 'C002'])
  })

  it('clearSelected() resets selectedIds to []', () => {
    const store = useContainersStore()
    store.setSelected(['C001'])
    store.clearSelected()
    expect(store.selectedIds).toEqual([])
  })

  it('setFilter merges into filters', () => {
    const store = useContainersStore()
    store.setFilter({ status: 'Active' })
    expect(store.filters.status).toBe('Active')
  })

  it('clearFilters() resets filters to {}', () => {
    const store = useContainersStore()
    store.setFilter({ status: 'Active' })
    store.clearFilters()
    expect(store.filters).toEqual({})
  })

  it('filteredItems returns only items matching active filters', () => {
    const store = useContainersStore()
    store.setContainers(mockContainers)
    store.setFilter({ status: 'Active' })
    expect(store.filteredItems).toHaveLength(1)
    expect(store.filteredItems[0].status).toBe('Active')
  })

  it('filteredItems returns all items when filters={}', () => {
    const store = useContainersStore()
    store.setContainers(mockContainers)
    expect(store.filteredItems).toHaveLength(3)
  })
})
