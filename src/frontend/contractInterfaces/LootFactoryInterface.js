import BaseInterface from './BaseInterface'
import LootFactory from '../artifacts/src/blockchain/contracts/LootFactory.sol/LootFactory.json'

export default class LootFactoryInterface extends BaseInterface {
  constructor() {
    super('0x5FbDB2315678afecb367f032d93F642f64180aa3', LootFactory.abi)
  }

  lootList(purrerAddress) {
    if(super.ethCheck) {
      let contract

      return super.getContract()
        .then(c => contract = c)
        .then(() => contract.balanceOf(purrerAddress))
        .then(async lootCount => {
          let lootListData = []

          for(let i = 0; i < lootCount; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(purrerAddress, i)
            const lootDetails = await contract.detailsOf(tokenId)
            lootListData.push({
              id: tokenId,
              name: lootDetails.name,
              implementation: lootDetails.implementation
            })
          }

          return lootListData
        })
    }
  }

  detailsOf(tokenId) {
    return super.getContract()
      .then(market => market.detailsOf(tokenId))
  }
}