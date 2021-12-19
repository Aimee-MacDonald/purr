const { expect } = require('chai')

describe('PurrerFactory', () => {
  let signers, purrerFactory

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrerImplementation = await ethers.getContractFactory('Purrer')
    const Loot = await ethers.getContractFactory('Loot')
    const LootFactory = await ethers.getContractFactory('LootFactory')
    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')

    const purrerImplementation = await PurrerImplementation.deploy()
    const loot = await Loot.deploy()
    const lootFactory = await LootFactory.deploy(loot.address)
    const purrCoin = await PurrCoin.deploy(lootFactory.address)
    const purrNFT = await PurrNFT.deploy(purrCoin.address)
    purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, purrCoin.address, purrNFT.address, lootFactory.address)

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