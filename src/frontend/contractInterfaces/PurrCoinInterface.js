import PurrCoin from '../artifacts/src/blockchain/contracts/PurrCoin.sol/PurrCoin.json'

import BaseInterface from './BaseInterface'

export default class PurrCoinInterface extends BaseInterface {
  constructor() {
    super('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', PurrCoin.abi)
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