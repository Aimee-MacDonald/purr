const { expect } = require('chai')

describe('PurrerFactory', () => {
  let purrerFactory, signers

  beforeEach(async () => {
    const Purrer = await ethers.getContractFactory('Purrer')
    const PurrCoin = await ethers.getContractFactory('TIPurrCoin')
    const PurrNFT = await ethers.getContractFactory('PurrNFT')
    const PurrerFactory = await ethers.getContractFactory('PurrerFactory')
    
    const purrer = await Purrer.deploy()
    const purrCoin = await PurrCoin.deploy()
    const purrNFT = await PurrNFT.deploy(purrCoin.address)
    
    purrerFactory = await PurrerFactory.deploy(purrer.address, purrCoin.address, purrNFT.address)

    signers = await ethers.getSigners()
  })

  describe('Ownership', () => {
    it('Should be owned by deployer', async () => {
      expect(await purrerFactory.owner()).to.equal(signers[0].address)
    })
  })

  describe('Purrer Minting', () => {
    it('Should mint a new Purrer NFT', async () => {
      expect(await purrerFactory.balanceOf(signers[0].address)).to.equal(0)

      await purrerFactory.join()

      expect(await purrerFactory.balanceOf(signers[0].address)).to.equal(1)
    })

    it('Should deploy a new Purrer proxy contract', async () => {
      expect(await purrerFactory.purrerAddress(signers[0].address)).to.equal('0x0000000000000000000000000000000000000000')
      expect(await purrerFactory.purrerAddress(signers[1].address)).to.equal('0x0000000000000000000000000000000000000000')
      
      await purrerFactory.join()
      await purrerFactory.connect(signers[1]).join()

      const addr0 = await purrerFactory.purrerAddress(signers[0].address)
      const addr1 = await purrerFactory.purrerAddress(signers[1].address)

      expect(addr0).to.not.equal('0x0000000000000000000000000000000000000000')
      expect(addr1).to.not.equal('0x0000000000000000000000000000000000000000')
      expect(addr0).to.not.equal(addr1)
    })
  })
})