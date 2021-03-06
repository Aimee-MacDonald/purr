import Purrer from '../artifacts/src/blockchain/contracts/Purrer.sol/Purrer.json'

import BaseInterface from './BaseInterface'

export default class PurrerInterface extends BaseInterface {
  constructor(purrerAddress) {
    super(purrerAddress, Purrer.abi)
  }

  async purr(to, message, value) {
    if(super.ethCheck) {
      const contract = await super.getContract(true)
      return contract.purr(to, message, value)
    }
  }

  async redeemPurr(tokenId) {
    if(super.ethCheck) {
      const contract = await super.getContract(true)
      return contract.redeemPurr(tokenId)
    }
  }

  consumeLoot(lootId) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.consumeLoot(lootId))
    }
  }

  listLoot(lootId, lootPrice) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.listLootOnMarket(lootId, lootPrice))
    }
  }

  buyLoot(lootId, lootPrice) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => contract.buyLoot(lootId, lootPrice))
    }
  }
}