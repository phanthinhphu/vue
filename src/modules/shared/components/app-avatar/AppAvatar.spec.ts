import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppAvatar from './AppAvatar.vue'

describe('AppAvatar', () => {
  it('renders initials text when no src', () => {
    const wrapper = mount(AppAvatar, { props: { initials: 'TP' } })
    expect(wrapper.find('.app-avatar__initials').text()).toBe('TP')
  })

  it('renders img element when src provided', () => {
    const wrapper = mount(AppAvatar, { props: { initials: 'TP', src: '/avatar.png' } })
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('on img error falls back to initials', async () => {
    const wrapper = mount(AppAvatar, { props: { initials: 'TP', src: '/bad.png' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('.app-avatar__initials').exists()).toBe(true)
  })

  it('size="sm" applies size class', () => {
    const wrapper = mount(AppAvatar, { props: { initials: 'TP', size: 'sm' } })
    expect(wrapper.classes()).toContain('app-avatar--sm')
  })

  it('size="lg" applies size class', () => {
    const wrapper = mount(AppAvatar, { props: { initials: 'TP', size: 'lg' } })
    expect(wrapper.classes()).toContain('app-avatar--lg')
  })

  it('applies ariaLabel attribute', () => {
    const wrapper = mount(AppAvatar, { props: { initials: 'TP', ariaLabel: 'User avatar' } })
    expect(wrapper.attributes('aria-label')).toBe('User avatar')
  })
})
