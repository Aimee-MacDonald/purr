import PurrerFactory from '../artifacts/src/blockchain/contracts/PurrerFactory.sol/PurrerFactory.json'
import BaseInterface from './BaseInterface'

export default class PurrerFactoryInterface extends BaseInterface {
  constructor() {
    super('0x5FC8d32690cc91D4c39d9d3abcBD16989F875707', PurrerFactory.abi)
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
      let contract

      return super.getContract()
        .then(_contract => contract = _contract)
        .then(() => super.getSignerAddress())
        .then(signerAddress => contract.tokenOwnedBy(signerAddress))
        .then(tokenId => contract.tokenURI(tokenId))
        .then(tokenURI => fetch(tokenURI))
        .then(res => res.json())
        .then(result => result.external_url)
    }
  }
}