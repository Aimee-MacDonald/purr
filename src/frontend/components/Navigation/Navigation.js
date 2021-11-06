import React, { useContext, useState } from 'react'

import './Navigation.sass'

import { NavigationContext } from '../../contexts/Navigation'

export const Navigation = () => {
  const { setActiveWorkspace, getWorkspaceIndex } = useContext(NavigationContext)
  const [ isOpen, setOpen ] = useState(false)

  return (
    <div id='Navigation' className={`navigation${isOpen ? 'Open' : 'Closed'}`}>
      <button id='toggleNav' onClick={() => setOpen(!isOpen)}>X</button>
      <button onClick={() => setActiveWorkspace(getWorkspaceIndex('PURRS'))}>Purrs</button>
      <button onClick={() => setActiveWorkspace(getWorkspaceIndex('NETWORK'))}>Network</button>
    </div>
  )
}

export default Navigation