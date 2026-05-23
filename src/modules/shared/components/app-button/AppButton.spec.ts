import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from './AppButton.vue'

describe('AppButton', () => {
  it('renders slot content as button label', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Save' } })
    expect(wrapper.find('.app-btn__label').text()).toBe('Save')
  })

  it('variant="primary" applies primary CSS class', () => {
    const wrapper = mount(AppButton, { props: { variant: 'primary' } })
    expect(wrapper.classes()).toContain('app-btn--primary')
  })

  it('variant="danger" applies danger CSS class', () => {
    const wrapper = mount(AppButton, { props: { variant: 'danger' } })
    expect(wrapper.classes()).toContain('app-btn--danger')
  })

  it('size="sm" applies sm class', () => {
    const wrapper = mount(AppButton, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('app-btn--sm')
  })

  it('size="lg" applies lg class', () => {
    const wrapper = mount(AppButton, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('app-btn--lg')
  })

  it('loading=true shows spinner and disables button', () => {
    const wrapper = mount(AppButton, { props: { loading: true } })
    expect(wrapper.classes()).toContain('app-btn--loading')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('disabled=true applies disabled attribute', () => {
    const wrapper = mount(AppButton, { props: { disabled: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits click when clicked', async () => {
    const wrapper = mount(AppButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does NOT emit click when disabled', async () => {
    const wrapper = mount(AppButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('iconLeft renders AppIcon before label', () => {
    const wrapper = mount(AppButton, {
      props: { iconLeft: 'mdi:plus' },
      slots: { default: 'Add' },
    })
    expect(wrapper.find('.app-btn__icon-left').exists()).toBe(true)
  })
})
