const { expect } = require('chai')

describe('PurrerFactory', () => {
  let signers, purrerFactory, MockPurrerImplementation

  beforeEach(async () => {
    signers = await ethers.getSigners()

    MockPurrerImplementation = await ethers.getContractFactory('MockPurrer')
    const MockPurrCoin = await ethers.getContractFactory('MockPurrCoin')
    const MockPurrNFT = await ethers.getContractFactory('MockPurrNFT')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    const MockLootFactory = await ethers.getContractFactory('MockLootFactory')
    const MockMarket = await ethers.getContractFactory('MockMarket')
    
    const mockPurrerImplementation = await MockPurrerImplementation.deploy()
    const mockPurrCoin = await MockPurrCoin.deploy()
    const mockPurrNFT = await MockPurrNFT.deploy()
    const mockLootFactory = await MockLootFactory.deploy()
    const mockMarket = await MockMarket.deploy()
    purrerFactory = await PurrerFactory.deploy(mockPurrerImplementation.address, mockPurrCoin.address, mockPurrNFT.address, mockLootFactory.address, mockMarket.address)
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
      //The PurrerProxy is the proxy that is created by purr factor.
      //It is the instantiation of a Purrer contract
      purrerProxyAddress_0 = await purrerFactory.addressOf(signers[0].address)
      purrerProxyAddress_1 = await purrerFactory.addressOf(signers[1].address)
      expect(purrerProxyAddress_0).to.equal('0x0000000000000000000000000000000000000000')
      expect(purrerProxyAddress_1).to.equal('0x0000000000000000000000000000000000000000')
      
      await purrerFactory.mint(signers[0].address)
      await purrerFactory.mint(signers[1].address)
      purrerProxyAddress_0 = await purrerFactory.addressOf(signers[0].address)
      purrerProxyAddress_1 = await purrerFactory.addressOf(signers[1].address)
      
      expect(purrerProxyAddress_0).to.not.equal('0x0000000000000000000000000000000000000000')
      expect(purrerProxyAddress_1).to.not.equal('0x0000000000000000000000000000000000000000')
      expect(purrerProxyAddress_0).to.not.equal(purrerProxyAddress_1)
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

    it('Should return true for valid Purrer addresses & false for any other address', async () => {
      await purrerFactory.mint(signers[0].address)
      const purrerAddress = await purrerFactory.addressOf(signers[0].address)

      expect(await purrerFactory.isPurrer(signers[0].address)).to.equal(false)
      expect(await purrerFactory.isPurrer(purrerAddress)).to.equal(true)
    })
  })
})