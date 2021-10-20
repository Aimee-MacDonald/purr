import React from 'react'
import { shallow } from 'enzyme'

import { NavigationLayer } from '../../../src/frontend/layers/NavigationLayer/NavigationLayer.js'

test('Render NavigationLayer', () => {
  const wrapper = shallow(<NavigationLayer/>)
  expect(wrapper.getElement()).toMatchSnapshot()
})