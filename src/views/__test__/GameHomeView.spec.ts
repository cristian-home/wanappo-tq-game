import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import GameHomeView from '../GameHomeView.vue'

describe('GameHomeView', () => {
  it('renders properly', () => {
    const wrapper = mount(GameHomeView)
    expect(wrapper.text()).toContain('Game Home')
  })
})
