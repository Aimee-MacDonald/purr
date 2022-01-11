const { expect } = require('chai')

describe('Market', () => {
  let signers
  let market, mockLootFactory, mockPurrCoin

  beforeEach(async () => {
    signers = await ethers.getSigners()
    const MockLootFactory = await ethers.getContractFactory('MockLootFactory')
    const MockPurrCoin = await ethers.getContractFactory('MockPurrCoin')
    const Market = await ethers.getContractFactory('Market')
    
    mockLootFactory = await MockLootFactory.deploy()
    mockPurrCoin = await MockPurrCoin.deploy()
    market = await Market.deploy(mockLootFactory.address, mockPurrCoin.address)

    await mockLootFactory.setMarketAddress(market.address)
  })

  describe('Listing', () => {
    it('Should add one to totalListings', async () => {
      expect(await market.totalListings()).to.equal(0)
      
      await market.listLoot(0, 1)
      
      expect(await market.totalListings()).to.equal(1)
    })

    it('Should transfer the Loot to Market', async () => {
      expect(await mockLootFactory.transferredToMarket()).to.equal(false)

      await market.listLoot(0, 1)

      expect(await mockLootFactory.transferredToMarket()).to.equal(true)
    })

    it('Should return a price for the listing', async () => {
      expect(await market.priceOf(0)).to.equal(0)

      await market.listLoot(0, 1)

      expect(await market.priceOf(0)).to.equal(1)
    })

    it('Should return the owner of the listing', async () => {
      expect(await market.ownerOf(0)).to.equal('0x0000000000000000000000000000000000000000')

      await market.listLoot(0, 1)

      expect(await market.ownerOf(0)).to.equal(signers[0].address)
    })
  })

  describe('Buying', () => {
    it('Should remove one from totalListings', async () => {
      await market.listLoot(0, 1)

      expect(await market.totalListings()).to.equal(1)
      
      await market.buyLoot(0)
      
      expect(await market.totalListings()).to.equal(0)
    })

    it('Should transfer the loot to new owner', async () => {
      await market.listLoot(0, 1)
      
      expect(await mockLootFactory.transferredFromMarket()).to.equal(false)
      
      await market.buyLoot(0)
      
      expect(await mockLootFactory.transferredFromMarket()).to.equal(true)
    })
    
    it('Should transfer PurrCoin from buyer to seller', async () => {
      await market.listLoot(0, 1)
      
      expect(await mockPurrCoin.transferred()).to.equal(false)
      
      await market.buyLoot(0)
      
      expect(await mockPurrCoin.transferred()).to.equal(true)
    })
  })
})