import React, { useState } from 'react'
import { ethers } from 'ethers'

import './NetworkWorkspace.sass'

const NetworkWorkspace = () => {
  const [ signature, setSignature ] = useState('')

  const signMessage = async e => {
    e.preventDefault()
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    setSignature(await signer.signMessage(e.target.message.value))
  }

  return (
    <div id='NetworkWorkspace'>
      <h1>Network Workspace</h1>

      <form onSubmit={signMessage}>
        <input id='message'></input>
        <button type='submit'>Sign Message</button>
      </form>

      <p>{signature}</p>
    </div>
  )
}

export default NetworkWorkspace