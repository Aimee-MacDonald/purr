const { expect } = require('chai')

describe('LootFactory', () => {
  let purrCoin, purrNFT, lootFactory
  let signers, purrer_0, purrer_1

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
    lootFactory = await LootFactory.deploy(loot.address)
    purrCoin = await PurrCoin.deploy(lootFactory.address)
    purrNFT = await PurrNFT.deploy(purrCoin.address)
    const purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, purrCoin.address, purrNFT.address, lootFactory.address)

    await lootFactory.setPurrerFactory(purrerFactory.address)
    await purrCoin.setPurrerFactory(purrerFactory.address)

    await purrerFactory.mint(signers[0].address)
    const purrer_0_address = await purrerFactory.addressOf(signers[0].address)
    purrer_0 = await PurrerImplementation.attach(purrer_0_address)
    
    await purrerFactory.mint(signers[1].address)
    const purrer_1_address = await purrerFactory.addressOf(signers[1].address)
    purrer_1 = await PurrerImplementation.attach(purrer_1_address)
  })

  it('Should mint loot when Purrers balance and allowance both hit zero', async () => {
    await purrer_0.purr(purrer_1.address, 'Message', 1)

    expect(await purrNFT.balanceOf(purrer_1.address)).to.equal(1)
    expect(await purrCoin.balanceOf(purrer_0.address)).to.equal(0)
    expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(0)
    expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(1)
  })

  it('Should reset the Purrer balance and mint allowance', async () => {
    await purrer_0.purr(purrer_1.address, 'Message', 1)

    expect(await purrCoin.balanceOf(purrer_0.address)).to.equal(0)
    expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(0)
    expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(1)

    await purrer_0.consumeLoot(0)

    expect(await purrCoin.balanceOf(purrer_0.address)).to.equal(0)
    expect(await purrCoin.mintAllowanceOf(purrer_0.address)).to.equal(1)
    expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(0)
  })
})