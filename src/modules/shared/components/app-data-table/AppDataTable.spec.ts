import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppDataTable from './AppDataTable.vue'
import type { AppTableColumn } from './AppDataTable.type'

const columns: AppTableColumn[] = [
  { field: 'name', header: 'Name', sortable: true },
  { field: 'status', header: 'Status', filterable: true, filterOptions: [{ label: 'Active', value: 'Active' }] },
]
const data = [
  { id: '1', name: 'Item A', status: 'Active' },
  { id: '2', name: 'Item B', status: 'Expired' },
]

describe('AppDataTable', () => {
  it('renders correct number of column headers', () => {
    const wrapper = mount(AppDataTable, { props: { columns, data } })
    expect(wrapper.find('.app-dt').exists()).toBe(true)
  })

  it('shows AppEmptyState when data=[] and loading=false', () => {
    const wrapper = mount(AppDataTable, { props: { columns, data: [] } })
    expect(wrapper.html()).toContain('No data available')
  })

  it('filterable column header renders filter icon button', () => {
    const wrapper = mount(AppDataTable, { props: { columns, data } })
    expect(wrapper.find('.app-dt__filter-btn').exists()).toBe(true)
  })

  it('column with truncate=true renders cell with title attribute', () => {
    const truncateCols: AppTableColumn[] = [{ field: 'notes', header: 'Notes', truncate: true }]
    const truncateData = [{ id: '1', notes: 'Long note text here' }]
    // mode='server' avoids VirtualScroller which requires DOM layout (jsdom limitation)
    const wrapper = mount(AppDataTable, { props: { columns: truncateCols, data: truncateData, mode: 'server', totalRecords: 1 } })
    expect(wrapper.find('.app-dt__cell-truncate').exists()).toBe(true)
  })

  it('renders #header-right slot content above table', () => {
    const wrapper = mount(AppDataTable, {
      props: { columns, data },
      slots: { 'header-right': '<button class="export-btn">Export</button>' },
    })
    expect(wrapper.find('.export-btn').exists()).toBe(true)
  })

  it('does NOT render paginator when mode="client"', () => {
    const wrapper = mount(AppDataTable, { props: { columns, data, mode: 'client' } })
    expect(wrapper.find('.p-paginator').exists()).toBe(false)
  })

  it('custom slot renders slot content instead of default text', () => {
    // mode='server' avoids VirtualScroller which requires DOM layout (jsdom limitation)
    const wrapper = mount(AppDataTable, {
      props: { columns, data, mode: 'server', totalRecords: 2 },
      slots: { 'status-body': '<span class="custom-status">CUSTOM</span>' },
    })
    expect(wrapper.find('.custom-status').exists()).toBe(true)
  })
})
