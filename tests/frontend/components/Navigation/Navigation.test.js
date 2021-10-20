import React from 'react'
import { shallow } from 'enzyme'

import { Navigation } from '../../../../src/frontend/components/Navigation/Navigation'

test('Render Navigation', () => {
  const wrapper = shallow(<Navigation/>)
  expect(wrapper.getElement()).toMatchSnapshot()
})