const { expect } = require('chai')

describe('Purrer', () => {
  let signers, purrer_0, purrer_1
  let purrCoin, purrNFT, lootFactory

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrerImplementation = await ethers.getContractFactory('Purrer')
    const Loot = await ethers.getContractFactory('Loot')
    const LootFactory = await ethers.getContractFactory('LootFactory')
    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')

    const purrerImplementation = await PurrerImplementation.deploy()
    const loot = await Loot.deploy()
    lootFactory = await LootFactory.deploy()
    purrCoin = await PurrCoin.deploy(lootFactory.address)
    purrNFT = await PurrNFT.deploy(purrCoin.address)
    const purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, purrCoin.address, purrNFT.address, lootFactory.address)

    await lootFactory.setPurrerFactory(purrerFactory.address)
    await purrCoin.setPurrerFactory(purrerFactory.address)

    await purrerFactory.mint(signers[0].address)
    const purrerAddress_0 = await purrerFactory.addressOf(signers[0].address)
    purrer_0 = await PurrerImplementation.attach(purrerAddress_0)

    await purrerFactory.mint(signers[1].address)
    const purrerAddress_1 = await purrerFactory.addressOf(signers[1].address)
    purrer_1 = await PurrerImplementation.attach(purrerAddress_1)
  })

  describe('PurrCoin balances', () => {
    it('Should have a PurrCoin balance of 0', async () => {
      expect(await purrCoin.balanceOf(purrer_0.address)).to.equal(0)
    })
    
    it('Should have a PurrCoin mint allowance of 1', async () => {
      expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(1)
    })
  })

  describe('Purring', () => {
    it('Should mint a PurrNFT', async () => {
      expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(1)
      expect(await purrNFT.balanceOf(purrer_1.address)).to.equal(0)

      await purrer_0.purr(purrer_1.address, 'Message', 1)
      
      expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(0)
      expect(await purrNFT.balanceOf(purrer_1.address)).to.equal(1)
    })
    
    it('Should redeem a PurrNFT', async () => {
      await purrer_0.purr(purrer_1.address, 'Message', 1)
      expect(await purrNFT.balanceOf(purrer_1.address)).to.equal(1)
      
      await purrer_1.redeemPurr(0)
      
      expect(await purrCoin.balanceOf(purrer_1.address)).to.equal(1)
    })
  })

  describe('Loot', () => {
    it('Should recieve loot', async () => {
      await purrer_0.purr(purrer_1.address, 'Message', 1)

      expect(await purrCoin.balanceOf(purrer_0.address)).to.equal(0)
      expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(0)
      expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(1)
    })

    it('Should burn loot on consumption', async () => {
      await purrer_0.purr(purrer_1.address, 'Message', 1)
      expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(1)

      await purrer_0.consumeLoot(0)

      expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(0)
    })
  })
})