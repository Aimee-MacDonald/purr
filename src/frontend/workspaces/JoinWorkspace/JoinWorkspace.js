import React, { useContext } from 'react'

import './JoinWorkspace.sass'

import PurrerFactoryInterface from '../../contractInterfaces/PurrerFactoryInterface'
import { ModalContext } from '../../contexts/Modal'
import { NavigationContext } from '../../contexts/Navigation'

const JoinWorkspace = () => {
  const purrerFactory = new PurrerFactoryInterface()
  const { setNotification } = useContext(ModalContext)
  const { setActiveWorkspace, getWorkspaceIndex } = useContext(NavigationContext)

  const join = () => {
    purrerFactory.join()
      .then(result => {
        setNotification('Minting new Purrer')
        result.wait()
          .then(res => {
            setNotification('Purrer Minted')
            setActiveWorkspace(getWorkspaceIndex('PURRS'))
          })
          .catch(error => setNotification('Something bad happened'))
      })
      .catch(error => setNotification('Something bad happened'))
  }

  return (
    <div id='JoinWorkspace'>
      <button onClick={join}>Join Network</button>
    </div>
  )
}

export default JoinWorkspace