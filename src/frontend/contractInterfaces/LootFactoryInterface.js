import BaseInterface from './BaseInterface'
import LootFactory from '../artifacts/src/blockchain/contracts/LootFactory.sol/LootFactory.json'

export default class LootFactoryInterface extends BaseInterface {
  constructor() {
    super('0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', LootFactory.abi)
  }

  getAllLootData(purrerAddress) {
    if(super.ethCheck) {
      let contract

      return super.getContract()
        .then(c => contract = c)
        .then(() => contract.balanceOf(purrerAddress))
        .then(nftCount => nftCount.toString())
        .then(async nftCount => {
          let allLootData = []

          for(var i = 0; i < nftCount; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(purrerAddress, i)
            const lootAddress = await contract.addressOf()

            allLootData.push({tokenId, lootAddress})
          }

          return allLootData
        })
    }
  }
}