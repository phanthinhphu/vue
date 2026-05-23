import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSkeleton from './AppSkeleton.vue'

describe('AppSkeleton', () => {
  it('variant="text" renders text skeleton lines', () => {
    const wrapper = mount(AppSkeleton, { props: { variant: 'text', rows: 1 } })
    expect(wrapper.find('.app-skeleton__line').exists()).toBe(true)
  })

  it('rows=3 renders 3 skeleton lines', () => {
    const wrapper = mount(AppSkeleton, { props: { variant: 'text', rows: 3 } })
    expect(wrapper.findAll('.app-skeleton__line')).toHaveLength(3)
  })

  it('variant="rect" renders block skeleton', () => {
    const wrapper = mount(AppSkeleton, { props: { variant: 'rect' } })
    expect(wrapper.find('.app-skeleton__block').exists()).toBe(true)
  })

  it('variant="circle" renders circular skeleton', () => {
    const wrapper = mount(AppSkeleton, { props: { variant: 'circle' } })
    expect(wrapper.classes()).toContain('app-skeleton--circle')
  })

  it('applies width/height style props', () => {
    const wrapper = mount(AppSkeleton, { props: { variant: 'rect', width: '80px', height: '40px' } })
    expect(wrapper.find('.app-skeleton__block').attributes('style')).toContain('80px')
  })

  it('has aria-hidden="true" (decorative)', () => {
    const wrapper = mount(AppSkeleton, { props: {} })
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
