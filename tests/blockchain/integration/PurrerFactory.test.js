const { expect } = require('chai')

describe('PurrerFactory', () => {
  let signers, purrerFactory

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrerImplementation = await ethers.getContractFactory('Purrer')
    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')

    const purrerImplementation = await PurrerImplementation.deploy()
    const purrCoin = await PurrCoin.deploy()
    const purrNFT = await PurrNFT.deploy(purrCoin.address)
    purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, purrCoin.address, purrNFT.address)

    await purrerFactory.mint(signers[0].address)
    await purrerFactory.mint(signers[1].address)

    expect(await purrerFactory.balanceOf(signers[0].address)).to.equal(1)
    expect(await purrerFactory.balanceOf(signers[1].address)).to.equal(1)
  })
  
  describe('Minting', () => {
    it('Should assign a proxy contract address to the Purrer', async () => {
      const purrerProxyAddress_0 = await purrerFactory.addressOf(signers[0].address)
      const purrerProxyAddress_1 = await purrerFactory.addressOf(signers[1].address)

      expect(purrerProxyAddress_0).to.not.equal('0x0000000000000000000000000000000000000000')
      expect(purrerProxyAddress_1).to.not.equal('0x0000000000000000000000000000000000000000')
      expect(purrerProxyAddress_0).to.not.equal(purrerProxyAddress_1)
    })
  })
})