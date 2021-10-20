import PurrCoin from '../artifacts/src/blockchain/contracts/PurrCoin.sol/PurrCoin.json'

import BaseInterface from './BaseInterface'

export default class PurrCoinInterface extends BaseInterface {
  constructor() {
    super('0x5FbDB2315678afecb367f032d93F642f64180aa3', PurrCoin.abi)
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