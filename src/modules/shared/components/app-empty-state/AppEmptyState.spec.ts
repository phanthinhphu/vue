import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppEmptyState from './AppEmptyState.vue'

describe('AppEmptyState', () => {
  it('renders title prop', () => {
    const wrapper = mount(AppEmptyState, { props: { title: 'No data' } })
    expect(wrapper.find('.app-empty-state__title').text()).toBe('No data')
  })

  it('renders description prop when provided', () => {
    const wrapper = mount(AppEmptyState, { props: { title: 'No data', description: 'Try adding items.' } })
    expect(wrapper.find('.app-empty-state__description').text()).toBe('Try adding items.')
  })

  it('renders icon when provided', () => {
    const wrapper = mount(AppEmptyState, { props: { title: 'No data', icon: 'mdi:inbox' } })
    expect(wrapper.find('.app-empty-state__icon').exists()).toBe(true)
  })

  it('renders #actions slot content', () => {
    const wrapper = mount(AppEmptyState, {
      props: { title: 'No data' },
      slots: { actions: '<button>Add item</button>' },
    })
    expect(wrapper.find('.app-empty-state__actions button').text()).toBe('Add item')
  })

  it('does not render description node when prop absent', () => {
    const wrapper = mount(AppEmptyState, { props: { title: 'No data' } })
    expect(wrapper.find('.app-empty-state__description').exists()).toBe(false)
  })
})
