import PurrNFT from '../artifacts/src/blockchain/contracts/PurrNFT.sol/PurrNFT.json'

import BaseInterface from './BaseInterface'

export default class PurrNFTInterface extends BaseInterface {
  constructor() {
    super('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', PurrNFT.abi)
  }

  async mint(to, message, value) {
    if(super.ethCheck) {
      const contract = await super.getContract(true)
      return contract.mint(to, message, value)
    }
  }

  async getAllMintData(purrerAddress) {
    if(super.ethCheck) {
      let contract
      
      return super.getContract(true)
        .then(c => contract = c)
        .then(() => contract.balanceOf(purrerAddress))
        .then(nftCount => nftCount.toString())
        .then(async nftCount => {
          let allMintData = []

          for(var i = 0; i < nftCount; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(purrerAddress, i)
            const mintData = await contract.getMintData(tokenId)
            const tokenURI = await contract.tokenURI(tokenId)
            const response = await fetch(tokenURI)
            const data = await response.json()
            const url = data.external_url

            allMintData.push({
              _id: tokenId,
              imgUrl: url,
              ...mintData
            })
          }

          return allMintData
        })
    }
  }

  async redeem(tokenID) {
    if(super.ethCheck) {
      super.getContract(true)
        .then(contract => contract.redeem(tokenID))
    }
  }

  address() {
    return purrNFTAddress
  }
}