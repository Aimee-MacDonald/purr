import React from 'react'

import './JoinWorkspace.sass'

import PurrerFactoryInterface from '../../contractInterfaces/PurrerFactoryInterface'

const JoinWorkspace = () => {
  const purrerFactory = new PurrerFactoryInterface()

  return (
    <div id='JoinWorkspace'>
      <button onClick={() => purrerFactory.join()}>Join Network</button>
    </div>
  )
}

export default JoinWorkspace