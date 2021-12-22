import React, { useState, useEffect, useContext } from 'react'

import './LootWorkspace.sass'

import PurrerFactoryInterface from '../../contractInterfaces/PurrerFactoryInterface'
import LootFactoryInterface from '../../contractInterfaces/LootFactoryInterface'
import PurrerInterface from '../../contractInterfaces/PurrerInterface'

import { ModalContext } from '../../contexts/Modal'

const LootWorkspace = () => {
  const purrerFactory = new PurrerFactoryInterface()
  const lootFactory = new LootFactoryInterface()
  const { setNotification } = useContext(ModalContext)

  const [ lootTokens, setLootTokens ] = useState([])

  useEffect(() => checkBalance(), [])

  const checkBalance = () => {
    purrerFactory.purrerAddress()
      .then(purrerAddress => lootFactory.getAllLootData(purrerAddress))
      .then(lootTokens => setLootTokens(lootTokens))
      .catch(error => setNotification(`Loot Error: ${error}`))
  }
  
  const consume = lootId => {
    purrerFactory.purrerAddress()
      .then(purrerAddress => new PurrerInterface(purrerAddress))
      .then(purrer => purrer.consumeLoot())
      .then(success => setNotification(`success`))
      .catch(error => setNotification(`Loot Error: ${error}`))
  }

  return (
    <div id='LootWorkspace'>
      {lootTokens.map(loot => (
        <div key={loot.tokenId}>
          <p>{loot.lootAddress}</p>
          <button onClick={() => consume(loot.tokenId)}>Consume</button>
        </div>
      ))}
    </div>
  )
}

export default LootWorkspace