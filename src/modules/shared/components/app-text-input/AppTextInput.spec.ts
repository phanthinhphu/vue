import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTextInput from './AppTextInput.vue'

describe('AppTextInput', () => {
  it('renders label text', () => {
    const wrapper = mount(AppTextInput, { props: { modelValue: '', label: 'Username' } })
    expect(wrapper.find('.app-input__label').text()).toContain('Username')
  })

  it('modelValue binds to input value', () => {
    const wrapper = mount(AppTextInput, { props: { modelValue: 'hello', label: '' } })
    expect(wrapper.find('input').element.value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(AppTextInput, { props: { modelValue: '', label: '' } })
    await wrapper.find('input').setValue('typed')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['typed'])
  })

  it('error prop shows error message text', () => {
    const wrapper = mount(AppTextInput, { props: { modelValue: '', error: 'Required field' } })
    expect(wrapper.find('.app-input__error-msg').text()).toBe('Required field')
  })

  it('error state applies error CSS class', () => {
    const wrapper = mount(AppTextInput, { props: { modelValue: '', error: 'Error' } })
    expect(wrapper.classes()).toContain('app-input--error')
  })

  it('disabled=true disables input', () => {
    const wrapper = mount(AppTextInput, { props: { modelValue: '', disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('required=true marks label with required indicator', () => {
    const wrapper = mount(AppTextInput, { props: { modelValue: '', label: 'Name', required: true } })
    expect(wrapper.find('.app-input__required').exists()).toBe(true)
  })

  it('iconLeft renders icon inside input', () => {
    const wrapper = mount(AppTextInput, { props: { modelValue: '', iconLeft: 'mdi:search' } })
    expect(wrapper.find('.app-input__icon-left').exists()).toBe(true)
  })
})
