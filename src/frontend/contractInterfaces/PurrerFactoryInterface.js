import PurrerFactory from '../artifacts/src/blockchain/contracts/PurrerFactory.sol/PurrerFactory.json'

import BaseInterface from './BaseInterface'

export default class PurrerFactoryInterface extends BaseInterface {
  constructor() {
    super('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', PurrerFactory.abi)
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
} 