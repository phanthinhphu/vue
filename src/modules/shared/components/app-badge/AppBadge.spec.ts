import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBadge from './AppBadge.vue'

describe('AppBadge', () => {
  it('renders label text', () => {
    const wrapper = mount(AppBadge, { props: { label: 'Active' } })
    expect(wrapper.text()).toContain('Active')
  })

  it('variant="success" applies success CSS class', () => {
    const wrapper = mount(AppBadge, { props: { label: 'Active', variant: 'success' } })
    expect(wrapper.classes()).toContain('app-badge--success')
  })

  it('variant="danger" applies danger CSS class', () => {
    const wrapper = mount(AppBadge, { props: { label: 'Expired', variant: 'danger' } })
    expect(wrapper.classes()).toContain('app-badge--danger')
  })

  it('variant="warning" applies warning CSS class', () => {
    const wrapper = mount(AppBadge, { props: { label: 'Pending', variant: 'warning' } })
    expect(wrapper.classes()).toContain('app-badge--warning')
  })

  it('variant="neutral" applies neutral CSS class', () => {
    const wrapper = mount(AppBadge, { props: { label: 'Unknown', variant: 'neutral' } })
    expect(wrapper.classes()).toContain('app-badge--neutral')
  })

  it('has role="status" aria attribute', () => {
    const wrapper = mount(AppBadge, { props: { label: 'Active' } })
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('dot=true renders dot indicator', () => {
    const wrapper = mount(AppBadge, { props: { label: 'Active', dot: true } })
    expect(wrapper.find('.app-badge__dot').exists()).toBe(true)
  })
})
