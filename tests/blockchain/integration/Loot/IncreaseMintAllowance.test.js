const { expect } = require('chai')

describe('IncreaseMintAllowance', () => {
  let signers, purrer_0, purrer_1, purrer_2, purrer_3, purrer_4, purrer_5
  let purrCoin, lootFactory

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    const LootFactory = await ethers.getContractFactory('LootFactory')
    const PurrerImplementation = await ethers.getContractFactory('Purrer')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    const Market = await ethers.getContractFactory('Market')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    const ResetPurrCoin = await ethers.getContractFactory('ResetPurrCoin')
    const IncreaseMintAllowance = await ethers.getContractFactory('IncreaseMintAllowance')

    lootFactory = await LootFactory.deploy()
    purrCoin = await PurrCoin.deploy(lootFactory.address)
    const purrerImplementation = await PurrerImplementation.deploy()
    const purrNFT = await PurrNFT.deploy(purrCoin.address)
    const market = await Market.deploy(lootFactory.address, purrCoin.address)
    const purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, purrCoin.address, purrNFT.address, lootFactory.address, market.address)
    const resetPurrCoin = await ResetPurrCoin.deploy()
    const increaseMintAllowance = await IncreaseMintAllowance.deploy()

    await purrCoin.setPurrerFactory(purrerFactory.address)
    await purrCoin.setMarket(market.address)
    await lootFactory.setPurrerFactory(purrerFactory.address)

    await lootFactory.addLootType('RESET_PURRCOIN', resetPurrCoin.address)
    await lootFactory.addLootType('INCREASE_MINT_ALLOWANCE', increaseMintAllowance.address)

    await purrerFactory.mint(signers[0].address)
    const purrerAddress_0 = await purrerFactory.addressOf(signers[0].address)
    purrer_0 = await PurrerImplementation.attach(purrerAddress_0)

    await purrerFactory.mint(signers[1].address)
    const purrerAddress_1 = await purrerFactory.addressOf(signers[1].address)
    purrer_1 = await PurrerImplementation.attach(purrerAddress_1)

    await purrerFactory.mint(signers[2].address)
    const purrerAddress_2 = await purrerFactory.addressOf(signers[2].address)
    purrer_2 = await PurrerImplementation.attach(purrerAddress_2)

    await purrerFactory.mint(signers[3].address)
    const purrerAddress_3 = await purrerFactory.addressOf(signers[3].address)
    purrer_3 = await PurrerImplementation.attach(purrerAddress_3)

    await purrerFactory.mint(signers[4].address)
    const purrerAddress_4 = await purrerFactory.addressOf(signers[4].address)
    purrer_4 = await PurrerImplementation.attach(purrerAddress_4)

    await purrerFactory.mint(signers[5].address)
    const purrerAddress_5 = await purrerFactory.addressOf(signers[5].address)
    purrer_5 = await PurrerImplementation.attach(purrerAddress_5)
  })

  describe('Minting', () => {
    it('Should automatically mint when user total recieved reaches 5', async () => {
      expect(await purrCoin.totalRecievedBy(purrer_0.address)).to.equal(0)
  
      await purrer_1.connect(signers[1]).purr(purrer_0.address, 'Message', 1)
      await purrer_2.connect(signers[2]).purr(purrer_0.address, 'Message', 1)
      await purrer_3.connect(signers[3]).purr(purrer_0.address, 'Message', 1)
      await purrer_4.connect(signers[4]).purr(purrer_0.address, 'Message', 1)
      await purrer_5.connect(signers[5]).purr(purrer_0.address, 'Message', 1)
  
      await purrer_0.redeemPurr(0)
      await purrer_0.redeemPurr(1)
      await purrer_0.redeemPurr(2)
      await purrer_0.redeemPurr(3)
      await purrer_0.redeemPurr(4)
      
      expect(await purrCoin.totalRecievedBy(purrer_0.address)).to.equal(5)
      expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(1)
    })
  })
  
  describe('Consumption', () => {
    it('Should set maxMintAllowance to 5', async () => {
      await purrer_1.connect(signers[1]).purr(purrer_0.address, 'Message', 1)
      await purrer_2.connect(signers[2]).purr(purrer_0.address, 'Message', 1)
      await purrer_3.connect(signers[3]).purr(purrer_0.address, 'Message', 1)
      await purrer_4.connect(signers[4]).purr(purrer_0.address, 'Message', 1)
      await purrer_5.connect(signers[5]).purr(purrer_0.address, 'Message', 1)
  
      await purrer_0.redeemPurr(0)
      await purrer_0.redeemPurr(1)
      await purrer_0.redeemPurr(2)
      await purrer_0.redeemPurr(3)
      await purrer_0.redeemPurr(4)

      expect(await purrCoin.maxMintAllowanceOf(purrer_0.address)).to.equal(1)
      expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(1)

      await purrer_0.consumeLoot(5)

      expect(await purrCoin.maxMintAllowanceOf(purrer_0.address)).to.equal(5)
      expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(5)
      expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(0)
    })
  })
})