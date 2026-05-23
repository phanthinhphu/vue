import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSidebar from './AppSidebar.vue'

const items = [
  { icon: 'mdi:view-dashboard', label: 'Dashboard', routeName: 'mco-dashboard', active: true },
  { icon: 'mdi:magnify', label: 'Search', routeName: 'search' },
]

describe('AppSidebar', () => {
  it('renders one button per item in items prop', () => {
    const wrapper = mount(AppSidebar, { props: { items, logoSrc: '/logo.svg' } })
    expect(wrapper.findAll('.app-sidebar__item')).toHaveLength(2)
  })

  it('active item has active CSS class applied', () => {
    const wrapper = mount(AppSidebar, { props: { items, logoSrc: '/logo.svg' } })
    expect(wrapper.findAll('.app-sidebar__item')[0].classes()).toContain('app-sidebar__item--active')
  })

  it('each button has aria-label matching item.label', () => {
    const wrapper = mount(AppSidebar, { props: { items, logoSrc: '/logo.svg' } })
    expect(wrapper.findAll('.app-sidebar__item')[0].attributes('aria-label')).toBe('Dashboard')
  })

  it('clicking nav item emits navigate(routeName)', async () => {
    const wrapper = mount(AppSidebar, { props: { items, logoSrc: '/logo.svg' } })
    await wrapper.findAll('.app-sidebar__item')[0].trigger('click')
    expect(wrapper.emitted('navigate')?.[0]).toEqual(['mco-dashboard'])
  })

  it('renders logoSrc in img element', () => {
    const wrapper = mount(AppSidebar, { props: { items, logoSrc: '/logo.svg' } })
    expect(wrapper.find('.app-sidebar__logo img').attributes('src')).toBe('/logo.svg')
  })

  it('renders bottomLogoSrc when provided', () => {
    const wrapper = mount(AppSidebar, {
      props: { items, logoSrc: '/logo.svg', bottomLogoSrc: '/bottom.svg' },
    })
    expect(wrapper.find('.app-sidebar__bottom-logo img').attributes('src')).toBe('/bottom.svg')
  })
})
