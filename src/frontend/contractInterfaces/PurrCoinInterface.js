import PurrCoin from '../artifacts/src/blockchain/contracts/PurrCoin.sol/PurrCoin.json'

import BaseInterface from './BaseInterface'

export default class PurrCoinInterface extends BaseInterface {
  constructor() {
    super('0x5FC8d32690cc91D4c39d9d3abcBD16989F875707', PurrCoin.abi)
  }

  async balanceOfCaller() {
    if(super.ethCheck) {
      const contract = await super.getContract(true)

      try {
        return await contract.balanceOfCaller() / 10 ** 18
      } catch(error) {
        return error
      }
    }
  }

  async mintAllowanceOfCaller() {
    if(super.ethCheck) {
      const contract = await super.getContract(true)

      try {
        return await contract.mintAllowanceOfCaller() / 10 ** 18
      } catch(error) {
        return error
      }
    }
  }
  
  async addMinter() {
    const contract = await super.getContract(true)

    try {
      return await contract.addMinter()
    } catch(error) {
      return error
    }
  }

  async transfer(to, value) {
    const contract = await super.getContract(true)

    try {
      return await contract.transfer(to, value)
    } catch(error) {
      return error
    }
  }

  async approve(spender, value) {
    const contract = await super.getContract(true)

    try {
      return await contract.approve(spender, value)
    } catch(error) {
      return error
    }
  }
}