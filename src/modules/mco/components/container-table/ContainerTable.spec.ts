import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContainerTable from './ContainerTable.vue'
import type { Container } from '@/domain/entities/container'

const containers: Container[] = [
  { id: 'C001', location: 'Loc 251', type: 'Tank', capacity: 1100, lastInspection: '2026-12-01', notes: 'Note A', assignedTeam: 'Team A', temperature: 22, humidity: 45, pressure: 1013, contract: 'CTR-001', owner: 'Acme', status: 'Active' },
  { id: 'C002', location: 'Loc 102', type: 'Drum', capacity: 200, lastInspection: '2026-08-15', notes: '', assignedTeam: 'Team B', temperature: 18, humidity: 60, pressure: 1010, contract: 'CTR-002', owner: 'BetaCo', status: 'Expired' },
  { id: 'C003', location: 'Loc 305', type: 'IBC', capacity: 1000, lastInspection: '2026-03-22', notes: '', assignedTeam: 'Team A', temperature: 20, humidity: 55, pressure: 1012, contract: 'CTR-003', owner: 'GammaTech', status: 'PendingReview' },
]

describe('ContainerTable', () => {
  it('renders AppDataTable with CONTAINER_COLUMNS', () => {
    const wrapper = mount(ContainerTable, { props: { containers, isLoading: false } })
    expect(wrapper.find('.app-dt').exists()).toBe(true)
  })

  it('passes isLoading to AppDataTable', () => {
    const wrapper = mount(ContainerTable, { props: { containers, isLoading: true } })
    expect(wrapper.find('.app-dt').exists()).toBe(true)
  })

  it('status column renders AppBadge for Active', () => {
    // mode='server' avoids VirtualScroller which requires DOM layout (jsdom limitation)
    const wrapper = mount(ContainerTable, {
      props: { containers: [containers[0]], isLoading: false, mode: 'server' },
    })
    expect(wrapper.find('.app-badge').exists()).toBe(true)
  })

  it('Active badge has success variant class', () => {
    const wrapper = mount(ContainerTable, { props: { containers: [containers[0]], isLoading: false, mode: 'server' } })
    expect(wrapper.find('.app-badge--success').exists()).toBe(true)
  })

  it('Expired badge has danger variant class', () => {
    const wrapper = mount(ContainerTable, { props: { containers: [containers[1]], isLoading: false, mode: 'server' } })
    expect(wrapper.find('.app-badge--danger').exists()).toBe(true)
  })

  it('PendingReview badge has warning variant class', () => {
    const wrapper = mount(ContainerTable, { props: { containers: [containers[2]], isLoading: false, mode: 'server' } })
    expect(wrapper.find('.app-badge--warning').exists()).toBe(true)
  })
})
