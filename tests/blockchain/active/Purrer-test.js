const { expect } = require('chai')

describe('Purrer', () => {
  let Purrer, purrer, clonedPurrer, purrerFactory, purrCoin, signers

  beforeEach(async () => {
    signers = await ethers.getSigners()

    Purrer = await ethers.getContractFactory('Purrer')
    purrer = await Purrer.deploy()
    
    const PurrCoin = await ethers.getContractFactory('PurrCoin')
    purrCoin = await PurrCoin.deploy()

    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    purrerFactory = await PurrerFactory.deploy(purrer.address, purrCoin.address)

    await purrerFactory.join()
    const clonedAddress = await purrerFactory.purrerAddress(signers[0].address)
    clonedPurrer = await Purrer.attach(clonedAddress)

  })

  describe('Initialization', () => {
    it('Should already be initialized', async () => {
      expect(clonedPurrer.init()).to.be.revertedWith('Initializable: contract is already initialized')
    })

    it('Should be owned by the user', async () => {
      expect(await clonedPurrer.owner()).to.equal(signers[0].address)
    })

    it('Should have a PURR balance of 0', async () => {
      expect(await purrCoin.balanceOf(clonedPurrer.address)).to.equal('0000000000000000000')
    })

    it('Should have a PURR minting allowance of 1', async () => {
      expect(await purrCoin.mintAllowanceOf(clonedPurrer.address)).to.equal('1000000000000000000')
    })
  })
})