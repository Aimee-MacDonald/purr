import PurrerFactory from '../artifacts/src/blockchain/contracts/PurrerFactory.sol/PurrerFactory.json'
import BaseInterface from './BaseInterface'

export default class PurrerFactoryInterface extends BaseInterface {
  constructor() {
    super('0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9', PurrerFactory.abi)
  }

  async isPurrer() {
    if(super.ethCheck) {
      const contract = await super.getContract()
      return contract.balanceOf(super.getSignerAddress())
    }
  }

  async join() {
    if(super.ethCheck) {
      const contract = await super.getContract(true)
      return contract.mint(super.getSignerAddress())
    }
  }

  async purrerAddress() {
    if(super.ethCheck) {
      const contract = await super.getContract(true)
      return contract.addressOf(super.getSignerAddress())
    }
  }

  async getImageLink(purrerAddress) {
    if(super.ethCheck) {
      return super.getContract(true)
        .then(contract => ({ contract: contract, purrerId: contract.purrerId(super.getSignerAddress()) }))
        .then(({contract, purrerId}) => contract.tokenURI(purrerId))
        .then(tokenURI => fetch(tokenURI))
        .then(res => res.json())
        .then(result => result.external_url)
        .catch(error => {throw(error)})
    }
  }
}