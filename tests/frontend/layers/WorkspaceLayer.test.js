import React from 'react'
import { shallow } from 'enzyme'

import { WorkspaceLayer } from '../../../src/frontend/layers/WorkspaceLayer/WorkspaceLayer'

test('Render WorkspaceLayer', () => {
  const wrapper = shallow(<WorkspaceLayer/>)
  expect(wrapper.getElement()).toMatchSnapshot()
})