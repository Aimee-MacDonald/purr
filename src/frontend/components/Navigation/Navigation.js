import React, { useContext } from 'react'

import './Navigation.sass'

import { NavigationContext } from '../../contexts/Navigation'

export const Navigation = () => {
  const { setActiveWorkspace, getWorkspaceIndex } = useContext(NavigationContext)

  return (
    <div id='Navigation'>
      <button onClick={() => setActiveWorkspace(getWorkspaceIndex('PURRS'))}>Purrs</button>
      <button onClick={() => setActiveWorkspace(getWorkspaceIndex('NETWORK'))}>Network</button>
    </div>
  )
}

export default Navigation