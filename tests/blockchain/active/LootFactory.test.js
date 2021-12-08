const { expect } = require('chai')

describe('LootFactory', () => {
  let signers, purrer, purrer2
  let purrerFactory, lootFactory, loot

  beforeEach(async () => {
    const PurrerImplementation = await ethers.getContractFactory('Purrer')
    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    const LootFactory = await ethers.getContractFactory('LootFactory')
    const Loot = await ethers.getContractFactory('PCLResetBalances')
    
    const purrerImplementation = await PurrerImplementation.deploy()
    const purrCoin = await PurrCoin.deploy()
    const purrNFT = await PurrNFT.deploy(purrCoin.address)
    loot = await Loot.deploy()
    lootFactory = await LootFactory.deploy(loot.address)
    purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, purrCoin.address, purrNFT.address, lootFactory.address)
    lootFactory.setPurrerFactoryAddress(purrerFactory.address)

    signers = await ethers.getSigners()

    await purrerFactory.join()
    await purrerFactory.connect(signers[1]).join()

    const purrerAddress = await purrerFactory.purrerAddress(signers[0].address)
    const purrerAddress2 = await purrerFactory.purrerAddress(signers[1].address)

    purrer = await PurrerImplementation.attach(purrerAddress)
    purrer2 = await PurrerImplementation.attach(purrerAddress2)
  })

  describe('Minting', () => {
    it('Should be minted by PurrerFactory', async () => {
      expect(await lootFactory.balanceOf(purrer.address)).to.equal(0)

      await purrerFactory.mintLoot(purrer.address)

      expect(await lootFactory.balanceOf(purrer.address)).to.equal(1)
    })
    
    it('Should not be minted by non PurrerFactory', async () => {
      expect(lootFactory.mint(purrer.address)).to.be.revertedWith('LootFactory: Only PurrerFactory can mint')
    })

    it('Should not be minted to non Purrers', () => {
      expect(purrerFactory.mintLoot(signers[0].address)).to.be.revertedWith('LootFactory: Purrers only')
    })

    it('Should point to a Loot contract', async () => {
      await purrerFactory.mintLoot(purrer.address)

      expect(await lootFactory.balanceOf(purrer.address)).to.equal(1)
      expect(await lootFactory.addressOf(0)).to.equal(loot.address)
    })
  })

  describe('Transactions', () => {
    it('Should be transferable between Purrers', async () => {
      await purrerFactory.mintLoot(purrer.address)
      expect(await lootFactory.balanceOf(purrer.address)).to.equal(1)
      expect(await lootFactory.balanceOf(purrer2.address)).to.equal(0)

      await lootFactory.transfer(purrer.address, purrer2.address, 0)

      expect(await lootFactory.balanceOf(purrer.address)).to.equal(0)
      expect(await lootFactory.balanceOf(purrer2.address)).to.equal(1)
    })

    it('Should not be transferable to non Purrers', async () => {
      await purrerFactory.mintLoot(purrer.address)
      expect(await lootFactory.balanceOf(purrer.address)).to.equal(1)

      expect(lootFactory.transfer(purrer.address, signers[0].address, 0)).to.be.revertedWith('LootFactory: Purrers only')
    })
  })

  describe('Consumption', () => {
    it('Should be burned after use', async () => {
      await purrerFactory.mintLoot(purrer.address)
      expect(await lootFactory.balanceOf(purrer.address)).to.equal(1)

      await purrer.consumeLoot(0)

      expect(await lootFactory.balanceOf(purrer.address)).to.equal(0)
    })
  })
})