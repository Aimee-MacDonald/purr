const { expect } = require('chai')

describe('Purrer', () => {
  let Purrer, purrer, clonedPurrer, purrerFactory, signers

  beforeEach(async () => {
    signers = await ethers.getSigners()

    Purrer = await ethers.getContractFactory('Purrer')
    purrer = await Purrer.deploy()

    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    purrerFactory = await PurrerFactory.deploy(purrer.address)

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
  })
})