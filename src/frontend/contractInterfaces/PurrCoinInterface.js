import PurrCoin from '../artifacts/src/blockchain/contracts/PurrCoin.sol/PurrCoin.json'

import BaseInterface from './BaseInterface'

export default class PurrCoinInterface extends BaseInterface {
  constructor() {
    super('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', PurrCoin.abi)
  }

  async balanceOf(purrerAddress) {
    if(super.ethCheck) {
      const contract = await super.getContract(true)
      return contract.balanceOf(purrerAddress)
    }
  }

  async mintAllowanceOf(purrerAddress) {
    if(super.ethCheck) {
      const contract = await super.getContract(true)
      return contract.mintAllowanceOf(purrerAddress)
    }
  }
  /* 
  async addMinter() {
    const contract = await super.getContract(true)

    try {
      return await contract.addMinter()
    } catch(error) {
      return error
    }
  }
 */
  async transfer(to, value) {
    const contract = await super.getContract(true)
    return contract.transfer(to, value)
  }

  async approve(spender, value) {
    const contract = await super.getContract(true)
    return contract.approve(spender, value)
  }
}