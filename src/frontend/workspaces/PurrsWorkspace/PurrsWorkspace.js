import React, { useState, useEffect, useContext } from 'react'

import './PurrsWorkspace.sass'

import PurrerFactoryInterface from '../../contractInterfaces/PurrerFactoryInterface'
import PurrNFTInterface from '../../contractInterfaces/PurrNFTInterface'
import PurrerInterface from '../../contractInterfaces/PurrerInterface'

import { ModalContext } from '../../contexts/Modal'

const PurrsWorkspace = () => {
  const purrerFactory = new PurrerFactoryInterface()
  const purrNFT = new PurrNFTInterface()
  const { setNotification } = useContext(ModalContext)

  const [ purrs, setPurrs ] = useState([])

  useEffect(() => {
    purrerFactory.purrerAddress()
      .then(purrerAddress => purrNFT.getAllMintData(purrerAddress))
      .then(allMintData => setPurrs(allMintData))
      .catch(error => setNotification(`PurrNFT Error: ${error}`))
  }, [])

  const redeem = (tokenId) => {
    purrerFactory.purrerAddress()
      .then(purrerAddress => new PurrerInterface(purrerAddress))
      .then(purrer => purrer.redeemPurr(tokenId))
      .then(success => setNotification(`success`))
      .catch(error => setNotification(`PurrNFT Error: ${error}`))
  }

  return (
    <div id='PurrsWorkspace'>
      {purrs.map(purr => (
        <div key={purr._id} className={`Purr${purr.isRedeemed ? ' scorched' : ''}`}>
          <img src={purr.imgUrl}/>
          <p>From: {purr.from}</p>
          <p>Message: {purr.message}</p>
          <p>Value: {purr.value.toString()}</p>
          {!purr.isRedeemed && <button onClick={() => redeem(purr._id)}>Redeem</button>}
        </div>
      ))}
    </div>
  )
}

export default PurrsWorkspace