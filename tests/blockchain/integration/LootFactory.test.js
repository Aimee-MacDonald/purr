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
    const Market = await ethers.getContractFactory('Market')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')

    const purrerImplementation = await PurrerImplementation.deploy()
    const loot = await Loot.deploy()
    lootFactory = await LootFactory.deploy()
    purrCoin = await PurrCoin.deploy(lootFactory.address)
    purrNFT = await PurrNFT.deploy(purrCoin.address)
    const market = await Market.deploy(lootFactory.address, purrCoin.address)
    const purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, purrCoin.address, purrNFT.address, lootFactory.address, market.address)

    await lootFactory.setPurrerFactory(purrerFactory.address)
    await purrCoin.setPurrerFactory(purrerFactory.address)

    await purrerFactory.mint(signers[0].address)
    const purrer_0_address = await purrerFactory.addressOf(signers[0].address)
    purrer_0 = await PurrerImplementation.attach(purrer_0_address)
    
    await purrerFactory.mint(signers[1].address)
    const purrer_1_address = await purrerFactory.addressOf(signers[1].address)
    purrer_1 = await PurrerImplementation.attach(purrer_1_address)
  })

  it('Should mint loot', async () => {
    expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(0)

    await lootFactory.mint(purrer_0.address, 0)
    
    expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(1)
  })
  
  it('Should burn the token when consumed', async () => {
    await lootFactory.mint(purrer_0.address, 0)
    expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(1)
    
    await purrer_0.consumeLoot(0)
    
    expect(await lootFactory.balanceOf(purrer_0.address)).to.equal(0)
  })
})