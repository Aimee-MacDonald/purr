import React, { useContext, useEffect } from 'react'

import './WorkspaceLayer.sass'

import { NavigationContext } from '../../contexts/Navigation'

import JoinWorkspace from '../../workspaces/JoinWorkspace/JoinWorkspace'
import PurrerWorkspace from '../../workspaces/PurrerWorkspace/PurrerWorkspace'
import LootWorkspace from '../../workspaces/LootWorkspace/LootWorkspace'
import PurrsWorkspace from '../../workspaces/PurrsWorkspace/PurrsWorkspace'
import NetworkWorkspace from '../../workspaces/NetworkWorkspace/NetworkWorkspace'

import PurrerFactoryInterface from '../../contractInterfaces/PurrerFactoryInterface'

export const WorkspaceLayer = () => {
  const { activeWorkspace, setActiveWorkspace, getWorkspaceIndex } = useContext(NavigationContext)
  const purrerFactory = new PurrerFactoryInterface()
  
  useEffect(() => {
    purrerFactory.isPurrer()
      .then(result => setActiveWorkspace(result > 0 ? getWorkspaceIndex('PURRS') : getWorkspaceIndex('JOIN')))
  }, [])

  return (
    <div id='WorkspaceLayer'>
      {activeWorkspace === getWorkspaceIndex('JOIN') && <JoinWorkspace/>}
      {activeWorkspace === getWorkspaceIndex('PURRER') && <PurrerWorkspace/>}
      {activeWorkspace === getWorkspaceIndex('LOOT') && <LootWorkspace/>}
      {activeWorkspace === getWorkspaceIndex('PURRS') && <PurrsWorkspace/>}
      {activeWorkspace === getWorkspaceIndex('NETWORK') && <NetworkWorkspace/>}
    </div>
  )
}

export default WorkspaceLayer