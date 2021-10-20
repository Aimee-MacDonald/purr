import React from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
import './main.sass'

import NavigationProvider from './contexts/Navigation'

import WorkspaceLayer from './layers/WorkspaceLayer/WorkspaceLayer'
import NavigationLayer from './layers/NavigationLayer/NavigationLayer'

const Main = () => (
  <div id='Main'>
    <NavigationProvider>
      <WorkspaceLayer/>
      <NavigationLayer/>
    </NavigationProvider>
  </div>
)

ReactDOM.render(<Main/>, document.getElementById('root'))