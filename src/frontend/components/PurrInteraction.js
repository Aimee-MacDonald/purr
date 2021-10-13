import React, { useState, useEffect } from 'react'

import PurrCoinInterface from '../contractInterfaces/PurrCoinInterface'

export const PurrInteraction = () => {
  const purrCoin = new PurrCoinInterface()
  const [ mintAllowance, setMintAllowance ] = useState(0)
  const [ balance, setBalance ] = useState(0)
  
  useEffect(() => {
    purrCoin.mintAllowanceOfCaller()
      .then(result => setMintAllowance(result))
      .catch(error => console.log(error))

    purrCoin.balanceOfCaller()
      .then(result => setBalance(result))
      .catch(error => console.log(error))
  }, [])
  
  return (
    <div>
      <h1>{`Allowance: ${mintAllowance}`}</h1>
      <h1>{`Balance: ${balance}`}</h1>
      <button>Join</button>
    </div>
  )
}

export default PurrInteraction






















/*
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
import './main.sass'

import PurrCoinInterface from './contractInterfaces/PurrCoinInterface'

const Main = () => {
  const PurrCoin = new PurrCoinInterface()
  const [ mintAllowance, setMintAllowance ] = useState(20)
  const [ balance, setBalance ] = useState(20)

  useEffect(() => {
    PurrCoin.balanceOfCaller()
      .then(result => setBalance(result))
      .catch(error => console.log(error))

    PurrCoin.mintAllowanceOfCaller()
      .then(result => setMintAllowance(result))
      .catch(error => console.log(error))
  }, [])

  const sendPurr = e => {
    e.preventDefault()
    PurrCoin.transfer(parseInt(e.target.address.value) ** 18, e.target.amount.value)
      .catch(error => console.log(error))
  }

  return (
    <div id='Main'>
      <p>{`Mint Allowance: ${mintAllowance}`}</p>
      <p>{`Balance: ${balance}`}</p>
      <button onClick={() => PurrCoin.addMinter()}>Join</button>

      <form onSubmit={sendPurr}>
        <input
          placeholder='Address'
          id='address'
        />

        <input
          placeholder='Amount'
          id='amount'
        />

        <input placeholder='Message'/>
        <button type='submit'>Send</button>
      </form>

      <ul>
        <li>Connect wallet</li>
        <li>View remaining allowance</li>
        <li>View balance</li>
        <li>Transfer purrs</li>
        <li>Attach a message with transfers</li>
      </ul>
    </div>
  )
}

ReactDOM.render(<Main/>, document.getElementById('root'))
*/