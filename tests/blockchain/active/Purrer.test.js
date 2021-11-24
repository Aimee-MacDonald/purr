const { expect } = require('chai')

describe('Purrer', () => {
  let signers, purrCoin, purrNFT, purrerFactory, clonedPurrerAddress, clonedPurrerAddress2, clonedPurrer, clonedPurrer2

  beforeEach(async () => {
    signers = await ethers.getSigners()

    const Purrer = await ethers.getContractFactory('Purrer')
    const PurrCoin = await ethers.getContractFactory('TIPurrCoin')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    
    const purrer = await Purrer.deploy()
    purrCoin = await PurrCoin.deploy()
    purrNFT = await PurrNFT.deploy(purrCoin.address)
    purrerFactory = await PurrerFactory.deploy(purrer.address, purrCoin.address, purrNFT.address)

    await purrerFactory.join()
    await purrerFactory.connect(signers[1]).join()
    
    clonedPurrerAddress = await purrerFactory.purrerAddress(signers[0].address)
    clonedPurrerAddress2 = await purrerFactory.purrerAddress(signers[1].address)

    clonedPurrer = await Purrer.attach(clonedPurrerAddress)
    clonedPurrer2 = await Purrer.attach(clonedPurrerAddress2)
  })

  describe('Initialization', () => {
    it('Should already be initialized', async () => {
      expect(clonedPurrer.init(purrCoin.address, purrNFT.address)).to.be.revertedWith('Initializable: contract is already initialized')
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

    it('Any wallet can only hold one purrer at a time', () => {
      expect(purrerFactory.join()).to.be.revertedWith('Purrer: Only one Purrer per wallet')
    })
  })

  describe('Purring', () => {
    it('Should be able to mint a purrNFT to another purrer', async () => {
      expect(await purrCoin.mintAllowanceOf(clonedPurrer.address)).to.equal('1000000000000000000')
      expect(await purrCoin.mintAllowanceOf(clonedPurrer2.address)).to.equal('1000000000000000000')

      await clonedPurrer.purr(clonedPurrerAddress2, 'Message', '1000000000000000000')

      expect(await purrCoin.mintAllowanceOf(clonedPurrer.address)).to.equal('0000000000000000000')
      expect(await purrNFT.balanceOf(clonedPurrer2.address)).to.equal(1)
    })

    it('Should only be callable by the contract owner', () => {
      expect(clonedPurrer2.purr(clonedPurrerAddress, 'Message', '1000000000000000000')).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })
})