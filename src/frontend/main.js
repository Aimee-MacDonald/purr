import React from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
import './main.sass'

import PurrInteraction from './components/PurrInteraction'

const Main = () => (
  <div id='Main'>
    <PurrInteraction/>
  </div>
)

ReactDOM.render(<Main/>, document.getElementById('root'))