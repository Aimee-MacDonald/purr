import PurrCoin from '../artifacts/src/blockchain/contracts/PurrCoin.sol/PurrCoin.json'

import BaseInterface from './BaseInterface'

export default class PurrCoinInterface extends BaseInterface {
  constructor() {
    super('0x91bF920DcA7107BA9aF63508c0f272D0b68E6A6A', PurrCoin.abi)
  }

  async balanceOf(purrerAddress) {
    if(super.ethCheck) {
      const contract = await super.getContract(true)

      try {
        return await contract.balanceOf(purrerAddress) / 10 ** 18
      } catch(error) {
        return error
      }
    }
  }

  async mintAllowanceOf(purrerAddress) {
    if(super.ethCheck) {
      const contract = await super.getContract(true)

      try {
        return await contract.mintAllowanceOf(purrerAddress) / 10 ** 18
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