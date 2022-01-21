import React, { useState, useEffect } from 'react'

import './LootWorkspace.sass'

import LootFactoryInterface from '../../contractInterfaces/LootFactoryInterface'
import PurrerFactoryInterface from '../../contractInterfaces/PurrerFactoryInterface'
import PurrerInterface from '../../contractInterfaces/PurrerInterface'

const LootWorkspace = () => {
  const [ lootTokens, setLootTokens ] = useState([])
  const [ creatingListing, setCreatingListing ] = useState(false)

  useEffect(() => getLootList(), [])

  const getLootList = () => {
    const lootFactory = new LootFactoryInterface()
    const purrerFactory = new PurrerFactoryInterface()

    purrerFactory.purrerAddress()
      .then(purrerAddress => lootFactory.lootList(purrerAddress))
      .then(lootList => setLootTokens(lootList))
      .catch(error => console.log(error))
  }

  const consumeLoot = lootId => {
    const purrerFactory = new PurrerFactoryInterface()

    return purrerFactory.purrerAddress()
      .then(purrerAddress => new PurrerInterface(purrerAddress))
      .then(purrer => purrer.consumeLoot(lootId))
  }

  const listOnMarket = (e, lootId) => {
    e.preventDefault()

    const lootPrice = e.target.lootPrice.value

    if(lootPrice > 0) {
      const purrerFactory = new PurrerFactoryInterface()

      purrerFactory.purrerAddress()
        .then(purrerAddress => new PurrerInterface(purrerAddress))
        .then(purrer => purrer.listLoot(lootId, lootPrice))
        .then(result => console.log(`Result: ${result}`))
        .catch(error => console.log(`Error: ${error}`))
    }
  }

  return (
    <div id='LootWorkspace'>
      {lootTokens.map(lootToken => (
        <div key={`LT${lootToken.id}`}>
          <h3>{lootToken.name}</h3>
          <p>{lootToken.implementation}</p>
          <p>{lootToken.id.toString()}</p>
          
          {creatingListing &&
            <form onSubmit={e => listOnMarket(e, lootToken.id)}>
              <input id='lootPrice'/>
              <button type='submit'>Add Listing</button>
              <button type='button' onClick={() => setCreatingListing(false)}>Cancel</button>
            </form>
          }

          {!creatingListing && <button onClick={() => consumeLoot(lootToken.id)}>Consume</button>}
          {!creatingListing && <button onClick={() => setCreatingListing(true)}>List on Market</button>}
        </div>
      ))}
    </div>
  )
}

export default LootWorkspace