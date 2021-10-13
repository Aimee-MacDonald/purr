import React from 'react'
import { shallow } from 'enzyme'

import { PurrInteraction } from '../../../../src/frontend/components/PurrInteraction'

test('Render PurrInteraction', () => {
  const wrapper = shallow(<PurrInteraction/>)
  expect(wrapper.getElement()).toMatchSnapshot()
})



/*
mport React, { useState as useStateMock } from 'react'
import { mount } from 'enzyme'

// Header uses `useState`
import { Header } from '..'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}))

describe('Header', () => {
  const setState = jest.fn()

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setState])
  })

  it('renders', () => {
    const wrapper = mount(
      <Header />
    )
    expect(setState).toHaveBeenCalledTimes(1)
    expect(wrapper).toBeTruthy()
  })
})
*/