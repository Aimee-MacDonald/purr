import PurrNFT from '../artifacts/src/blockchain/contracts/PurrNFT.sol/PurrNFT.json'

import BaseInterface from './BaseInterface'

export default class PurrNFTInterface extends BaseInterface {
  constructor() {
    super('0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9', PurrNFT.abi)
  }

  async balanceOfCaller() {
    if(super.ethCheck) {
      const contract = await super.getContract(true)

      try {
        return await contract.balanceOfCaller() * 1
      } catch(error) {
        return error
      }
    }
  }

  async mint(to, message, value) {
    if(super.ethCheck) {
      const contract = await super.getContract(true)

      try {
        await contract.mint(to, message, value)
      } catch(error) {
        return error
      }
    }
  }

  async getAllMintData(purrerAddress) {
    if(super.ethCheck) {
      const contract = await super.getContract(true)

      try {
        const nftCount = await contract.balanceOf(purrerAddress) * 1
        let allMintData = []

        for(let i = 0; i < nftCount; i++) {
          const tokenID = await contract.tokenOfOwnerByIndex(purrerAddress, i) * 1
          const mintData = await contract.getMintData(tokenID)
          const tokenURI = await contract.tokenURI(tokenID)
          const res = await fetch(tokenURI)
          const result = await res.json()

          allMintData.push({
            _id:tokenID,
            ...mintData,
            value: mintData.value / 10 ** 18,
            tokenURI: result.external_url
          })
        }

        return allMintData
      } catch(error) {
        return error
      }
    }
  }

  async redeem(tokenID) {
    if(super.ethCheck) {
      const contract = await super.getContract(true)
      
      try {
        return await contract.redeem(tokenID)
      } catch(error) {
        return error
      }
    }
  }

  address() {
    return purrNFTAddress
  }
}