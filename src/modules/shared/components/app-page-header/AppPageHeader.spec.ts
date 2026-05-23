import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppPageHeader from './AppPageHeader.vue'

describe('AppPageHeader', () => {
  it('renders title prop as h1', () => {
    const wrapper = mount(AppPageHeader, { props: { title: 'Dashboard' } })
    expect(wrapper.find('h1').text()).toBe('Dashboard')
  })

  it('renders description prop as subtitle text', () => {
    const wrapper = mount(AppPageHeader, {
      props: { title: 'Dashboard', description: 'Overview of all containers' },
    })
    expect(wrapper.find('.app-page-header__description').text()).toBe('Overview of all containers')
  })

  it('renders #actions slot', () => {
    const wrapper = mount(AppPageHeader, {
      props: { title: 'Dashboard' },
      slots: { actions: '<button class="export-btn">Export</button>' },
    })
    expect(wrapper.find('.export-btn').exists()).toBe(true)
  })

  it('does not render description node when absent', () => {
    const wrapper = mount(AppPageHeader, { props: { title: 'Dashboard' } })
    expect(wrapper.find('.app-page-header__description').exists()).toBe(false)
  })
})
