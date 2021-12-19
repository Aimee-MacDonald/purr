const { expect } = require('chai')

describe('LootFactory', () => {
  let mockLoot, mockPurrer, mockPurrerFactory
  let signers, lootFactory

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockLoot = await ethers.getContractFactory('MockLoot')
    const MockPurrerFactory = await ethers.getContractFactory('MockPurrerFactory')
    const LootFactory = await ethers.getContractFactory('LootFactory')
    const MockPurrer = await ethers.getContractFactory('MockPurrer')

    mockLoot = await MockLoot.deploy()
    mockPurrerFactory = await MockPurrerFactory.deploy()
    lootFactory = await LootFactory.deploy(mockLoot.address)
    mockPurrer = await MockPurrer.deploy()

    await mockPurrerFactory.setPurrer(mockPurrer.address)
    await lootFactory.setPurrerFactory(mockPurrerFactory.address)
  })

  it('Should mint Loot to Purrer', async () => {
    expect(await lootFactory.balanceOf(mockPurrer.address)).to.equal(0)
    
    await lootFactory.mint(mockPurrer.address)
    
    expect(await lootFactory.balanceOf(mockPurrer.address)).to.equal(1)
  })
  
  it('Should not mint loot to non Purrers', () => {
    expect(lootFactory.mint(signers[0].address)).to.be.revertedWith('LootFactory: Only Purrers can recieve Loot')
  })

  it('Should point to a Loot contract', async () => {
    await lootFactory.mint(mockPurrer.address)

    const lootAddress = await lootFactory.addressOf()

    expect(lootAddress).to.equal(mockLoot.address)
  })

  it('Should only set the PurrerFactory once', () => {
    expect(lootFactory.setPurrerFactory(mockPurrerFactory.address)).to.be.revertedWith('LootFactory: PurrerFactory can only be set once')
  })

  it('Should burn the loot', async () => {
    await lootFactory.mint(mockPurrer.address)

    expect(await lootFactory.balanceOf(mockPurrer.address)).to.equal(1)

    await lootFactory.burn(0)
    
    expect(await lootFactory.balanceOf(mockPurrer.address)).to.equal(0)
  })
})