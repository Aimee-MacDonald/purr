import BaseInterface from './BaseInterface'
import Market from '../artifacts/src/blockchain/contracts/Market.sol/Market.json'

export default class MarketInterface extends BaseInterface {
  constructor() {
    super('0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9', Market.abi)
  }

  getListings() {
    if(super.ethCheck) {
      let market

      return super.getContract()
        .then(_market => market = _market)
        .then(() => market.totalListings())
        .then(async totalListings => {
          let listings = []

          for(let listingIndex = 0; listingIndex < totalListings; listingIndex++) {
            const tokenId = await market.tokenAtIndex(listingIndex)
            const price = await market.priceOf(tokenId)

            listings.push({
              index: listingIndex,
              tokenId,
              price
            })
          }

          return listings
        })
    }
  }
}