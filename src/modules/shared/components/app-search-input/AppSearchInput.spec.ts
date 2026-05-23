import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSearchInput from './AppSearchInput.vue'

describe('AppSearchInput', () => {
  it('renders search icon', () => {
    const wrapper = mount(AppSearchInput, { props: { modelValue: '' } })
    expect(wrapper.find('.app-search__icon').exists()).toBe(true)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(AppSearchInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('test')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test'])
  })

  it('placeholder prop applied', () => {
    const wrapper = mount(AppSearchInput, {
      props: { modelValue: '', placeholder: 'Search containers...' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search containers...')
  })

  it('loading=true shows spinner', () => {
    const wrapper = mount(AppSearchInput, { props: { modelValue: '', loading: true } })
    expect(wrapper.find('.app-search__spinner').exists()).toBe(true)
  })
})
