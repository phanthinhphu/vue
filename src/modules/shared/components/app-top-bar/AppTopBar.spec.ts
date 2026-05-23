import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTopBar from './AppTopBar.vue'

const user = { name: 'Test User', initials: 'TU' }
const tabs = [
  { key: 'mco', label: 'MCO', active: true },
  { key: 'reports', label: 'Reports', active: false },
]

describe('AppTopBar', () => {
  it('renders appTitle text', () => {
    const wrapper = mount(AppTopBar, { props: { appTitle: 'Management Tool', tabs, user } })
    expect(wrapper.find('.app-topbar__title').text()).toBe('Management Tool')
  })

  it('renders tab label for each tab in tabs prop', () => {
    const wrapper = mount(AppTopBar, { props: { appTitle: 'Tool', tabs, user } })
    expect(wrapper.findAll('.app-topbar__tab')).toHaveLength(2)
  })

  it('active tab has active CSS class', () => {
    const wrapper = mount(AppTopBar, { props: { appTitle: 'Tool', tabs, user } })
    expect(wrapper.findAll('.app-topbar__tab')[0].classes()).toContain('app-topbar__tab--active')
  })

  it('clicking tab emits tab-change(key)', async () => {
    const wrapper = mount(AppTopBar, { props: { appTitle: 'Tool', tabs, user } })
    await wrapper.findAll('.app-topbar__tab')[1].trigger('click')
    expect(wrapper.emitted('tab-change')?.[0]).toEqual(['reports'])
  })

  it('renders user.name text', () => {
    const wrapper = mount(AppTopBar, { props: { appTitle: 'Tool', tabs, user } })
    expect(wrapper.find('.app-topbar__user-name').text()).toBe('Test User')
  })

  it('tab with active=false does NOT have active class', () => {
    const wrapper = mount(AppTopBar, { props: { appTitle: 'Tool', tabs, user } })
    expect(wrapper.findAll('.app-topbar__tab')[1].classes()).not.toContain('app-topbar__tab--active')
  })
})
