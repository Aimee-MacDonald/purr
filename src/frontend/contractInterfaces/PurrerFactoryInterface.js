import PurrerFactory from '../artifacts/src/blockchain/contracts/PurrerFactory.sol/PurrerFactory.json'

import BaseInterface from './BaseInterface'

export default class PurrerFactoryInterface extends BaseInterface {
  constructor() {
    super('0x349F89Ee1097A6AAEcF026e5f9D2eAbD51611860', PurrerFactory.abi)
  }

  async isPurrer() {
    if(super.ethCheck) {
      const contract = await super.getContract()

      try {
        const balance = await contract.balanceOf(super.getSignerAddress())
        return balance > 0
      } catch(error) {
        throw(error)
      }
    }
  }

  async join() {
    if(super.ethCheck) {
      const contract = await super.getContract(true)

      try {
        contract.join()
      } catch(error) {
        throw(error)
      }
    }
  }

  async purrerAddress() {
    if(super.ethCheck) {
      const contract = await super.getContract(true)

      try {
        return contract.purrerAddress(super.getSignerAddress())
      } catch(error) {
        throw(error)
      }
    }
  }
} 