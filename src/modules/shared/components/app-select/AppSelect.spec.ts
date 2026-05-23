import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSelect from './AppSelect.vue'

const options = [
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
]

describe('AppSelect', () => {
  it('renders label text', () => {
    const wrapper = mount(AppSelect, { props: { modelValue: null, options, label: 'Status' } })
    expect(wrapper.find('.app-select__label').text()).toBe('Status')
  })

  it('renders Select component with options prop', () => {
    const wrapper = mount(AppSelect, { props: { modelValue: null, options } })
    expect(wrapper.find('.app-select__field').exists()).toBe(true)
  })

  it('placeholder shown when no value', () => {
    const wrapper = mount(AppSelect, {
      props: { modelValue: null, options, placeholder: 'Choose...' },
    })
    expect(wrapper.html()).toContain('Choose...')
  })

  it('disabled=true disables select', () => {
    const wrapper = mount(AppSelect, { props: { modelValue: null, options, disabled: true } })
    expect(wrapper.classes()).toContain('app-select--disabled')
  })

  it('error prop shows error message', () => {
    const wrapper = mount(AppSelect, { props: { modelValue: null, options, error: 'Required' } })
    expect(wrapper.find('.app-select__error-msg').text()).toBe('Required')
  })
})
