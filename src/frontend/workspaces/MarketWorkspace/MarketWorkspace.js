import React, { useState, useEffect } from 'react'

import './MarketWorkspace.sass'

import MarketInterface from '../../contractInterfaces/MarketInterface'
import PurrerFactoryInterface from '../../contractInterfaces/PurrerFactoryInterface'
import PurrerInterface from '../../contractInterfaces/PurrerInterface'

const MarketWorkspace = () => {
  const [ listings, setListings ] = useState([])
  useEffect(() => checkListings(), [])

  const checkListings = () => {
    const market = new MarketInterface()

    market.getListings()
      .then(_listings => setListings(_listings))
      .catch(error => console.log(`Error: ${error}`))
  }

  const buy = (lootId, lootPrice) => {
    const purrerFactory = new PurrerFactoryInterface()

    purrerFactory.purrerAddress()
      .then(purrerAddress => new PurrerInterface(purrerAddress))
      .then(purrer => purrer.buyLoot(0, 1))
      .then(result => console.log(result))
      .catch(error => console.log(error))
  }

  return (
    <div id='MarketWorkspace'>
      <h1>Market Workspace</h1>
      {listings.map(listing => (
        <div key={listing.index}>
          <p>{listing.index}</p>
          <p>{listing.tokenId.toString()}</p>
          <button onClick={() => buy()}>Buy</button>
        </div>
      ))}
    </div>
  )
}

export default MarketWorkspace