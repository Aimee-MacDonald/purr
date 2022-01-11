const { expect } = require('chai')

describe('ResetPurrCoin', () => {
  let signers, purrer_0, purrer_1
  let lootFactory, PurrerImplementation, purrCoin

  beforeEach(async () => {
    signers = await ethers.getSigners()
    const LootFactory = await ethers.getContractFactory('LootFactory')
    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    PurrerImplementation = await ethers.getContractFactory('Purrer')
    const Market = await ethers.getContractFactory('Market')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    const ResetPurrCoin = await ethers.getContractFactory('ResetPurrCoin')
    
    lootFactory = await LootFactory.deploy()
    purrCoin = await PurrCoin.deploy(lootFactory.address)
    const purrNFT = await PurrNFT.deploy(purrCoin.address)
    const purrerImplementation = await PurrerImplementation.deploy()
    const market = await Market.deploy(lootFactory.address, purrCoin.address)
    const purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, purrCoin.address, purrNFT.address, lootFactory.address, market.address)
    const resetPurrCoin = await ResetPurrCoin.deploy()

    await purrCoin.setPurrerFactory(purrerFactory.address)
    await purrCoin.setMarket(market.address)
    await lootFactory.setPurrerFactory(purrerFactory.address)

    await lootFactory.addLootType('RESET_PURRCOIN', resetPurrCoin.address)

    purrerFactory.mint(signers[0].address)
    const purrerAddress_0 = purrerFactory.addressOf(signers[0].address)
    purrer_0 = await PurrerImplementation.attach(purrerAddress_0)
    
    purrerFactory.mint(signers[1].address)
    const purrerAddress_1 = purrerFactory.addressOf(signers[1].address)
    purrer_1 = await PurrerImplementation.attach(purrerAddress_1)
  })

  describe('Minting', () => {
    it('Should automatically mint when user balance and mint allowance both reach 0', async () => {
      expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(0)
      
      await purrer_0.purr(purrer_1.address, 'Message', 1)

      expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(1)
    })
  })

  describe('Consumption', () => {
    it('Should reset PurrCoin balance to 0 and mintAllowance to 1', async () => {
      await purrer_0.purr(purrer_1.address, 'Message', 1)
      await purrer_1.connect(signers[1]).purr(purrer_0.address, 'Message', 1)
      await purrer_0.redeemPurr(1)

      expect(await purrCoin.balanceOf(purrer_0.address)).to.equal(1)
      expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(0)

      await purrer_0.consumeLoot(0)

      expect(await purrCoin.balanceOf(purrer_0.address)).to.equal(0)
      expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(1)
    })
  })
})