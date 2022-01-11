const { expect } = require('chai')

describe('Market', () => {
  let signers, purrer_0, purrer_1
  let market, lootFactory, purrCoin

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrerImplementation = await ethers.getContractFactory('Purrer')
    const LootFactory = await ethers.getContractFactory('LootFactory')
    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    const Market = await ethers.getContractFactory('Market')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')

    const purrerImplementation = await PurrerImplementation.deploy()
    lootFactory = await LootFactory.deploy()
    purrCoin = await PurrCoin.deploy(lootFactory.address)
    const purrNFT = await PurrNFT.deploy(purrCoin.address)
    market = await Market.deploy(lootFactory.address, purrCoin.address)
    const purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, purrCoin.address, purrNFT.address, lootFactory.address, market.address)

    await purrCoin.setPurrerFactory(purrerFactory.address)
    await purrCoin.setMarket(market.address)
    await lootFactory.setPurrerFactory(purrerFactory.address)

    await purrerFactory.mint(signers[0].address)
    const purrerAddress_0 = await purrerFactory.addressOf(signers[0].address)
    purrer_0 = await PurrerImplementation.attach(purrerAddress_0)

    await purrerFactory.mint(signers[1].address)
    const purrerAddress_1 = await purrerFactory.addressOf(signers[1].address)
    purrer_1 = await PurrerImplementation.attach(purrerAddress_1)
  })

  describe('Listing', () => {
    it('Should list a new Loot item for sale', async () => {
      await purrer_0.purr(purrer_1.address, 'Message', 1)
      
      expect(await market.totalListings()).to.equal(0)
      expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(1)
      
      await purrer_0.listLootOnMarket(0, 1)
      
      expect(await market.totalListings()).to.equal(1)
      expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(0)
    })
  })
  
  describe('Buying', () => {
    it('Should buy a Loot item from Market', async () => {
      await purrer_1.connect(signers[1]).purr(purrer_0.address, 'Message', 1)
      await purrer_0.redeemPurr(0)
      await purrer_1.listLootOnMarket(0, 1)

      expect(await purrCoin.balanceOf(purrer_0.address)).to.equal(1)
      expect(await purrCoin.balanceOf(purrer_1.address)).to.equal(0)
      expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(1)
      expect(await market.totalListings()).to.equal(1)
      
      await purrer_0.buyLoot(0, 1)
      
      expect(await purrCoin.balanceOf(purrer_0.address)).to.equal(0)
      expect(await purrCoin.balanceOf(purrer_1.address)).to.equal(1)
      expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(1)
      expect(await market.totalListings()).to.equal(0)
    })
  })
})