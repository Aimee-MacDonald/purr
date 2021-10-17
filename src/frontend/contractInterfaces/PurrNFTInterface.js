import PurrNFT from '../artifacts/src/blockchain/contracts/PurrNFT.sol/PurrNFT.json'
const purrNFTAddress = '0x0165878A594ca255338adfa4d48449f69242Eb8F'

import BaseInterface from './BaseInterface'

export default class PurrNFTInterface extends BaseInterface {
  constructor() {
    super(purrNFTAddress, PurrNFT.abi)
  }

  async balanceOfCaller() {
    if(super.ethCheck) {
      const contract = await super.getContract(true)

      try {
        return await contract.balanceOfCaller()
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

  async getAllMintData() {
    if(super.ethCheck) {
      const contract = await super.getContract(true)
      const signerAddress = await super.getSignerAddress()

      try {
        const nftCount = await contract.balanceOf(signerAddress) * 1
        let allMintData = []

        for(let i = 0; i < nftCount; i++) {
          const tokenID = await contract.tokenOfOwnerByIndex(signerAddress, i) * 1
          const mintData = await contract.getMintData(tokenID)
          allMintData.push({_id:tokenID, ...mintData})
        }

        return allMintData
      } catch(error) {
        return error
      }
    }

    return []
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