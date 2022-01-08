const { expect } = require('chai')

describe('Market', () => {
  let market, mockLootFactory

  beforeEach(async () =>{
    const MockLootFactory = await ethers.getContractFactory('MockLootFactory')
    const Market = await ethers.getContractFactory('Market')
    
    mockLootFactory = await MockLootFactory.deploy()
    market = await Market.deploy(mockLootFactory.address)

    await mockLootFactory.setMarketAddress(market.address)
  })

  describe('Listing', () => {
    it('Should add one to totalListings', async () => {
      expect(await market.totalListings()).to.equal(0)
      
      await market.listLoot(0)
      
      expect(await market.totalListings()).to.equal(1)
    })

    it('Should transfer the Loot to Market', async () => {
      expect(await mockLootFactory.transferredToMarket()).to.equal(false)

      await market.listLoot(0)

      expect(await mockLootFactory.transferredToMarket()).to.equal(true)
    })
  })

  describe('Buying', () => {
    it('Should remove one from totalListings', async () => {
      await market.listLoot(0)

      expect(await market.totalListings()).to.equal(1)
      
      await market.buyLoot(0)
      
      expect(await market.totalListings()).to.equal(0)
    })

    it('Should transfer the loot to new owner', async () => {
      await market.listLoot(0)

      expect(await mockLootFactory.transferredFromMarket()).to.equal(false)
      
      await market.buyLoot(0)
      
      expect(await mockLootFactory.transferredFromMarket()).to.equal(true)
    })
  })
})