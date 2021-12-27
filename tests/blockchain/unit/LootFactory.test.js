const { expect } = require('chai')

describe('LootFactory', () => {
  let mockLoot_0, mockLoot_1, mockPurrer, mockPurrerFactory
  let signers, lootFactory

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const MockLoot = await ethers.getContractFactory('MockLoot')
    const MockPurrerFactory = await ethers.getContractFactory('MockPurrerFactory')
    const LootFactory = await ethers.getContractFactory('LootFactory')
    const MockPurrer = await ethers.getContractFactory('MockPurrer')

    mockLoot_0 = await MockLoot.deploy()
    mockLoot_1 = await MockLoot.deploy()
    mockPurrerFactory = await MockPurrerFactory.deploy()
    lootFactory = await LootFactory.deploy()
    mockPurrer = await MockPurrer.deploy()

    await mockPurrerFactory.setPurrer(mockPurrer.address)
    await lootFactory.setPurrerFactory(mockPurrerFactory.address)
  })

  it('Should add a new Loot Type', async () => {
    let lootDetails_0 = await lootFactory.detailsOf(0)
    expect(lootDetails_0.implementation).to.equal('0x0000000000000000000000000000000000000000')

    await lootFactory.addLootType('IMPLEMENTATION_0', mockLoot_0.address)

    lootDetails_0 = await lootFactory.detailsOf(0)
    expect(lootDetails_0.implementation).to.equal(mockLoot_0.address)
  })

  it('Should mint Loot to Purrer', async () => {
    expect(await lootFactory.balanceOf(mockPurrer.address)).to.equal(0)
    
    await lootFactory.mint(mockPurrer.address, 0)
    
    expect(await lootFactory.balanceOf(mockPurrer.address)).to.equal(1)
  })

  it('Should mint with the correct attributes', async () => {
    await lootFactory.addLootType('IMPLEMENTATION_0', mockLoot_0.address)
    await lootFactory.addLootType('IMPLEMENTATION_1', mockLoot_1.address)

    await lootFactory.mint(mockPurrer.address, 0)
    await lootFactory.mint(mockPurrer.address, 0)
    await lootFactory.mint(mockPurrer.address, 1)
    await lootFactory.mint(mockPurrer.address, 1)
    await lootFactory.mint(mockPurrer.address, 0)

    const lootDetails_0 = await lootFactory.detailsOf(0)
    const lootDetails_1 = await lootFactory.detailsOf(1)
    const lootDetails_2 = await lootFactory.detailsOf(2)
    const lootDetails_3 = await lootFactory.detailsOf(3)
    const lootDetails_4 = await lootFactory.detailsOf(4)

    expect(lootDetails_0.implementation).to.equal(mockLoot_0.address)
    expect(lootDetails_1.implementation).to.equal(mockLoot_0.address)
    expect(lootDetails_2.implementation).to.equal(mockLoot_1.address)
    expect(lootDetails_3.implementation).to.equal(mockLoot_1.address)
    expect(lootDetails_4.implementation).to.equal(mockLoot_0.address)
  })
  
  it('Should not mint loot to non Purrers', () => {
    expect(lootFactory.mint(signers[0].address, 0)).to.be.revertedWith('LootFactory: Only Purrers can recieve Loot')
  })

  it('Should return the Implementation address of a particular Token', async () => {
    expect(await lootFactory.addressOf(0)).to.equal('0x0000000000000000000000000000000000000000')
    
    await lootFactory.addLootType('IMPLEMENTATION_0', mockLoot_0.address)
    await lootFactory.mint(mockPurrer.address, 0)

    expect(await lootFactory.addressOf(0)).to.equal(mockLoot_0.address)
  })

  it('Should only set the PurrerFactory once', () => {
    expect(lootFactory.setPurrerFactory(mockPurrerFactory.address)).to.be.revertedWith('LootFactory: PurrerFactory can only be set once')
  })

  it('Should burn the loot', async () => {
    await lootFactory.mint(mockPurrer.address, 0)

    expect(await lootFactory.balanceOf(mockPurrer.address)).to.equal(1)

    await lootFactory.burn(0)
    
    expect(await lootFactory.balanceOf(mockPurrer.address)).to.equal(0)
  })
})