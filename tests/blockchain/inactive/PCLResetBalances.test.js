const { expect } = require('chai')

describe('PCLResetBalances', () => {
  let signers, purrer, purrer2, loot
  let purrCoin, purrNFT, purrerFactory, lootFactory

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrerImplementaion = await ethers.getContractFactory('Purrer')
    const purrerImplementaion = await PurrerImplementaion.deploy()

    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    purrCoin = await PurrCoin.deploy()

    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    purrNFT = await PurrNFT.deploy(purrCoin.address)

    const Loot = await ethers.getContractFactory('PCLResetBalances')
    loot = await Loot.deploy()
    
    const LootFactory = await ethers.getContractFactory('LootFactory')
    lootFactory = await LootFactory.deploy(loot.address)
    
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    purrerFactory = await PurrerFactory.deploy(purrerImplementaion.address, purrCoin.address, purrNFT.address, lootFactory.address)
    
    await lootFactory.setPurrerFactoryAddress(purrerFactory.address)
    
    await purrerFactory.join()
    purrerAddress = await purrerFactory.purrerAddress(signers[0].address)
    purrer = await PurrerImplementaion.attach(purrerAddress)

    await purrerFactory.connect(signers[1]).join()
    purrerAddress2 = await purrerFactory.purrerAddress(signers[1].address)
    purrer2 = await PurrerImplementaion.attach(purrerAddress2)
  })

  describe('Consumption', () => {
    it('Should set PurrCoin Balance to 0', async () => {
      await purrer2.connect(signers[1]).purr(purrer.address, 'Message', '1000000000000000000')
      await purrer.redeemPurr(0)
      expect(await purrCoin.balanceOf(purrer.address)).to.equal('1000000000000000000')
      await purrerFactory.mintLoot(purrer.address)

      await purrer.consumeLoot(0)

      expect(await purrCoin.balanceOf(purrer.address)).to.equal(0)
    })

    it('Should set PurrCoin Mint Allowance to default', async () => {
      await purrer.purr(purrer2.address, 'Message', '1000000000000000000')
      expect(await purrCoin.mintAllowanceOf(purrer.address)).to.equal(0)
      await purrerFactory.mintLoot(purrer.address)

      await purrer.consumeLoot(0)

      expect(await purrCoin.mintAllowanceOf(purrer.address)).to.equal('1000000000000000000')
    })
  })
})