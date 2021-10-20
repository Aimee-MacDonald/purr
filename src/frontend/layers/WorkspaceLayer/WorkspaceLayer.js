import React, { useContext } from 'react'

import './WorkspaceLayer.sass'

import { NavigationContext } from '../../contexts/Navigation'

import PurrsWorkspace from '../../workspaces/PurrsWorkspace/PurrsWorkspace'
import NetworkWorkspace from '../../workspaces/NetworkWorkspace/NetworkWorkspace'

export const WorkspaceLayer = () => {
  const { activeWorkspace, getWorkspaceIndex } = useContext(NavigationContext)

  return (
    <div id='WorkspaceLayer'>
      {activeWorkspace === getWorkspaceIndex('PURRS') && <PurrsWorkspace />}
      {activeWorkspace === getWorkspaceIndex('NETWORK') && <NetworkWorkspace/>}
    </div>
  )
}

export default WorkspaceLayer