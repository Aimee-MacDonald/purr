import React, { createContext, useState } from 'react'

export default ({ children }) => {
  const [ activeWorkspace, setActiveWorkspace ] = useState(0)
  const workspaceOptions = [
    'JOIN',
    'PURRS',
    'NETWORK'
  ]

  const getWorkspaceIndex = workspaceName => workspaceOptions.indexOf(workspaceName)

  const navigation = {
    activeWorkspace: activeWorkspace,
    setActiveWorkspace: setActiveWorkspace,
    getWorkspaceIndex: getWorkspaceIndex
  }

  return(
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  )
}

const NavigationContext = createContext(null)
export { NavigationContext }