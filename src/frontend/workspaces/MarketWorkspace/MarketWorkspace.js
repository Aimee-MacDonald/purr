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
      .then(purrer => purrer.buyLoot(lootId, lootPrice))
      .then(result => console.log(result))
      .catch(error => console.log(error))
  }

  return (
    <div id='MarketWorkspace'>
      {listings.map(listing => (
        <div key={listing.index}>
          <p>{`Listing Index: ${listing.index}`}</p>
          <p>{`Token ID: ${listing.tokenId.toString()}`}</p>
          <p>{`Listing Price: ${listing.price}`}</p>
          <button onClick={() => buy(listing.tokenId, listing.price)}>Buy</button>  
        </div>
      ))}
    </div>
  )
}

export default MarketWorkspace