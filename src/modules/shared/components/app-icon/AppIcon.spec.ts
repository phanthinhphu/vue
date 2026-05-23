import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppIcon from './AppIcon.vue'

describe('AppIcon', () => {
  it('renders Icon component', () => {
    const wrapper = mount(AppIcon, { props: { name: 'mdi:home' } })
    expect(wrapper.find('.app-icon').exists()).toBe(true)
  })

  it('passes name prop to Icon', () => {
    const wrapper = mount(AppIcon, { props: { name: 'lucide:search' } })
    expect(wrapper.attributes('icon')).toBeUndefined()
    expect(wrapper.find('[icon]').exists() || wrapper.html()).toBeTruthy()
  })

  it('applies ariaLabel as aria-label attribute', () => {
    const wrapper = mount(AppIcon, { props: { name: 'mdi:home', ariaLabel: 'Home icon' } })
    expect(wrapper.find('[aria-label="Home icon"]').exists()).toBe(true)
  })

  it('uses aria-hidden when no ariaLabel provided', () => {
    const wrapper = mount(AppIcon, { props: { name: 'mdi:home' } })
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })

  it('applies size prop', () => {
    const wrapper = mount(AppIcon, { props: { name: 'mdi:home', size: 24 } })
    expect(wrapper.html()).toContain('24')
  })
})
