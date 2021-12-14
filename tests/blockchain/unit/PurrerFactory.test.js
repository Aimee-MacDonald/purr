const { expect } = require('chai')

describe('PurrerFactory', () => {
  let signers, purrerFactory, MockPurrerImplementation

  beforeEach(async () => {
    signers = await ethers.getSigners()

    MockPurrerImplementation = await ethers.getContractFactory('MockPurrer')
    const mockPurrerImplementation = await MockPurrerImplementation.deploy()

    const MockPurrCoin = await ethers.getContractFactory('MockPurrCoin')
    const mockPurrCoin = await MockPurrCoin.deploy()

    const MockPurrNFT = await ethers.getContractFactory('MockPurrNFT')
    const mockPurrNFT = await MockPurrNFT.deploy()

    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    purrerFactory = await PurrerFactory.deploy(mockPurrerImplementation.address, mockPurrCoin.address, mockPurrNFT.address)
  })

  describe('Mint', () => {
    it('Mints a Purrer Should add the purrer to the wallet', async () => {
      expect(await purrerFactory.balanceOf(signers[0].address)).to.equal(0)

      await purrerFactory.mint(signers[0].address)

      expect(await purrerFactory.balanceOf(signers[0].address)).to.equal(1)
    })

    it('tokenURI Should return a URI for external metadata', async () => {
      await purrerFactory.mint(signers[0].address)
      expect(await purrerFactory.balanceOf(signers[0].address)).to.equal(1)

      const uri = await purrerFactory.tokenURI(0)

      expect(uri).to.equal('https://whispurr.herokuapp.com/purrerData')
    })

    it('Deploys a new Purrer proxy contract', async () => {
      expect(await purrerFactory.addressOf(signers[0].address)).to.equal('0x0000000000000000000000000000000000000000')
      expect(await purrerFactory.addressOf(signers[1].address)).to.equal('0x0000000000000000000000000000000000000000')
      
      await purrerFactory.mint(signers[0].address)
      await purrerFactory.mint(signers[1].address)
      const addr0 = await purrerFactory.addressOf(signers[0].address)
      const addr1 = await purrerFactory.addressOf(signers[1].address)

      expect(addr0).to.not.equal('0x0000000000000000000000000000000000000000')
      expect(addr1).to.not.equal('0x0000000000000000000000000000000000000000')
      expect(addr0).to.not.equal(addr1)
    })

    it('Should Initialise the new Purrer', async () => {
      await purrerFactory.mint(signers[0].address)
      const mockPurrerAddress = await purrerFactory.addressOf(signers[0].address)
      expect(mockPurrerAddress).to.not.equal('0x0000000000000000000000000000000000000000')
      const mockPurrer = await MockPurrerImplementation.attach(mockPurrerAddress)

      const initialised = await mockPurrer.initialised()

      expect(initialised).to.equal(true)
    })

    it('Transfers Ownership of the new Purrer to the reciever', async () => {
      await purrerFactory.mint(signers[0].address)
      const mockPurrerAddress = await purrerFactory.addressOf(signers[0].address)
      expect(mockPurrerAddress).to.not.equal('0x0000000000000000000000000000000000000000')
      const mockPurrer = await MockPurrerImplementation.attach(mockPurrerAddress)

      const wasTransferred = await mockPurrer.wasTransferred()
      const newOwner = await mockPurrer.wasTransferredToAddress()
      
      expect(wasTransferred).to.equal(true)
      expect(newOwner).to.equal(signers[0].address)
    })

    it('Any wallet can only hold one purrer at a time', async () => {
      await purrerFactory.mint(signers[0].address)
      expect(purrerFactory.mint(signers[0].address)).to.be.revertedWith('Purrer: Only one Purrer per wallet')
    })
  })

  describe('Governance', () => {
    it('Should be owned by deployer', async () => {
      expect(await purrerFactory.owner()).to.equal(signers[0].address)
    })
  })
})