const { expect } = require('chai')

describe('PCLResetBalances', () => {
  let signers, purrer, purrer2, loot
  let purrCoin, purrNFT

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrerImplementaion = await ethers.getContractFactory('Purrer')
    const purrerImplementaion = await PurrerImplementaion.deploy()

    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    purrCoin = await PurrCoin.deploy()

    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    purrNFT = await PurrNFT.deploy(purrCoin.address)

    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    const purrerFactory = await PurrerFactory.deploy(purrerImplementaion.address, purrCoin.address, purrNFT.address)

    await purrerFactory.join()
    purrerAddress = await purrerFactory.purrerAddress(signers[0].address)
    purrer = await PurrerImplementaion.attach(purrerAddress)

    await purrerFactory.connect(signers[1]).join()
    purrerAddress2 = await purrerFactory.purrerAddress(signers[1].address)
    purrer2 = await PurrerImplementaion.attach(purrerAddress2)

    const Loot = await ethers.getContractFactory('PCLResetBalances')
    loot = await Loot.deploy()
  })

  describe('Consumption', () => {
    it('Should set PurrCoin Balance to 0', async () => {
      await purrer2.connect(signers[1]).purr(purrer.address, 'Message', '1000000000000000000')
      await purrer.redeemPurr(0)
      expect(await purrCoin.balanceOf(purrer.address)).to.equal('1000000000000000000')

      await purrer.consumeLoot(loot.address)

      expect(await purrCoin.balanceOf(purrer.address)).to.equal(0)
    })

    it('Should set PurrCoin Mint Allowance to default', async () => {
      await purrer.purr(purrer2.address, 'Message', '1000000000000000000')
      expect(await purrCoin.mintAllowanceOf(purrer.address)).to.equal(0)

      await purrer.consumeLoot(loot.address)

      expect(await purrCoin.mintAllowanceOf(purrer.address)).to.equal('1000000000000000000')
    })
    
    // Should inherit from a base PurrCoin-Loot contract
    // Only the purrer that owns this upgrade token can consume it
    // Upgrade tokens should be minted programmatically when the right conditions are met
    // Only a centralised authority should be able to mint upgrade tokens
  })
})