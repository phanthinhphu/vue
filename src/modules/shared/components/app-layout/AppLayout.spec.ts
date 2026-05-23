import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppLayout from './AppLayout.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

const props = {
  sidebarItems: [{ icon: 'mdi:view-dashboard', label: 'Dashboard', routeName: 'mco-dashboard' }],
  topBarTabs: [{ key: 'mco', label: 'MCO' }],
  appTitle: 'Management Tool',
  user: { name: 'Test User', initials: 'TU' },
  logoSrc: '/logo.svg',
}

describe('AppLayout', () => {
  it('renders AppSidebar', () => {
    const wrapper = mount(AppLayout, { props, global: { plugins: [router] } })
    expect(wrapper.find('.app-sidebar').exists()).toBe(true)
  })

  it('renders AppTopBar', () => {
    const wrapper = mount(AppLayout, { props, global: { plugins: [router] } })
    expect(wrapper.find('.app-topbar').exists()).toBe(true)
  })

  it('renders default slot in content area', () => {
    const wrapper = mount(AppLayout, {
      props,
      slots: { default: '<div class="page-content">Content</div>' },
      global: { plugins: [router] },
    })
    expect(wrapper.find('.page-content').exists()).toBe(true)
  })
})
