import React from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
import './main.sass'

import NavigationProvider from './contexts/Navigation'
import ModalProvider from './contexts/Modal'

import WorkspaceLayer from './layers/WorkspaceLayer/WorkspaceLayer'
import NavigationLayer from './layers/NavigationLayer/NavigationLayer'
import ModalLayer from './layers/ModalLayer/ModalLayer'

const Main = () => (
  <div id='Main'>
    <ModalProvider>
      <NavigationProvider>
        <WorkspaceLayer/>
        <NavigationLayer/>
        <ModalLayer/>
      </NavigationProvider>
    </ModalProvider>
  </div>
)

ReactDOM.render(<Main/>, document.getElementById('root'))