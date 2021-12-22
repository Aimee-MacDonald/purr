import React, { useState, useEffect, useContext } from 'react'

import './PurrerWorkspace.sass'

import PurrerFactoryInterface from '../../contractInterfaces/PurrerFactoryInterface'
import PurrCoinInterface from '../../contractInterfaces/PurrCoinInterface'
import PurrerInterface from '../../contractInterfaces/PurrerInterface'

import { ModalContext } from '../../contexts/Modal'

const PurrerWorkspace = () => {
  const purrerFactory = new PurrerFactoryInterface()
  const purrCoin = new PurrCoinInterface()

  const [ balance, setBalance ] = useState(0)
  const [ mintAllowance, setMintAllowance] = useState(0)
  const [ purrerAddress, setPurrerAddress ] = useState('')

  const { setNotification } = useContext(ModalContext)

  useEffect(() => checkBalances(), [])

  const checkBalances = () => {
    purrerFactory.purrerAddress()
    .then(purrerAddress => {
      setPurrerAddress(purrerAddress)

      purrCoin.balanceOf(purrerAddress)
        .then(balance => setBalance(balance.toString()))
        .catch(error => setNotification(`Error: PurrCoin Balance ${error}`))
        
      purrCoin.mintAllowanceOf(purrerAddress)
        .then(mintAllowance => setMintAllowance(mintAllowance.toString()))
        .catch(error => setNotification(`Error: PurrCoin Mint Allowance ${error}`))
    })
    .catch(error => setNotification(`Error: No Purrer Address ${error}`))
  }

  const purr = e => {
    e.preventDefault()
    
    const purrer = new PurrerInterface(purrerAddress)

    const to = e.target.address.value
    const message = e.target.message.value
    const value = e.target.value.value

    purrer.purr(to, message, value)
      .then(result => {
        setNotification('Minting Purr MicroNFT')

        result.wait()
          .then(result => {
            e.target.address.value = ''
            e.target.message.value = ''
            e.target.value.value = ''
            setNotification('MicroNFT Minted')
            checkBalances()
          })
          .catch(error => setNotification(`Purrer Error: ${error}`))
      })
      .catch(error => setNotification(`Purrer Error: ${error}`))
  }

  return (
    <div id='PurrerWorkspace'>
      <h1>Purrer Image</h1>
      <p>Address: {purrerAddress}</p>
      <p>Balance: {balance}</p>
      <p>Mint Allowance: {mintAllowance}</p>

      <form id='purrForm' onSubmit={purr}>
        <label htmlFor='address'>Address</label>
        <input
          id='address'
          placeholder='address'
          required
        />

        <label htmlFor='message'>Message</label>
        <input
          id='message'
          placeholder='message'
          required
        />

        <label htmlFor='value'>Value</label>
        <input
          id='value'
          placeholder='value'
          required
        />

        <button type='submit'>Send</button>
      </form>
    </div>
  )
}

export default PurrerWorkspace