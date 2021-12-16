const { expect } = require('chai')

describe('Purrer', () => {
  let mockPurrCoin, mockPurrNFT
  let signers, purrer, purrer2

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const PurrerImplementation = await ethers.getContractFactory('Purrer')
    const purrerImplementation = await PurrerImplementation.deploy()

    const MockPurrCoin = await ethers.getContractFactory('MockPurrCoin')
    mockPurrCoin = await MockPurrCoin.deploy()

    const MockPurrNFT = await ethers.getContractFactory('MockPurrNFT')
    mockPurrNFT = await MockPurrNFT.deploy()

    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    const purrerFactory = await PurrerFactory.deploy(purrerImplementation.address, mockPurrCoin.address, mockPurrNFT.address)

    await purrerFactory.mint(signers[0].address)
    const purrerAddress = await purrerFactory.addressOf(signers[0].address)
    purrer = await PurrerImplementation.attach(purrerAddress)

    await purrerFactory.mint(signers[1].address)
    const purrerAddress2 = await purrerFactory.addressOf(signers[1].address)
    purrer2 = await PurrerImplementation.attach(purrerAddress2)
  })

  describe('Initialization', () => {
    it('Should be initialised in the PurrerFactor.mint and Cannot be initialised again', async () => {
      expect(purrer.init(mockPurrCoin.address, mockPurrNFT.address)).to.be.revertedWith('Initializable: contract is already initialized')
    })

    it('Should be owned by the user', async () => {
      expect(await purrer.owner()).to.equal(signers[0].address)
    })

    it('Should be registered as a minter with PurrCoin', async () => {
      expect(await mockPurrCoin.isMinter()).to.equal(true)
    })
  })
  
  describe('Purring', () => {
    it('Purr Should Approve the purrcoin for spending and mint the PurrNFT that is sent', async () => {
      let wasApproved = await mockPurrCoin.wasApproved()
      let wasMinted = await mockPurrNFT.wasMinted()

      expect(wasApproved).to.equal(false)
      expect(wasMinted).to.equal(false)

      await purrer.purr(purrer2.address, 'Message', '1000000000000000000')

      wasApproved = await mockPurrCoin.wasApproved()
      wasMinted = await mockPurrNFT.wasMinted()

      expect(wasApproved).to.equal(true)
      expect(wasMinted).to.equal(true)
    })

    it('Can only be called by the owner', () => {
      expect(purrer2.purr(purrer.address, 'Message', '1000000000000000000')).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('Should redeem a PurrNFT', async () => {
      await purrer.purr(purrer2.address, 'Message', '1000000000000000000')
      expect(await mockPurrNFT.wasRedeemed()).to.equal(false)
      
      await purrer.redeemPurr(0)

      expect(await mockPurrNFT.wasRedeemed()).to.equal(true)
    })
  })
})